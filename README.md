# Genproject - Interview Platform

A full-stack web application for managing and conducting interviews with AI-powered features. Built with React (Frontend) and Node.js/Express (Backend).

## 🌟 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **Interview Management**: Create, manage, and conduct interviews
- **AI Integration**: AI-powered interview analysis and reporting
- **Protected Routes**: Role-based access control for different user types
- **File Upload**: Support for file uploads with middleware validation
- **Interview Reports**: Generate detailed interview reports and analysis
- **Blacklist Management**: User blacklist functionality for security

## 🏗️ Project Structure

```
Genproject/
├── frontend/                 # React + Vite frontend application
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Authentication feature (login, register, protected routes)
│   │   │   └── interview/   # Interview feature (pages, services, context)
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── app.routes.jsx   # Route definitions
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── server/                   # Node.js/Express backend
    ├── src/
    │   ├── config/          # Database configuration
    │   ├── controller/      # Request handlers (auth, interview)
    │   ├── middlewares/     # Express middlewares (auth, file upload)
    │   ├── models/          # Data models (user, interview, blacklist)
    │   ├── routes/          # API route definitions
    │   ├── services/        # Business logic (AI service)
    │   ├── app.js           # Express app configuration
    │   └── server.js        # Server entry point
    ├── package.json
    └── server.js
```

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **SCSS** - Styling
- **ESLint** - Code quality
- **React Router** - Navigation
- **Context API** - State management
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database (configured in config/database.js)
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **AI Integration** - AI service for interview analysis

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Environment variables** (.env file)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Genproject
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with required variables
# Add the following:
# - DATABASE_URL=<your-mongodb-url>
# - JWT_SECRET=<your-secret-key>
# - PORT=5000 (or your preferred port)
# - NODE_ENV=development

# Start the server
npm start
# or for development with auto-reload:
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file if needed with API endpoints
# - VITE_API_URL=http://localhost:5000 (backend URL)

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/genproject
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### Frontend (.env or .env.local)
```
VITE_API_URL=http://localhost:5000
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Interview Routes (`/api/interview`)
- `GET /` - Get all interviews
- `POST /` - Create new interview
- `GET /:id` - Get interview details
- `PUT /:id` - Update interview
- `DELETE /:id` - Delete interview

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default)
The backend API will be available at `http://localhost:5000`

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend (if applicable)
cd ../server
npm run build
```

## 🔐 Authentication Flow

1. User registers or logs in via the frontend
2. Backend validates credentials and returns JWT token
3. Token is stored in local storage/cookies
4. Protected routes check for valid token
5. Invalid/expired tokens trigger re-authentication

## 📁 Key Files Explanation

- **frontend/src/App.jsx** - Main application component
- **frontend/src/app.routes.jsx** - Route configuration
- **frontend/src/features/auth/auth.context.jsx** - Auth state management
- **frontend/src/features/interview/interview.context.jsx** - Interview state management
- **server/src/app.js** - Express app setup
- **server/src/config/database.js** - MongoDB connection
- **server/src/middlewares/auth.middleware.js** - JWT verification
- **server/src/services/ai.service.js** - AI integration logic

## 🧪 Testing

```bash
# Backend tests (if configured)
cd server
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## 📦 Building & Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
- Use services like Heroku, AWS, Google Cloud, or DigitalOcean
- Set environment variables on the hosting platform
- Ensure MongoDB is accessible from your server

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit a pull request

## 📄 Code Style

- **Frontend**: ESLint configuration in `frontend/eslint.config.js`
- **Backend**: Follow Express best practices
- Use meaningful variable and function names
- Add comments for complex logic

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Check if backend is running on the correct port
- Verify `VITE_API_URL` environment variable
- Check browser console for CORS errors

### Authentication errors
- Ensure JWT_SECRET is set in backend .env
- Clear browser storage and try logging in again
- Check token expiration time

### Database connection issues
- Verify MongoDB is running
- Check DATABASE_URL is correct
- Ensure network access if using cloud MongoDB

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error messages and environment details

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

- Frontend Developer - React/Vite
- Backend Developer - Node.js/Express
- DevOps/Deployment - Infrastructure

## 🗺️ Roadmap

- [ ] Add user profile management
- [ ] Implement advanced interview analytics
- [ ] Add real-time notifications
- [ ] Implement video interview feature
- [ ] Add more AI analysis capabilities
- [ ] Mobile app development

---

**Last Updated**: June 2026
**Version**: 1.0.0
