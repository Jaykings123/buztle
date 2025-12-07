# 🎯 Buztle - Event & Volunteer Management Platform

<div align="center">

![Buztle Logo](https://img.shields.io/badge/Buztle-Event%20Management-6366f1?style=for-the-badge&logo=react)

**A futuristic platform connecting event organizers with volunteers**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)](https://supabase.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Overview

**Buztle** is a modern web application that bridges the gap between event organizers and volunteers. With a stunning futuristic UI and robust backend, Buztle streamlines the process of creating events, finding volunteers, and managing applications.

### 🎨 Design Philosophy

- **Futuristic Aesthetics**: Cyberpunk-inspired UI with neon glows, glassmorphism, and smooth animations
- **User-Centric**: Intuitive interface for both organizers and volunteers
- **Responsive**: Works seamlessly across all devices
- **Fast & Secure**: Built with performance and security as top priorities

---

## ✨ Features

### For Event Organizers

- ✅ **Create & Manage Events** - Post events with details, requirements, and compensation
- ✅ **Application Management** - View, approve, or reject volunteer applications
- ✅ **Real-time Updates** - See application count updates instantly
- ✅ **Secure Authentication** - Email/password with phone number tracking
- ✅ **Event Dashboard** - Manage all your events from one place

### For Volunteers

- ✅ **Browse Events** - Discover events matching your interests
- ✅ **Easy Application** - Apply to events with one click
- ✅ **Track Applications** - Monitor your application status
- ✅ **Profile Management** - Update your information anytime

### Technical Features

- ⚡ **Futuristic UI** - Particle backgrounds, 3D tilt effects, magnetic buttons
- 🔒 **Enterprise Security** - Input validation, rate limiting, helmet.js
- 🚀 **High Performance** - Optimized queries, code splitting, lazy loading
- 📱 **Fully Responsive** - Mobile-first design
- 🎯 **Role-Based Access** - Separate interfaces for organizers and volunteers

---

## 🛠 Tech Stack

### Frontend

- **React 19.2** - UI library
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** (Supabase) - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet.js** - Security headers
- **Express Rate Limit** - Rate limiting

### Development & Deployment

- **Git** - Version control
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **Supabase** - PostgreSQL database

---

## 📁 Project Structure

```
Buztle/
├── client/                    # Frontend React application
│   ├── public/               # Static assets
│   │   ├── buztle-logo.png
│   │   ├── jaykiramgami.jpg
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/              # API client
│   │   │   └── client.js
│   │   ├── components/       # Reusable UI components
│   │   │   ├── MagneticButton.jsx
│   │   │   ├── TiltCard.jsx
│   │   │   ├── ParticleBackground.jsx
│   │   │   ├── SearchFilter.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── ToastContainer.jsx
│   │   ├── context/          # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   └── EventDetails.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── .env.example          # Environment template
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Backend Node.js application
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Centralized error handling
│   │   └── validation.js     # Input validation rules
│   ├── prisma/              # Database schema & migrations
│   │   ├── schema.prisma
│   │   └── dev.db            # Local SQLite (dev only)
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── events.js        # Event management
│   │   └── applications.js  # Application management
│   ├── .env.example         # Environment template
│   ├── server.js            # Express server
│   ├── package.json
│   └── test-e2e.js          # End-to-end tests
│
├── .gitignore
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **PostgreSQL** database (Supabase recommended)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Jaykings123/buztle.git
cd buztle
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup

#### Backend Configuration

1. Copy the environment template:

```bash
cd server
cp .env.example .env
```

2. Update `.env` with your values:

```env
DATABASE_URL=postgresql://user:password@host:port/database?pgbouncer=true
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

#### Frontend Configuration

1. Copy the environment template:

```bash
cd client
cp .env.example .env
```

2. Update `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Database Setup

1. **Push the schema to your database:**

```bash
cd server
npx prisma generate
npx prisma db push
```

2. **Verify the setup:**

```bash
npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

---

## 💻 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Production Build

**Backend:**

```bash
cd server
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass123",
  "role": "ORGANIZER" | "VOLUNTEER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com", // or phone number
  "password": "SecurePass123"
}
```

### Event Endpoints

#### Create Event (Organizer only)
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beach Cleanup",
  "description": "Help clean our local beach",
  "date": "2025-12-15",
  "time": "09:00",
  "location": "Sunset Beach",
  "payDetails": "₹500 stipend",
  "requirements": "Gloves will be provided"
}
```

#### Get All Events
```http
GET /api/events
```

#### Get Event Details
```http
GET /api/events/:id
```

#### Delete Event (Organizer only)
```http
DELETE /api/events/:id
Authorization: Bearer {token}
```

### Application Endpoints

#### Apply for Event (Volunteer only)
```http
POST /api/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": 1
}
```

#### Get My Applications (Volunteer)
```http
GET /api/applications/my-applications
Authorization: Bearer {token}
```

#### Get Event Applications (Organizer)
```http
GET /api/applications/event/:eventId
Authorization: Bearer {token}
```

#### Update Application Status (Organizer)
```http
PATCH /api/applications/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "ACCEPTED" | "REJECTED"
}
```

### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2025-12-07T15:00:00.000Z",
  "uptime": 12345.67,
  "environment": "development"
}
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. **Connect GitHub repository to Vercel**
2. **Set environment variables:**
   - `VITE_API_URL` = `https://your-backend-url.render.com/api`
3. **Deploy**: Vercel auto-deploys on push to `main`

### Backend (Render)

1. **Create new Web Service on Render**
2. **Connect GitHub repository**
3. **Set environment variables:**
   ```
   DATABASE_URL=<supabase-connection-string>
   JWT_SECRET=<strong-random-secret>
   PORT=3000
   FRONTEND_URL=<vercel-url>
   NODE_ENV=production
   ```
4. **Build Command:** `npm install && cd server && npx prisma generate`
5. **Start Command:** `cd server && npm start`

### Database (Supabase)

1. **Create new project on Supabase**
2. **Copy connection string**
3. **Update `DATABASE_URL` in environment variables**

---

## 🔒 Security

Buztle implements multiple layers of security:

- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Rate Limiting** - Prevents brute force attacks (5 login attempts/15min)
- ✅ **Input Validation** - Express-validator for all inputs
- ✅ **Security Headers** - Helmet.js for HTTP security
- ✅ **CORS Protection** - Configured for specific origins
- ✅ **SQL Injection Protection** - Prisma ORM parameterized queries
- ✅ **XSS Protection** - Input sanitization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Contact

**Jaykumar Viramgami**

- 📧 Email: [mbest@gmail.com](mailto:mbest@gmail.com)
- 💼 LinkedIn: [Jay Viramgami](https://www.linkedin.com/in/jay-viramgami-a3a70a271/)
- 🐙 GitHub: [@Jaykings123](https://github.com/Jaykings123)

---

## 🙏 Acknowledgments

- React team for the amazing library
- Vercel for free hosting
- Supabase for PostgreSQL database
- All open-source contributors

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Jaykumar Viramgami](https://github.com/Jaykings123)

</div>
