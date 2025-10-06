# 🚀 Deployment Guide - TravelSensei

This guide covers deployment options for both development and production environments.

## 📋 Pre-Deployment Checklist

### Backend Readiness
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] OpenAI API key active
- [ ] CORS settings updated for production domain
- [ ] JWT secret is strong (32+ characters)
- [ ] Error handling tested
- [ ] API endpoints documented

### Frontend Readiness
- [ ] API endpoints pointing to production backend
- [ ] Build process tested (`npm run build`)
- [ ] No console errors in production build
- [ ] Responsive design verified
- [ ] All routes working correctly

## 🌐 Production Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Backend Deployment on Heroku
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create Heroku app
cd backend
heroku create your-app-name-backend

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-super-strong-jwt-secret
heroku config:set OPENAI_API_KEY=your-openai-key
heroku config:set FRONTEND_URL=https://your-frontend-domain.com

# 5. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Frontend Deployment on Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy frontend
cd travelsensei
vercel

# 3. Follow prompts and set environment variables in Vercel dashboard
```

### Option 2: Railway (Modern Alternative)

#### Backend on Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
cd backend
railway init
railway up

# 3. Set environment variables in Railway dashboard
```

### Option 3: DigitalOcean App Platform

#### Both Frontend and Backend
1. Create DigitalOcean account
2. Use App Platform
3. Connect GitHub repository
4. Configure environment variables
5. Deploy with automatic builds

### Option 4: AWS (Advanced)

#### Backend on AWS EC2
```bash
# 1. Launch EC2 instance (Ubuntu 20.04 LTS)
# 2. Install Node.js and PM2
sudo apt update
sudo apt install nodejs npm
sudo npm install -g pm2

# 3. Clone repository
git clone your-repo-url
cd TravelSensei/backend
npm install

# 4. Configure environment variables
cp .env.example .env
# Edit .env with production values

# 5. Start with PM2
pm2 start server.js --name "travelsensei-backend"
pm2 save
pm2 startup
```

#### Frontend on AWS S3 + CloudFront
```bash
# 1. Build React app
cd travelsensei
npm run build

# 2. Create S3 bucket for static hosting
# 3. Upload build files to S3
# 4. Configure CloudFront for CDN
# 5. Update Route 53 for custom domain
```

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Set up database user and password
4. Configure network access (IP whitelist)
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/travelsensei
   ```

### Self-Hosted MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Configure firewall
sudo ufw allow 27017

# Secure MongoDB
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "strongpassword",
  roles: ["userAdminAnyDatabase"]
})
```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelsensei
JWT_SECRET=super-strong-production-secret-key-32-chars-minimum
OPENAI_API_KEY=sk-your-openai-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (environment variables)
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_ENV=production
```

## 🔐 Security Considerations

### Backend Security
- [ ] Use HTTPS only in production
- [ ] Strong JWT secret (32+ characters)
- [ ] Enable rate limiting
- [ ] Input validation on all endpoints
- [ ] CORS configured for specific domains
- [ ] Hide error details in production
- [ ] Regular security updates

### Database Security
- [ ] Use MongoDB Atlas or secure self-hosted instance
- [ ] Enable authentication
- [ ] Use connection string with credentials
- [ ] Regular backups
- [ ] Network restrictions (IP whitelist)

### API Keys Security
- [ ] Store API keys in environment variables
- [ ] Never commit API keys to version control
- [ ] Rotate API keys regularly
- [ ] Use different keys for development/production

## 📊 Monitoring & Analytics

### Error Tracking
```bash
# Install Sentry for error tracking
npm install @sentry/node @sentry/integrations

# Add to server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Performance Monitoring
```bash
# Install New Relic or similar
npm install newrelic

# Add to package.json start script
"start": "node -r newrelic server.js"
```

### Health Checks
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🧪 Testing in Production

### Automated Testing
```bash
# Run tests before deployment
npm test

# E2E testing with Cypress
npm install --save-dev cypress
npx cypress run
```

### Manual Testing Checklist
- [ ] User registration works
- [ ] User login/logout works
- [ ] Protected routes are secured
- [ ] API endpoints respond correctly
- [ ] File uploads work
- [ ] AI features function properly
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd backend && npm install
        cd ../travelsensei && npm install
        
    - name: Run tests
      run: |
        cd backend && npm test
        cd ../travelsensei && npm test
        
    - name: Build frontend
      run: cd travelsensei && npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🆘 Troubleshooting

### Common Issues

#### CORS Errors
```javascript
// Fix CORS in server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### Environment Variables Not Loading
```bash
# Verify .env file exists and is properly formatted
# No spaces around = sign
# No quotes unless needed
```

#### Database Connection Issues
```javascript
// Add connection error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
```

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

**Need Help?** Create an issue in the repository or contact support.

*Happy Deploying! 🚀*