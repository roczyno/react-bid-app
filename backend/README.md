# CarDealer Backend API

A comprehensive Node.js backend API for the CarDealer online auction platform, built with Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Email verification system
- Password recovery with secure tokens
- Role-based access control
- Subscription tier management

### 🏎️ Auction Management
- Create, read, update, delete auctions
- Real-time bidding system
- Auction status management (draft, active, ended, cancelled)
- Image gallery support
- Advanced filtering and search
- Automatic auction ending

### 💬 Real-time Communication
- WebSocket integration with Socket.IO
- Real-time bidding updates
- Instant messaging between users
- Typing indicators
- Live notifications

### 💳 Payment Processing
- Stripe integration for secure payments
- Subscription management
- Payment history tracking
- Webhook handling for payment events

### 📧 Email System
- Email verification
- Password reset emails
- Auction notifications
- Customizable email templates

### 🔔 Notification System
- Real-time notifications
- Email notifications
- Push notifications support
- Notification preferences

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Prisma** - Database ORM and query builder
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **Stripe** - Payment processing
- **Nodemailer** - Email sending
- **bcryptjs** - Password hashing
- **Winston** - Logging
- **Helmet** - Security middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Stripe account (for payments)
- Email service (Gmail, SendGrid, etc.)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cardealer?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# CORS
FRONTEND_URL="http://localhost:5173"
```

4. **Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed database with sample data
npm run db:seed
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── auth.js       # Authentication routes
│   │   ├── auctions.js   # Auction management
│   │   ├── bids.js       # Bidding system
│   │   ├── messages.js   # Messaging system
│   │   ├── payments.js   # Payment processing
│   │   ├── users.js      # User management
│   │   └── notifications.js # Notification system
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── errorHandler.js # Error handling
│   ├── socket/           # Socket.IO handlers
│   │   └── socketHandlers.js # Real-time event handlers
│   ├── utils/            # Utility functions
│   │   ├── email.js      # Email sending utilities
│   │   └── logger.js     # Logging configuration
│   ├── scripts/          # Database scripts
│   │   └── seed.js       # Database seeding
│   └── server.js         # Main server file
├── prisma/
│   └── schema.prisma     # Database schema
├── logs/                 # Application logs
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/change-password` - Change password
- `GET /api/v1/users/stats` - Get user statistics
- `DELETE /api/v1/users/account` - Delete account

### Auctions
- `GET /api/v1/auctions` - Get all auctions (public)
- `GET /api/v1/auctions/:id` - Get single auction
- `POST /api/v1/auctions` - Create auction (requires subscription)
- `PUT /api/v1/auctions/:id` - Update auction
- `DELETE /api/v1/auctions/:id` - Delete auction
- `GET /api/v1/auctions/user/my-auctions` - Get user's auctions

### Bidding
- `POST /api/v1/bids` - Place a bid
- `GET /api/v1/bids/my-bids` - Get user's bids
- `GET /api/v1/bids/auction/:auctionId` - Get auction bid history

### Messaging
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/conversation/:userId` - Get conversation
- `GET /api/v1/messages/conversations` - Get all conversations

### Payments
- `POST /api/v1/payments/create-payment-intent` - Create payment intent
- `POST /api/v1/payments/confirm-payment` - Confirm payment
- `GET /api/v1/payments/history` - Get payment history
- `GET /api/v1/payments/subscription-tiers` - Get subscription tiers
- `POST /api/v1/payments/webhook` - Stripe webhook

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

## 🔄 Real-time Events (Socket.IO)

### Client to Server
- `joinAuction` - Join auction room for real-time updates
- `leaveAuction` - Leave auction room
- `placeBid` - Place a bid in real-time
- `sendMessage` - Send instant message
- `typing` - Send typing indicator
- `updateAuction` - Update auction (sellers only)

### Server to Client
- `newBid` - New bid placed on auction
- `newMessage` - New message received
- `userTyping` - User typing indicator
- `auctionUpdated` - Auction details updated
- `auctionEnded` - Auction ended automatically
- `notification` - New notification
- `bidError` - Bid placement error
- `messageError` - Message sending error

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users** - User accounts with subscription tiers
- **Auctions** - Vehicle auction listings
- **Bids** - Bidding records
- **Messages** - User-to-user messaging
- **Payments** - Payment transaction records
- **Notifications** - User notifications

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - Prisma ORM protection

## 📊 Subscription Tiers

### Basic (Free)
- Browse auctions
- Place bids
- Basic messaging

### Standard ($9.99/month)
- All Basic features
- Create up to 10 auctions
- Basic support

### Premium ($19.99/month)
- All Standard features
- Unlimited auctions
- Priority support
- Advanced analytics
- Featured listings

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with nodemon

# Production
npm start               # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with sample data
```

## 🌐 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong JWT secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `EMAIL_*` - Email service configuration
- `NODE_ENV=production`

### Database Migration
```bash
npm run db:migrate
```

### Process Management
Consider using PM2 for production process management:
```bash
npm install -g pm2
pm2 start src/server.js --name cardealer-api
```

## 📝 Sample Data

The seed script creates sample users with the following credentials:

**Seller Account (Premium)**
- Email: john.seller@example.com
- Password: password123

**Bidder Account (Standard)**
- Email: jane.bidder@example.com
- Password: password123

**Buyer Account (Basic)**
- Email: mike.buyer@example.com
- Password: password123

## 🐛 Error Handling

The API includes comprehensive error handling:

- **Validation Errors** - 400 Bad Request
- **Authentication Errors** - 401 Unauthorized
- **Authorization Errors** - 403 Forbidden
- **Not Found Errors** - 404 Not Found
- **Server Errors** - 500 Internal Server Error

All errors are logged using Winston and include request context.

## 📈 Monitoring & Logging

- **Winston Logger** - Structured logging with multiple transports
- **Request Logging** - All API requests are logged
- **Error Tracking** - Comprehensive error logging with stack traces
- **Performance Monitoring** - Response time tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@cardealer.com
- Documentation: [API Documentation](docs/api.md)

---

**Built with ❤️ by the CarDealer Team**