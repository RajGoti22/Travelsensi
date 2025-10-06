# TravelSensei Backend API

A comprehensive Node.js/Express backend API for the TravelSensei AI-powered travel planning platform.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with role-based access
- 🤖 **AI Integration** - OpenAI-powered itinerary generation and travel recommendations
- 📊 **Database Management** - MongoDB with Mongoose ODM for data persistence
- 🔍 **Advanced Search** - Complex filtering and pagination for itineraries
- 📁 **File Upload** - Secure image upload with validation and size limits
- 🔒 **Security** - Helmet, CORS, rate limiting, and input validation
- 📈 **Analytics** - User statistics and engagement tracking
- 🎯 **Review System** - Comprehensive review and rating system
- 🎫 **Booking Management** - Complete booking workflow with status tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **AI Service**: OpenAI API
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Express Rate Limit
- **Environment**: Dotenv

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### AI Routes (`/api/ai`)
- `POST /generate-itinerary` - Generate AI-powered itinerary
- `POST /chat` - AI travel assistant chat
- `POST /recommend` - Get travel recommendations

### Itinerary Routes (`/api/itineraries`)
- `GET /` - Get all public itineraries (with filtering)
- `GET /:id` - Get single itinerary
- `POST /` - Create new itinerary
- `PUT /:id` - Update itinerary
- `DELETE /:id` - Delete itinerary
- `POST /:id/like` - Like/unlike itinerary
- `POST /:id/save` - Save/unsave itinerary
- `GET /my/all` - Get user's own itineraries

### Booking Routes (`/api/bookings`)
- `GET /` - Get user's bookings
- `GET /:id` - Get single booking
- `POST /` - Create new booking
- `PUT /:id` - Update booking
- `POST /:id/cancel` - Cancel booking
- `GET /stats` - Get booking statistics

### Review Routes (`/api/reviews`)
- `GET /itinerary/:itineraryId` - Get reviews for itinerary
- `GET /:id` - Get single review
- `POST /` - Create new review
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review
- `POST /:id/helpful` - Mark review as helpful
- `POST /:id/report` - Report review
- `GET /my/all` - Get user's reviews
- `GET /my/stats` - Get review statistics

### User Routes (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /stats` - Get user statistics

### Upload Routes (`/api/upload`)
- `POST /single` - Upload single image
- `POST /multiple` - Upload multiple images

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration values.

4. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env` file

5. **OpenAI API Key**
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Get your API key and add it to `.env`

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/travelsensei

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Models

### User Model
- Personal information and preferences
- Authentication credentials
- User statistics and activity tracking

### Itinerary Model
- Complete travel itinerary details
- AI generation metadata
- Engagement statistics (views, likes, saves)

### Booking Model
- Comprehensive booking information
- Travel dates and traveler details
- Pricing and payment status

### Review Model
- Detailed reviews with multiple rating categories
- Moderation system for content quality
- Engagement tracking (helpful votes)

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Express Validator for data sanitization
- **CORS Configuration** - Proper cross-origin resource sharing
- **Helmet Security** - Various HTTP security headers
- **File Upload Security** - Size limits and type validation

## API Response Format

All API endpoints follow a consistent response format:

```javascript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Testing

```bash
npm test
```

## Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set secure JWT secret
   - Configure OpenAI API key

2. **Database Migration**
   - Ensure MongoDB is accessible
   - Create necessary indexes

3. **Process Management**
   - Use PM2 or similar for process management
   - Configure reverse proxy (Nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.