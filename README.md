# 🚗 CarDealer - Online Auction Platform

A modern, responsive web application for online car auctions built with React and Node.js. Users can browse, bid on, and sell vehicles through a secure auction system.

![CarDealer Screenshot](https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- Email verification system
- Password recovery
- JWT-based authentication
- User profiles with subscription tiers

### 🏎️ Auction System
- Browse active auctions
- Real-time bidding
- Auction creation and management
- Image gallery for vehicles
- Detailed vehicle specifications
- Time-based auction endings
- Buy-now options

### 💬 Communication
- Real-time chat between buyers and sellers
- WebSocket integration for instant messaging
- Auction owner contact system

### 💳 Payment & Subscriptions
- Multiple subscription tiers (Basic, Standard, Premium)
- Secure payment processing
- Subscription management
- Payment verification

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI** - Component library
- **SCSS** - Styling
- **Axios** - HTTP client
- **Socket.io** - Real-time communication
- **React Slick** - Carousel component
- **Moment.js** - Date handling
- **React Toastify** - Notifications

### Backend Integration
- **Spring Boot API** - Backend service
- **WebSocket** - Real-time features
- **JWT** - Authentication
- **RESTful APIs** - Data communication

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Redux Persist** - State persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bidding-app-frontend.git
cd bidding-app-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://springboot-bidding-app-api.onrender.com/api/v1
VITE_WS_URL=https://springboot-bidding-app-api.onrender.com/api/v1/ws
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 📱 Responsive Breakpoints

The application uses a mobile-first responsive design with the following breakpoints:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px and above

## 🎯 Usage

### For Buyers
1. **Register/Login** to your account
2. **Browse Auctions** on the homepage
3. **View Details** by clicking on any auction
4. **Place Bids** on items you're interested in
5. **Chat** with sellers for more information
6. **Monitor** your active bids in "My Auctions"

### For Sellers
1. **Upgrade** your subscription for selling privileges
2. **Post Auctions** using the "Post an Auction" button
3. **Manage** your auctions from the dashboard
4. **Chat** with potential buyers
5. **Close** auctions when ready

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── navbar/         # Navigation component
│   ├── footer/         # Footer component
│   ├── auction/        # Auction card component
│   ├── bidHistory/     # Bidding history component
│   └── ...
├── pages/              # Page components
│   ├── home/           # Homepage
│   ├── login/          # Authentication pages
│   ├── product/        # Auction details
│   ├── chat/           # Messaging system
│   └── ...
├── redux/              # State management
│   ├── store.js        # Redux store configuration
│   ├── userRedux.js    # User state slice
│   └── ...
├── assets/             # Static assets
└── styles/             # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: #57b3ac (Teal)
- **Secondary**: #ffba02 (Yellow)
- **Background**: #f5f5f5 (Light Gray)
- **Text**: #333333 (Dark Gray)

### Typography
- **Font Family**: Poppins
- **Weights**: 100, 300, 400, 500, 600, 700

## 🔌 API Integration

The frontend communicates with a Spring Boot backend API:

- **Base URL**: `https://springboot-bidding-app-api.onrender.com/api/v1`
- **Authentication**: JWT tokens
- **Real-time**: WebSocket connections
- **File Upload**: Image handling for auctions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
The application can be easily deployed to Netlify:

1. Build the project
2. Upload the `dist` folder
3. Configure redirects for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- WebSocket connection may need refresh on slow networks
- Image uploads are limited to URLs (file upload coming soon)
- Mobile chat interface needs optimization

## 🔮 Future Enhancements

- [ ] File upload for auction images
- [ ] Advanced search and filtering
- [ ] Auction categories
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## 📞 Support

For support, email support@cardealer.com or join our Slack channel.

## 🙏 Acknowledgments

- [Pexels](https://pexels.com) for stock images
- [Material-UI](https://mui.com) for component library
- [React Slick](https://react-slick.neostack.com) for carousel functionality
- Spring Boot team for the backend framework

---

**Built with ❤️ by the CarDealer Team**# react-bid-app
