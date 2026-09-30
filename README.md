# 🚀 Portfolio CMS

> A modern, full-stack portfolio platform with a custom Content Management System, responsive admin dashboard, dynamic public portfolio, secure authentication, image uploads, and database-driven content.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Admin](https://img.shields.io/badge/Admin-Custom%20CMS-2563EB?style=for-the-badge)](#)
[![Upload](https://img.shields.io/badge/Upload-Node.js%20%2B%20Multer-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)

---

## ✨ Overview

**Portfolio CMS** is a complete full-stack portfolio management platform designed to make portfolio content completely dynamic.

Instead of editing portfolio content directly inside frontend source code, administrators can manage content through a dedicated CMS dashboard.

Changes made through the admin panel are stored in PostgreSQL and exposed through the backend API, allowing the public portfolio to display the latest published content dynamically.

### The platform contains four main parts:

- 🌐 **Public Portfolio** — React-based personal portfolio website
- 🛠️ **Admin CMS** — Responsive dashboard for managing portfolio content
- ⚡ **FastAPI Backend** — Authentication, CRUD APIs, database operations and business logic
- 📤 **Upload Service** — Node.js + Multer service for secure image uploads

---

# 🧩 Architecture

```text
                         ┌─────────────────────────┐
                         │     PostgreSQL DB       │
                         │                         │
                         │ users                   │
                         │ about                   │
                         │ skills                  │
                         │ projects                │
                         │ blogs                   │
                         │ experience              │
                         │ testimonials            │
                         │ services                │
                         │ messages                │
                         │ media                   │
                         └────────────┬────────────┘
                                      │
                                      │
                         ┌────────────▼────────────┐
                         │     FastAPI Backend     │
                         │                         │
                         │ Authentication          │
                         │ CRUD APIs               │
                         │ Admin Authorization     │
                         │ Contact API             │
                         │ Dashboard API           │
                         │ Content API             │
                         └───────┬─────────┬───────┘
                                 │         │
                    ┌────────────┘         └──────────────┐
                    │                                     │
                    ▼                                     ▼
          ┌───────────────────┐                 ┌──────────────────┐
          │   Admin CMS       │                 │ Public Portfolio │
          │                   │                 │                  │
          │ React + Vite      │                 │ React + Vite     │
          │ Tailwind CSS      │                 │ Tailwind CSS     │
          │ JWT Authentication│                 │ Dynamic Content  │
          └───────────────────┘                 └──────────────────┘

                              │
                              ▼
                    ┌────────────────────┐
                    │   Upload Service   │
                    │                    │
                    │ Node.js            │
                    │ Express            │
                    │ Multer             │
                    │ Swagger            │
                    └────────────────────┘

🎯 Core Features
🌐 Public Portfolio

The public-facing portfolio includes:

Responsive navigation
Hero section
About section
Dynamic skills
Dynamic projects
Professional experience
Services
Testimonials
Blog
Contact form
Footer
Responsive layouts for desktop, tablet and mobile

All major portfolio content is loaded through the backend API.

🛠️ Custom Admin CMS

The administration dashboard provides centralized content management.

Dashboard

Provides an overview of portfolio content including:

Projects
Skills
Blogs
Experience
Testimonials
Services
Messages
Media
Content Management

Administrators can manage:

About information
Skills
Projects
Blog posts
Experience / timeline
Testimonials
Services
Contact messages
Media records
Admin Features
JWT authentication
Protected routes
Admin-only authorization
CRUD operations
Publish / draft support
Delete confirmations
Responsive dashboard
Mobile navigation
Notifications
Dashboard statistics
🔐 Authentication & Authorization

The platform uses JWT-based authentication.

Authentication flow
Admin Login
     │
     ▼
FastAPI Authentication API
     │
     ▼
Validate credentials
     │
     ▼
Generate JWT
     │
     ├──────────────► Access Token
     │
     └──────────────► Refresh Token
                         │
                         ▼
                    Admin Dashboard

Protected API endpoints require a valid Bearer token.

Example:

Authorization: Bearer <access_token>

The backend also verifies administrator privileges before allowing protected CMS operations.

🗄️ Database

The project uses PostgreSQL with SQLAlchemy.

Main tables
Table	Purpose
users	Authentication and user accounts
about	Portfolio about information
skills	Technical skills
projects	Portfolio projects
blogs	Blog posts
experience	Professional experience
testimonials	Client / colleague testimonials
services	Services offered
messages	Contact form submissions
media	Uploaded media information
📁 Project Structure
Portfolio-CMS/
│
├── admin-panel/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── ...
│   ├── uploads/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── upload-service/
│   ├── server.js
│   ├── authMiddleware.js
│   ├── db.js
│   ├── swagger.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── README.md
└── ...
🛠️ Technology Stack
Frontend
React
Vite
Tailwind CSS
React Router
Axios
Lucide Icons
Admin CMS
React
Vite
Tailwind CSS
React Router
Axios
Lucide Icons
JWT authentication
Backend
Python
FastAPI
SQLAlchemy
PostgreSQL
Pydantic
JWT
bcrypt
Uvicorn
Python Multipart
Upload Service
Node.js
Express
Multer
PostgreSQL
JWT
Swagger UI
Database
PostgreSQL
📡 API Overview

The backend exposes REST APIs under:

/api/v1
Authentication
POST /api/v1/auth/login
POST /api/v1/auth/refresh
About
GET  /api/v1/about
PUT  /api/v1/about
Skills
GET    /api/v1/skills
POST   /api/v1/skills
PUT    /api/v1/skills/{id}
DELETE /api/v1/skills/{id}
Projects
GET    /api/v1/projects
POST   /api/v1/projects
PUT    /api/v1/projects/{id}
DELETE /api/v1/projects/{id}
Blogs
GET    /api/v1/blogs
POST   /api/v1/blogs
PUT    /api/v1/blogs/{id}
DELETE /api/v1/blogs/{id}
Experience
GET    /api/v1/experience
POST   /api/v1/experience
PUT    /api/v1/experience/{id}
DELETE /api/v1/experience/{id}
Testimonials
GET    /api/v1/testimonials
POST   /api/v1/testimonials
PUT    /api/v1/testimonials/{id}
DELETE /api/v1/testimonials/{id}
Services
GET    /api/v1/services
POST   /api/v1/services
PUT    /api/v1/services/{id}
DELETE /api/v1/services/{id}
Contact
POST /api/v1/contact
Messages
GET    /api/v1/messages
GET    /api/v1/messages/{id}
DELETE /api/v1/messages/{id}
Media
GET    /api/v1/media
GET    /api/v1/media/{id}
DELETE /api/v1/media/{id}
📤 Upload Service

The project uses a dedicated Node.js upload service for image handling.

Service URL
http://localhost:5000
Health Check
GET /
Upload Image
POST /upload/image
Supported formats
JPEG
PNG
WEBP
GIF
Maximum file size
5 MB

Uploaded files are stored in:

backend/uploads/

The upload service also provides Swagger documentation.

http://localhost:5000/docs
🚀 Local Development
1. Clone the repository
git clone https://github.com/JADAVDHRUVIT21/Portfolio-CMS.git
cd Portfolio-CMS
2. Backend Setup

Navigate to:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Configure the backend environment variables.

Then start FastAPI:

python -m uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs
3. Upload Service Setup

Open another terminal:

cd upload-service

Install dependencies:

npm install

Start the service:

node server.js

Upload service:

http://localhost:5000

Swagger:

http://localhost:5000/docs
4. Admin Panel Setup

Open another terminal:

cd admin-panel

Install dependencies:

npm install

Start development server:

npm run dev

The admin panel will normally run on:

http://localhost:5174
5. Public Portfolio Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start development server:

npm run dev

The public portfolio will normally run on:

http://localhost:5173
🔄 Content Management Flow

The platform is designed around a simple CMS workflow.

              ADMIN
                │
                ▼
        ┌───────────────┐
        │  Admin Panel  │
        └───────┬───────┘
                │
                │ REST API
                ▼
        ┌───────────────┐
        │    FastAPI    │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        └───────┬───────┘
                │
                │ Published Content
                ▼
        ┌───────────────┐
        │ Public Website│
        └───────────────┘
Example

An administrator creates a new project:

Admin Panel
     ↓
Create Project
     ↓
FastAPI API
     ↓
PostgreSQL
     ↓
Published Project
     ↓
Public Portfolio

The public website can then display the project without modifying frontend source code.

📱 Responsive Design

The platform is designed for:

🖥️ Desktop
💻 Laptop
📱 Mobile
📟 Tablet

The admin dashboard includes a responsive mobile navigation system, while the public portfolio adapts its layouts across screen sizes.

🧪 Build & Verification
Frontend production build
cd frontend
npm run build
Admin production build
cd admin-panel
npm run build

Both applications should complete the Vite production build without errors.

🔒 Environment Variables

Sensitive configuration should be stored in .env files and should never be committed to GitHub.

Example backend configuration:

DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

Example upload service configuration:

DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key

Do not copy these example values directly into production.

🌍 Deployment Architecture

The application can be deployed as separate services:

                 Internet
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   Public Portfolio       Admin Panel
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
               FastAPI API
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      PostgreSQL        Upload Service

This separation makes the system easier to maintain, scale and deploy independently.

🗺️ Development Roadmap
Completed
 Project architecture
 PostgreSQL database
 FastAPI backend
 JWT authentication
 Admin authorization
 About CRUD
 Skills CRUD
 Projects CRUD
 Blogs CRUD
 Experience CRUD
 Testimonials CRUD
 Services CRUD
 Messages management
 Media management
 Node.js image upload service
 Responsive admin dashboard
 Public portfolio frontend
 Dynamic CMS-driven content
 Contact form
 GitHub repository integration
Future Improvements
 Rich text editor for blog content
 Advanced media library
 Drag-and-drop content ordering
 Analytics dashboard
 Email notifications for contact messages
 Automated CI/CD
 Production deployment
 Custom domain
 SEO optimization
 Sitemap generation
 Open Graph metadata
 Automated backups
📸 Screenshots

Add project screenshots here as the project UI is finalized.

Public Portfolio
screenshots/
├── portfolio-home.png
├── projects.png
├── services.png
└── contact.png
Admin CMS
screenshots/
├── admin-login.png
├── admin-dashboard.png
├── projects-management.png
└── media-management.png
📌 Why This Project?

This project demonstrates how a modern portfolio can be transformed from a static website into a complete content-driven platform.

Instead of hardcoding:

Project
Skill
Experience
Blog
Service
Testimonial

inside the frontend, the CMS provides a centralized interface for managing the content.

This makes the portfolio easier to maintain and allows new content to be published without changing the frontend source code.

👨‍💻 Author
Dhruvit Jadav

Full-stack developer focused on building modern web applications, backend APIs, responsive interfaces and practical software solutions.

GitHub

https://github.com/JADAVDHRUVIT21

📄 License

This project is currently intended as a personal portfolio and CMS project.

If you plan to reuse, redistribute or commercially deploy the code, review and define an appropriate license first.

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

