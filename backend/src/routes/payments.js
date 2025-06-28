import express from 'express';
import Stripe from 'stripe';
import { logger } from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Subscription tiers configuration
const SUBSCRIPTION_TIERS = {
  STANDARD: {
    name: 'Standard',
    price: 9.99,
    features: ['Create auctions', 'Basic support', 'Up to 10 active auctions']
  },
  PREMIUM: {
    name: 'Premium',
    price: 19.99,
    features: ['Unlimited auctions', 'Priority support', 'Advanced analytics', 'Featured listings']
  }
};

// Create payment intent for subscription
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { tier } = req.body;

    if (!tier || !SUBSCRIPTION_TIERS[tier]) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }

    const amount = Math.round(SUBSCRIPTION_TIERS[tier].price * 100); // Convert to cents

    // Create or get Stripe customer
    let stripeCustomerId = req.user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        metadata: {
          userId: req.user.id
        }
      });

      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await req.prisma.user.update({
        where: { id: req.user.id },
        data: { stripeCustomerId }
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId,
      metadata: {
        userId: req.user.id,
        subscriptionTier: tier,
        type: 'subscription'
      },
      description: `${SUBSCRIPTION_TIERS[tier].name} Subscription - CarDealer`
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      tier,
      features: SUBSCRIPTION_TIERS[tier].features
    });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment and upgrade subscription
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    if (paymentIntent.metadata.userId !== req.user.id) {
      return res.status(403).json({ error: 'Payment does not belong to this user' });
    }

    const tier = paymentIntent.metadata.subscriptionTier;
    const amount = paymentIntent.amount / 100; // Convert from cents

    // Create payment record and update user subscription in transaction
    const result = await req.prisma.$transaction(async (prisma) => {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          amount,
          status: 'COMPLETED',
          stripePaymentId: paymentIntentId,
          description: `${SUBSCRIPTION_TIERS[tier].name} Subscription`,
          userId: req.user.id
        }
      });

      // Update user subscription
      const subscriptionExpires = new Date();
      subscriptionExpires.setMonth(subscriptionExpires.getMonth() + 1); // 1 month subscription

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          subscriptionTier: tier,
          subscriptionExpires
        },
        select: {
          id: true,
          subscriptionTier: true,
          subscriptionExpires: true
        }
      });

      return { payment, user: updatedUser };
    });

    // Create success notification
    try {
      await req.prisma.notification.create({
        data: {
          title: 'Payment Successful',
          message: `Your ${SUBSCRIPTION_TIERS[tier].name} subscription has been activated!`,
          type: 'PAYMENT_SUCCESS',
          userId: req.user.id
        }
      });
    } catch (notificationError) {
      logger.error('Failed to create payment notification:', notificationError);
    }

    res.json({
      message: 'Payment confirmed and subscription upgraded',
      payment: result.payment,
      user: result.user
    });
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get user's payment history
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
      req.prisma.payment.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      req.prisma.payment.count({
        where: { userId: req.user.id }
      })
    ]);

    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Get subscription tiers
router.get('/subscription-tiers', (req, res) => {
  res.json({
    tiers: SUBSCRIPTION_TIERS
  });
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        logger.info('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        logger.error('Payment failed:', failedPayment.id);
        
        // Create failure notification
        if (failedPayment.metadata.userId) {
          await req.prisma.notification.create({
            data: {
              title: 'Payment Failed',
              message: 'Your payment could not be processed. Please try again.',
              type: 'PAYMENT_FAILED',
              userId: failedPayment.metadata.userId
            }
          });
        }
        break;

      default:
        logger.info('Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;