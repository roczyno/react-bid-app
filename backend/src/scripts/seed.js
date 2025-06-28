import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

async function main() {
  try {
    logger.info('Starting database seed...');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.seller@example.com',
          password: hashedPassword,
          firstName: 'John',
          lastName: 'Seller',
          phone: '+1234567890',
          isEmailVerified: true,
          subscriptionTier: 'PREMIUM'
        }
      }),
      prisma.user.create({
        data: {
          email: 'jane.bidder@example.com',
          password: hashedPassword,
          firstName: 'Jane',
          lastName: 'Bidder',
          phone: '+1234567891',
          isEmailVerified: true,
          subscriptionTier: 'STANDARD'
        }
      }),
      prisma.user.create({
        data: {
          email: 'mike.buyer@example.com',
          password: hashedPassword,
          firstName: 'Mike',
          lastName: 'Buyer',
          phone: '+1234567892',
          isEmailVerified: true,
          subscriptionTier: 'BASIC'
        }
      })
    ]);

    logger.info(`Created ${users.length} users`);

    // Create sample auctions
    const auctions = await Promise.all([
      prisma.auction.create({
        data: {
          title: '2020 Tesla Model 3 Performance',
          description: 'Excellent condition Tesla Model 3 Performance with autopilot, premium interior, and low mileage. Always garage kept and meticulously maintained.',
          startingPrice: 35000,
          currentPrice: 35000,
          buyNowPrice: 50000,
          reservePrice: 40000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          images: [
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
            'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'
          ],
          make: 'Tesla',
          model: 'Model 3',
          year: 2020,
          mileage: 25000,
          condition: 'EXCELLENT',
          fuelType: 'Electric',
          transmission: 'Automatic',
          color: 'Pearl White',
          vin: '5YJ3E1EA8LF123456',
          location: 'San Francisco, CA',
          sellerId: users[0].id
        }
      }),
      prisma.auction.create({
        data: {
          title: '2019 BMW M3 Competition',
          description: 'Stunning BMW M3 Competition in Alpine White. Twin-turbo inline-6 engine, carbon fiber trim, and M Performance exhaust. Perfect for enthusiasts.',
          startingPrice: 45000,
          currentPrice: 45000,
          buyNowPrice: 65000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          images: [
            'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
            'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg'
          ],
          make: 'BMW',
          model: 'M3',
          year: 2019,
          mileage: 18000,
          condition: 'EXCELLENT',
          fuelType: 'Gasoline',
          transmission: 'Manual',
          color: 'Alpine White',
          vin: 'WBS8M9C55K5A12345',
          location: 'Los Angeles, CA',
          sellerId: users[0].id
        }
      }),
      prisma.auction.create({
        data: {
          title: '2018 Porsche 911 Carrera S',
          description: 'Classic Porsche 911 Carrera S with PDK transmission. Guards Red exterior with black leather interior. Service records available.',
          startingPrice: 75000,
          currentPrice: 75000,
          reservePrice: 85000,
          startTime: new Date(),
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          images: [
            'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
            'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'
          ],
          make: 'Porsche',
          model: '911',
          year: 2018,
          mileage: 12000,
          condition: 'EXCELLENT',
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          color: 'Guards Red',
          vin: 'WP0AB2A99JS123456',
          location: 'Miami, FL',
          sellerId: users[0].id
        }
      })
    ]);

    logger.info(`Created ${auctions.length} auctions`);

    // Create sample bids
    const bids = await Promise.all([
      prisma.bid.create({
        data: {
          amount: 36000,
          auctionId: auctions[0].id,
          bidderId: users[1].id
        }
      }),
      prisma.bid.create({
        data: {
          amount: 37500,
          auctionId: auctions[0].id,
          bidderId: users[2].id
        }
      }),
      prisma.bid.create({
        data: {
          amount: 46000,
          auctionId: auctions[1].id,
          bidderId: users[1].id
        }
      }),
      prisma.bid.create({
        data: {
          amount: 76000,
          auctionId: auctions[2].id,
          bidderId: users[2].id
        }
      })
    ]);

    // Update auction current prices
    await Promise.all([
      prisma.auction.update({
        where: { id: auctions[0].id },
        data: { currentPrice: 37500 }
      }),
      prisma.auction.update({
        where: { id: auctions[1].id },
        data: { currentPrice: 46000 }
      }),
      prisma.auction.update({
        where: { id: auctions[2].id },
        data: { currentPrice: 76000 }
      })
    ]);

    logger.info(`Created ${bids.length} bids`);

    // Create sample messages
    const messages = await Promise.all([
      prisma.message.create({
        data: {
          content: 'Hi, I\'m interested in your Tesla. Can you tell me more about the maintenance history?',
          senderId: users[1].id,
          receiverId: users[0].id,
          auctionId: auctions[0].id
        }
      }),
      prisma.message.create({
        data: {
          content: 'Hello! The car has been serviced regularly at Tesla service center. All records are available. Would you like to schedule a viewing?',
          senderId: users[0].id,
          receiverId: users[1].id,
          auctionId: auctions[0].id
        }
      }),
      prisma.message.create({
        data: {
          content: 'That would be great! I\'m available this weekend. What times work for you?',
          senderId: users[1].id,
          receiverId: users[0].id,
          auctionId: auctions[0].id
        }
      })
    ]);

    logger.info(`Created ${messages.length} messages`);

    // Create sample notifications
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          title: 'New Bid on Your Auction',
          message: 'Jane Bidder placed a bid of $36,000 on your Tesla Model 3',
          type: 'BID_PLACED',
          userId: users[0].id
        }
      }),
      prisma.notification.create({
        data: {
          title: 'You\'ve Been Outbid',
          message: 'Your bid on Tesla Model 3 has been outbid. Current price: $37,500',
          type: 'BID_OUTBID',
          userId: users[1].id
        }
      }),
      prisma.notification.create({
        data: {
          title: 'New Message',
          message: 'John Seller sent you a message about Tesla Model 3',
          type: 'MESSAGE_RECEIVED',
          userId: users[1].id
        }
      })
    ]);

    logger.info(`Created ${notifications.length} notifications`);

    logger.info('Database seed completed successfully!');
    
    // Log sample user credentials
    logger.info('\n=== Sample User Credentials ===');
    logger.info('Seller Account:');
    logger.info('Email: john.seller@example.com');
    logger.info('Password: password123');
    logger.info('Subscription: Premium');
    logger.info('\nBidder Account:');
    logger.info('Email: jane.bidder@example.com');
    logger.info('Password: password123');
    logger.info('Subscription: Standard');
    logger.info('\nBuyer Account:');
    logger.info('Email: mike.buyer@example.com');
    logger.info('Password: password123');
    logger.info('Subscription: Basic');
    logger.info('===============================\n');

  } catch (error) {
    logger.error('Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    logger.error('Seed failed:', e);
    process.exit(1);
  });