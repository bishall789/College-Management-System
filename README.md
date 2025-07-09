# 🎓 College Management System

A complete full-stack application with Node.js backend API and React frontend for managing college students.

## 🚀 Features

### 🔐 Backend API
- **Authentication**: JWT-based auth with rate limiting
- **CRUD Operations**: Complete student management
- **Validation**: Input validation and sanitization
- **Documentation**: Interactive Swagger/OpenAPI docs
- **Logging**: Structured logging with Winston
- **Testing**: Comprehensive test suite with Jest
- **Security**: Helmet, CORS, rate limiting, input sanitization

### 🎨 Frontend
- **Modern React**: Hooks, Context API, React Query
- **Responsive UI**: Tailwind CSS with mobile-first design
- **Authentication**: Protected routes and token management
- **Real-time Updates**: Optimistic updates with React Query
- **Form Handling**: React Hook Form with validation
- **User Experience**: Toast notifications and loading states

## 🛠️ Quick Setup

### Option 1: Docker (Recommended)
\`\`\`bash
# Clone and start everything
git clone <your-repo>
cd college-management-system

# Start all services
docker-compose up -d

# Access applications
# Backend API: http://localhost:3000
# Frontend: http://localhost:3001
# API Docs: http://localhost:3000/api-docs
\`\`\`

### Option 2: Local Development
\`\`\`bash
# Backend setup
npm install
docker run -d -p 27017:27017 --name mongodb mongo:7.0
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
\`\`\`




<!-- ## 🔒 Developer Notes 
### Option 3: Full Development Setup
\`\`\`bash
# Install all dependencies
npm run setup

# Start both backend and frontend
npm run dev:full
\`\`\`

## 📖 API Documentation

Visit http://localhost:3000/api-docs for interactive API documentation.

### Authentication
\`\`\`bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
\`\`\`

### Student Management
\`\`\`bash
# Get all students
curl -X GET http://localhost:3000/api/students \
  -H "Authorization: Bearer <token>"

# Create student
curl -X POST http://localhost:3000/api/students \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "course": "Computer Science"}'
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run backend tests
npm test

# Run with coverage
npm run test:coverage

# Seed sample data
npm run seed
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`env
# Backend (.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/college_management
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Frontend (.env)
VITE_API_URL=http://localhost:3000
\`\`\`

## 📱 Frontend Usage

1. **Login**: Use `admin` / `admin123`
2. **Dashboard**: View system stats and recent students
3. **Students**: Browse, search, and manage students
4. **Add/Edit**: Create or update student records

## 🐳 Docker Commands

\`\`\`bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build
\`\`\`

## 🚀 Production Deployment

1. Update environment variables
2. Change default credentials
3. Configure HTTPS
4. Set up monitoring
5. Deploy with `docker-compose up -d`


## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using Node.js, Express, MongoDB, React, and Docker**


- -->


## 📁 Project Structure

\`\`\`
college-management-system/
├── 🗄️ Backend (Node.js/Express/MongoDB)
│   ├── config/          # Database, logging, swagger
│   ├── middleware/      # Auth, validation, rate limiting
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Utility scripts
│   ├── tests/           # Test suites
│   └── server.js        # Main application
│
├── 🎨 Frontend (React/Vite/Tailwind)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app
│   └── package.json
│
├── docker-compose.yml   # Multi-service setup
└── README.md           # This file
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request


