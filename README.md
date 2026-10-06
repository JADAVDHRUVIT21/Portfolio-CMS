Portfolio CMS

A full-stack, custom-built Portfolio Content Management System (CMS) that allows portfolio content to be managed from a secure admin panel and displayed dynamically on a public portfolio website.

🌐 Live Project

Public Portfolio

https://dhruvit-portfolio-cms.vercel.app/

Admin Panel

https://portfolio-cms-admin-panel.vercel.app/

GitHub Repository

https://github.com/JADAVDHRUVIT21/Portfolio-CMS

🔐 Admin Panel Login

Field

Value

Admin Panel

https://portfolio-cms-admin-panel.vercel.app/

Username / Email

dhruvit@gmail.com

Password

dhruvit123

Security: These credentials are for the current demo/project environment. Change the password for a real production deployment and never expose production credentials in a public repository.

📌 Project Overview

Portfolio CMS separates content management from the public portfolio website.

Instead of changing frontend code every time portfolio information changes, an administrator can log into the CMS, create/update/delete content, and the public portfolio retrieves the latest information through REST APIs.

Architecture

                    ┌─────────────────────┐
                    │     Admin Panel     │
                    │    React + Vite     │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │     FastAPI API     │
                    │  Auth + CMS + CRUD  │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
             ┌──────────────┐     ┌────────────────┐
             │  PostgreSQL  │     │ Upload Service │
             │   Database   │     │ Node + Express │
             └──────────────┘     └────────────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │  Public Portfolio   │
                    │    React + Vite     │
                    └─────────────────────┘

✨ Features

Admin CMS

JWT-based admin authentication

Protected admin routes

Dashboard

About management

About card management

Skills management

Projects management

Experience management

Services management

Testimonials management

Blog management

Messages/contact management

Media management

Create, update and delete content

Responsive admin interface

Public Portfolio

Dynamic CMS-driven content

Responsive design

Hero section

About section

Skills section

Projects section

Experience section

Services section

Testimonials section

Blog section

Contact form

Footer

Dark/light theme support

Backend

FastAPI REST API

PostgreSQL

SQLAlchemy ORM

JWT authentication

Admin authorization

CRUD APIs

Contact/message APIs

Media APIs

Health endpoint

CORS configuration

Static uploaded media support

Upload Service

Separate Node.js/Express service for media handling.

Supported formats:

JPEG

PNG

WEBP

GIF

🛠️ Technology Stack

Frontend

React

Vite

Tailwind CSS

React Router

Axios

Lucide React

Admin Panel

React

Vite

Tailwind CSS

React Router

Axios

Lucide React

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

python-multipart

Upload Service

Node.js

Express.js

Multer

PostgreSQL

JWT

Deployment

Vercel — Public Portfolio

Vercel — Admin Panel

Render — FastAPI Backend

Render PostgreSQL — Database

📁 Project Structure

Portfolio-CMS/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   ├── requirements.txt
│   └── .env
│
├── admin-panel/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── upload-service/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

🗄️ Database

The application uses PostgreSQL with SQLAlchemy.

The CMS manages data for:

Users

About

Skills

Projects

Blogs

Experience

Testimonials

Services

Messages

Media

Database tables are created from the SQLAlchemy models when the backend starts.

🔑 Authentication

The admin authentication flow is:

Admin
  ↓
Login Page
  ↓
FastAPI Authentication API
  ↓
Email + Password Validation
  ↓
JWT Token
  ↓
Protected Admin Panel
  ↓
Authorized CMS API Requests

Admin-only operations are protected by authorization checks.

📡 API

The main API prefix is:

/api/v1

Main API areas:

/api/v1/auth
/api/v1/about
/api/v1/skills
/api/v1/projects
/api/v1/blogs
/api/v1/experience
/api/v1/testimonials
/api/v1/services
/api/v1/media
/api/v1/contact
/api/v1/messages
/api/v1/dashboard

Basic backend endpoints:

GET /
GET /health

🖥️ Admin Modules

Dashboard

Overview of CMS information and management areas.

About

Manage the main About content and About cards.

Skills

Manage skill name, category, icon and proficiency.

Projects

Manage portfolio projects.

Experience

Manage professional experience.

Services

Manage services displayed on the portfolio.

Testimonials

Manage testimonials.

Blogs

Manage blog content.

Messages

View messages submitted through the public contact form.

Media

Manage uploaded portfolio media.

🎨 Public Portfolio Sections

Navbar
Hero
About
Skills
Projects
Experience
Services
Testimonials
Blog
Contact
Footer

These sections consume CMS content through the backend APIs.

🔄 Content Flow

Admin logs in
      ↓
Creates / Updates content
      ↓
Admin Panel sends API request
      ↓
FastAPI validates request
      ↓
PostgreSQL stores data
      ↓
Public Portfolio requests data
      ↓
FastAPI returns latest content
      ↓
Portfolio displays updated content

🖼️ Media Management

The project includes a separate upload service for portfolio images and media.

Supported image formats:

JPEG
PNG
WEBP
GIF

Uploaded media is exposed by the backend through:

/uploads

🚀 Local Development

1. Clone Repository

git clone https://github.com/JADAVDHRUVIT21/Portfolio-CMS.git
cd Portfolio-CMS

2. Backend

cd backend
python -m venv venv
.env\Scripts\Activate.ps1
pip install -r requirements.txt

Create .env:

DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key

Run:

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

3. Public Frontend

cd frontend
npm install
npm run dev

Default:

http://localhost:5173

4. Admin Panel

cd admin-panel
npm install
npm run dev

Default:

http://localhost:5174

5. Upload Service

cd upload-service
npm install

Start the Node.js upload service using its configured server entry point.

🏗️ Production Deployment

Backend — Render

The FastAPI backend is deployed as a Render Web Service.

Start command:

uvicorn app.main:app --host 0.0.0.0 --port $PORT

The production database is hosted using Render PostgreSQL.

Admin Panel — Vercel

Live:

https://portfolio-cms-admin-panel.vercel.app/

Vercel SPA routing is configured so React routes such as /login continue working after browser refresh.

Public Portfolio — Vercel

Live:

https://dhruvit-portfolio-cms.vercel.app/

🔧 Environment Variables

Backend

DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key

Frontend

The production frontend API configuration must point to the deployed FastAPI backend.

Example:

VITE_API_URL=your_render_backend_url

Never commit real production credentials or .env files to GitHub.

🧪 Final Testing Checklist

Public portfolio opens

Admin panel opens

Admin login works

Admin route refresh works

Dashboard loads

About CRUD works

About cards work

Skills CRUD works

Projects CRUD works

Experience CRUD works

Services CRUD works

Testimonials CRUD works

Blogs CRUD works

Messages work

Media management works

Contact form works

Backend health endpoint works

CMS changes appear on the public portfolio

Desktop responsive layout works

Mobile responsive layout works

🌍 Production URLs

Service

URL

🌐 Public Portfolio

https://dhruvit-portfolio-cms.vercel.app/

🔐 Admin Panel

https://portfolio-cms-admin-panel.vercel.app/

💻 GitHub

https://github.com/JADAVDHRUVIT21/Portfolio-CMS

👨‍💻 Developer

Dhruvit Jadav

Full Stack Developer & Software Engineer

Areas of Development

Full Stack Development

Python Development

Backend Development

MERN Stack Development

Flutter Development

Android Development

REST API Development

PostgreSQL / Database Development

CMS Development

🎯 Project Purpose

This project demonstrates a complete custom portfolio CMS architecture with:

Full-stack development

React frontend development

FastAPI backend development

PostgreSQL database integration

JWT authentication

Role-based admin access

REST API development

CRUD operations

CMS architecture

Media/file handling

Responsive UI

Production deployment

The main goal is to provide a portfolio website that can be maintained entirely through an administrator dashboard without requiring direct frontend code changes for normal content updates.

🔒 Security Notice

The administrator credentials above were provided for the current project/demo environment.

For production use:

Change the admin password.

Keep the JWT SECRET_KEY private.

Keep PostgreSQL credentials private.

Store secrets in deployment environment variables.

Do not commit .env files.

Restrict CORS to trusted production domains.

Rotate credentials if they are accidentally exposed.

📜 License

This project is a custom portfolio CMS developed for portfolio, internship and project demonstration purposes.