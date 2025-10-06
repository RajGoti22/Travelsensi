# 🌍 TravelSensei - AI-Powered Travel Planning Platform

A comprehensive full-stack travel planning application powered by AI, built with React.js frontend and Node.js/Express backend.

## ✨ Features

### 🤖 **AI-Powered Travel Planning**
- Intelligent itinerary generation using OpenAI API
- Personalized travel recommendations
- AI travel assistant chat bot
- Smart destination suggestions based on preferences

### 🔐 **Authentication & User Management**
- Secure JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes and role-based access

### 🗺️ **Comprehensive Travel Management**
- Create, edit, and share travel itineraries
- Advanced search and filtering
- Community reviews and ratings
- Booking management system
- File upload for travel photos

### 📱 **Modern UI/UX**
- Fully responsive design for all devices
- Material-UI components
- Professional and user-friendly interface
- Dark/light theme support
- Mobile-first approach

### 🚀 **Full-Stack Architecture**
- React.js frontend with modern hooks and context
- Express.js backend with RESTful APIs
- MongoDB database with Mongoose ODM
- Real-time data synchronization

## 🏗️ Technology Stack

### Frontend
- **React.js 18** - Modern React with hooks and functional components
- **Material-UI (MUI) 5** - Professional component library
- **React Router 6** - Client-side routing
- **React Hook Form** - Form validation and management
- **Yup** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### AI & External Services
- **OpenAI API** - AI-powered features
- **Cloudinary** - Advanced image management (optional)
- **Nodemailer** - Email notifications (optional)

### Development Tools
- **Nodemon** - Development server auto-reload
- **ESLint** - Code quality and consistency
- **Jest** - Testing framework
- **Supertest** - API testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key (for AI features)

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd TravelSensei

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../travelsensei
npm install
```

### 2. Environment Configuration
```bash
# Backend environment (.env in backend folder)
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/travelsensei
JWT_SECRET=your-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=your-openai-api-key-here
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Application
```bash
# Terminal 1: Start Backend Server
cd backend
npm run dev

# Terminal 2: Start Frontend Server
cd travelsensei
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## 📁 Project Structure

```
TravelSensei/
├── backend/                    # Express.js Backend
│   ├── models/                # MongoDB models
│   │   ├── User.js           # User schema
│   │   ├── Itinerary.js      # Itinerary schema
│   │   ├── Booking.js        # Booking schema
│   │   └── Review.js         # Review schema
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management
│   │   ├── itineraries.js   # Itinerary CRUD
│   │   ├── bookings.js      # Booking management
│   │   ├── reviews.js       # Review system
│   │   ├── ai.js            # AI integration
│   │   └── upload.js        # File uploads
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── notFound.js     # 404 handler
│   ├── server.js           # Express server setup
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
│
├── travelsensei/             # React.js Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── layout/     # Layout components
│   │   │   └── common/     # Common UI components
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Landing page
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── profile/    # User profile pages
│   │   │   ├── itinerary/  # Itinerary pages
│   │   │   ├── booking/    # Booking pages
│   │   │   └── community/  # Community pages
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContextNew.js  # Authentication context
│   │   ├── services/       # API services
│   │   │   └── api.js      # API client
│   │   ├── utils/          # Utility functions
│   │   │   └── theme-enhanced.js  # MUI theme
│   │   ├── App.jsx         # Main app component
│   │   └── index.js        # React entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
│
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### AI Services
- `POST /api/ai/generate-itinerary` - Generate AI itinerary
- `POST /api/ai/chat` - AI travel assistant
- `POST /api/ai/recommend` - Get travel recommendations

### Itineraries
- `GET /api/itineraries` - Get all itineraries (with filtering)
- `GET /api/itineraries/:id` - Get single itinerary
- `POST /api/itineraries` - Create new itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary
- `POST /api/itineraries/:id/like` - Like/unlike itinerary
- `POST /api/itineraries/:id/save` - Save/unsave itinerary

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/cancel` - Cancel booking

### Reviews
- `GET /api/reviews/itinerary/:id` - Get reviews for itinerary
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### File Upload
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

## 🧪 Testing

### Frontend Testing
```bash
cd travelsensei
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing Checklist
- [ ] Backend health check: Click "Test API Connection" on homepage
- [ ] User registration: Create new account
- [ ] User login: Sign in with created account
- [ ] Protected routes: Access dashboard when logged in
- [ ] AI features: Test itinerary generation (requires OpenAI key)
- [ ] File upload: Upload profile pictures
- [ ] CRUD operations: Create, read, update, delete itineraries
- [ ] Responsive design: Test on mobile devices

## 🚀 Production Deployment

### Environment Variables for Production
```env
# Backend Production Environment
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelsensei
JWT_SECRET=your-super-strong-production-secret-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Build for Production
```bash
# Build React frontend
cd travelsensei
npm run build

# The build folder contains the production build
# Serve it with your preferred static hosting service
```

### Deployment Options
- **Frontend**: Vercel, Netlify, Firebase Hosting
- **Backend**: Heroku, Railway, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🔧 Configuration

### MongoDB Setup
1. **Local MongoDB**: Install MongoDB locally or use Docker
2. **MongoDB Atlas**: Create a cloud database cluster
3. Update `MONGODB_URI` in your `.env` file

### OpenAI API Setup
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add the key to your `.env` file as `OPENAI_API_KEY`

### Email Configuration (Optional)
For email notifications, add to `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI-powered features
- Material-UI for beautiful components
- MongoDB for flexible data storage
- React.js community for excellent documentation

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@travelsensei.com
- Documentation: Check the inline code comments

---

**Built with ❤️ by the TravelSensei Team**

*Happy Traveling! 🌍✈️*