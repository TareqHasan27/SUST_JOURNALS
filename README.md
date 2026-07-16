# SUST Journal

A comprehensive academic research paper management and discovery platform designed for universities to facilitate scholarly communication, paper submissions, and research collaboration.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)
- [License](#license)

## 🎯 Overview

SUST Journals is a full-stack web application that enables students, faculty, and external researchers to submit, discover, and manage research papers. The platform includes AI-powered features for paper analysis, author ranking systems, paper bookmarking, and administrative controls for managing academic journals and publications.

## ✨ Features

### Authentication & Authorization
- User registration with email verification
- Role-based access control (Student, Faculty, External, Admin)
- Secure password management with bcrypt hashing
- OTP-based verification for signup and password reset
- JWT-based session management

### Research Paper Management
- Submit research papers with PDF uploads
- Search and discover published papers
- Advanced paper categorization and filtering
- Detailed research paper display with metadata

### User Profiles
- Customizable user profiles with biographical information
- Research interest tracking
- Integration with academic profiles (Google Scholar, ORCID)
- Department-based organization

### AI-Powered Features
- AI chatbot integration for paper analysis and summaries (powered by Google Generative AI)
- Automatic paper overview generation
- Interactive chat-based paper exploration

### Social & Collaboration Features
- Author ranking system based on publications
- Paper bookmarking functionality
- Notifications system
- User-to-user interaction capabilities

### Administrative Features
- Admin dashboard for platform management
- User management and moderation
- Content moderation and approval workflows
- Analytics and reporting

### Media Management
- PDF upload and storage via Cloudinary
- Image management for user profiles and papers
- Secure file handling with multer

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.0
- **Routing**: React Router DOM 7.8.0
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: Radix UI (Avatar, Dropdown Menu, Label, Slot)
- **Charts**: Recharts 3.4.1
- **Animations**: Framer Motion 12.23.24
- **HTTP Client**: Axios 1.11.0
- **PDF Export**: html2pdf.js 0.12.1, react-to-print 3.2.0
- **Pagination**: react-paginate 8.3.0
- **Notifications**: sonner 2.0.7
- **Themes**: next-themes 0.4.6
- **Utilities**: clsx 2.1.1, tailwind-merge 3.3.1, class-variance-authority 0.7.1
- **Linting**: ESLint 9.32.0

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MySQL 2.3.15 / MariaDB 3.4.5
- **Authentication**: jsonwebtoken 9.0.2, bcrypt 6.0.0
- **Password Reset**: crypto, md5 2.3.0
- **Email Service**: Nodemailer 7.0.10
- **File Upload**: multer 2.0.2, multer-storage-cloudinary 2.2.1
- **Cloud Storage**: Cloudinary 2.8.0
- **AI Integration**: Google Generative AI 0.24.1
- **HTTP Parser**: body-parser 2.2.0
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.2.3
- **Development**: Nodemon 3.1.10, Prettier 3.6.2

## 🏗️ Architecture

### Monorepo Structure

```
SUST_JOURNALS/
├── Backend/          # Express.js REST API server
└── Frontend/         # React SPA with Vite
```

### Backend Architecture
- **MVC Pattern**: Controllers, Services, Models, and Routes
- **Middleware**: Authentication, CORS, body parsing
- **Database**: MySQL with relational schema
- **External Services**: 
  - Google Generative AI for AI features
  - Cloudinary for file storage
  - Gmail/Nodemailer for email notifications

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Page-Based Routing**: Multiple feature pages with protected routes
- **State Management**: React Context API (UserProvider)
- **API Layer**: Centralized API communication via axios
- **Styling**: Tailwind CSS with Radix UI components

## 📁 Project Structure

### Backend Structure
```
Backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.js       # MySQL database connection
│   │   └── sendEmail.js # Email service configuration
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── profileController.js
│   │   ├── paperUploadController.js
│   │   ├── searchController.js
│   │   ├── serviceController.js
│   │   └── notificattionController.js
│   ├── middleware/      # Custom middlewares
│   ├── models/          # Database models and queries
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions
│   └── index.js        # Express app entry point
├── .sql               # Database schema
├── package.json
└── package-lock.json
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── api/             # API service layer
│   ├── assets/          # Static assets
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin dashboard
│   │   ├── Article/     # Paper display
│   │   ├── Profile/     # User profiles
│   │   ├── Home/        # Publications page
│   │   ├── ranking/     # Author ranking
│   │   ├── bookmarks/   # Bookmarked papers
│   │   ├── chatbot/     # AI chat interface
│   │   ├── submitpaper/ # Paper submission
│   │   └── *            # Auth pages (Login, Signup, etc.)
│   ├── store/           # State management
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   ├── App.css
│   └── index.css
├── public/              # Static files
├── vite.config.js       # Vite configuration
├── jsconfig.json
├── components.json      # UI component configuration
├── eslint.config.js
├── index.html
└── package.json
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL/MariaDB server running locally
- Git

### Clone Repository
```bash
git clone https://github.com/TareqHasan27/SUST_JOURNALS.git
cd SUST_JOURNALS
```

### Backend Setup

```bash
cd Backend
npm install
```

### Frontend Setup

```bash
cd Frontend
npm install
```

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=web_tech

# Email Configuration
MY_EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Generative AI Configuration
GOOGLE_API_KEY=your_google_generative_ai_key
```

### Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory (if needed):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note**: Do not commit `.env` files to version control. Use `.env.example` files for reference.

## 🛠️ Local Setup

### Database Setup

1. **Start MySQL/MariaDB server**
   ```bash
   # On macOS with Homebrew
   brew services start mysql
   
   # On Windows
   # Start MySQL from Services or use MySQL Command Line Client
   ```

2. **Create database and tables**
   ```bash
   mysql -u root -p
   ```
   
   Inside MySQL CLI:
   ```sql
   CREATE DATABASE web_tech;
   USE web_tech;
   source Backend/.sql
   ```

3. **Verify database tables**
   ```sql
   SHOW TABLES;
   ```

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env

# Start development server with hot reload
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file if needed
cp .env.example .env

# Start development server with hot reload
npm run dev
```

The frontend development server will run on `http://localhost:5173` (or another port if 5173 is in use)

## 📦 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

### Production Build

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

**Backend:** 
```bash
cd Backend
npm start
```

## 🔌 API Endpoints

The backend provides REST API endpoints organized by domain:

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-email` - Email verification
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password` - Complete password reset

### Profile Routes (`/api/profile`)
- `GET /user/:reg_no` - Get user profile
- `PUT /user/:reg_no` - Update user profile
- `GET /research-interests/:reg_no` - Get research interests
- `POST /research-interests` - Add research interests

### Paper Submission Routes (`/api/pdf`)
- `POST /upload` - Upload research paper
- `GET /papers/:user_id` - Get user's papers
- `DELETE /papers/:paper_id` - Delete paper

### Paper Search Routes (`/api/papers`)
- `GET /search` - Search papers
- `GET /popular` - Get popular papers
- `GET /:paper_id` - Get paper details

### Service Routes (`/api/service`)
- `GET /rankings` - Get author rankings
- `GET /departments` - Get departments
- `POST /bookmark` - Bookmark paper
- `GET /bookmarks/:user_id` - Get user bookmarks

### AI Chat Routes (`/api/overview`)
- `POST /chat` - Send chat message
- `GET /summary/:paper_id` - Get paper summary

### Admin Routes (`/api/admin`)
- `GET /users` - Get all users
- `GET /papers` - Get all papers
- `PUT /users/:user_id` - Update user
- `DELETE /papers/:paper_id` - Delete paper

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    reg_no VARCHAR(20) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'external', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isVerified TINYINT(1) DEFAULT NULL,
    verificationToken VARCHAR(64) DEFAULT NULL,
    reset_token VARCHAR(6) DEFAULT NULL
);
```

### Departments Table
```sql
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    short_code VARCHAR(50) UNIQUE
);
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
    reg_no VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    department_id INT,
    profile_url VARCHAR(255),
    bio TEXT,
    google_scholar_id VARCHAR(255),
    orcid_id VARCHAR(50),
    FOREIGN KEY (reg_no) REFERENCES users(reg_no),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

### User Research Interests Table
```sql
CREATE TABLE user_research_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(20),
    interest VARCHAR(255),
    FOREIGN KEY (reg_no) REFERENCES users(reg_no)
);
```

## 🔮 Future Improvements

### Planned Features
- [ ] Advanced analytics dashboard for paper statistics
- [ ] Social collaboration features (commenting, reviews)
- [ ] Citation tracking and integration with citation managers
- [ ] Paper recommendation engine based on research interests
- [ ] Multi-language support for global accessibility
- [ ] Real-time notifications using WebSockets
- [ ] Integration with major academic databases (CrossRef, arXiv)
- [ ] DOI assignment for published papers
- [ ] Peer review workflow system
- [ ] Paper versioning and revision tracking
- [ ] Mobile app for iOS and Android
- [ ] Dark mode UI implementation

### Performance Optimization
- [ ] Database query optimization and indexing
- [ ] Caching strategy implementation (Redis)
- [ ] API response pagination optimization
- [ ] Frontend code splitting and lazy loading
- [ ] Image optimization and compression
- [ ] CDN integration for static assets

### Security Enhancements
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting on API endpoints
- [ ] Input validation and sanitization
- [ ] CSRF protection implementation
- [ ] Security headers configuration
- [ ] Regular dependency security audits

### Testing
- [ ] Unit tests for backend services
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests with Jest/React Testing Library
- [ ] End-to-end testing with Cypress

## 👥 Contributors

- **Tareq Hasan** - Project Creator & Lead Developer

For contributing to this project, please feel free to fork and submit pull requests.

## 📜 License

This project is licensed under the ISC License - see the package.json file for details.

---

**Repository**: [SUST_JOURNALS on GitHub](https://github.com/TareqHasan27/SUST_JOURNALS)

**Questions or Issues?** Please open an issue on the GitHub repository.
