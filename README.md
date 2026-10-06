🚀 Portfolio CMS
<div align="center">
https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Portfolio%20CMS&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=A%20Full-Stack%20Custom%20Portfolio%20Content%20Management%20System&descAlignY=55&descSize=18

https://img.shields.io/badge/%F0%9F%8C%90_Live_Demo-Visit_Site-00C853?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/%F0%9F%94%90_Admin_Panel-Login_Now-2962FF?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/%F0%9F%93%82_Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white

https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB
https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi
https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white
https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white
https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white
https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white

https://img.shields.io/badge/License-Custom-blue?style=flat-square
https://img.shields.io/badge/Status-Active-success?style=flat-square
https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square

</div>
📖 Table of Contents
<details open> <summary><b>Click to expand/collapse</b></summary>
🌟 Overview

🌐 Live Project

🔐 Admin Credentials

🏗️ Architecture

✨ Features

🛠️ Technology Stack

📁 Project Structure

🗄️ Database Schema

🔑 Authentication Flow

📡 API Reference

🖥️ Admin Modules

🎨 Public Portfolio Sections

🔄 Content Flow

🖼️ Media Management

🚀 Local Development

🏗️ Production Deployment

🔧 Environment Variables

🧪 Testing Checklist

🔒 Security Notice

👨‍💻 Developer

🎯 Project Purpose

📜 License

</details>
🌟 Overview
Portfolio CMS is a full-stack, custom-built Content Management System that separates content management from the public portfolio website.

Instead of modifying frontend code every time portfolio information changes, administrators can log into a secure CMS panel, perform Create / Read / Update / Delete (CRUD) operations, and the public portfolio automatically retrieves the latest content through REST APIs.

<div align="center">



┌─────────────────────────────────────────────────────────┐
│  💡 Manage Once. Display Everywhere. Update Instantly.  │
└─────────────────────────────────────────────────────────┘
</div>

🌐 Live Project
<div align="center">
🎯 Service	🔗 URL	📝 Description
🌐 Public Portfolio	dhruvit-portfolio-cms.vercel.app	User-facing portfolio website
🔐 Admin Panel	portfolio-cms-admin-panel.vercel.app	Secure CMS dashboard
📂 GitHub Repo	JADAVDHRUVIT21/Portfolio-CMS	Complete source code
</div>
🔐 Admin Credentials
⚠️ Demo Environment Only — These credentials are for the current demo/project environment.

<div align="center">
🔑 Field	📌 Value
Admin Panel	https://portfolio-cms-admin-panel.vercel.app/
Username / Email	dhruvit@gmail.com
Password	dhruvit123
</div>
🛡️ Security Note: Change the password for real production deployment and never expose production credentials in a public repository.

🏗️ Architecture
<div align="center">
graph TD
    A[👨‍💼 Admin Panel<br/>React + Vite] -->|REST API| B[⚡ FastAPI Backend<br/>Auth + CMS + CRUD]
    B --> C[(🗄️ PostgreSQL<br/>Database)]
    B --> D[📤 Upload Service<br/>Node + Express]
    D --> C
    E[🌐 Public Portfolio<br/>React + Vite] -->|REST API| B
    
    style A fill:#2962FF,color:#fff,stroke:#fff
    style B fill:#009688,color:#fff,stroke:#fff
    style C fill:#336791,color:#fff,stroke:#fff
    style D fill:#68A063,color:#fff,stroke:#fff
    style E fill:#61DAFB,color:#000,stroke:#fff
</div><details> <summary><b>📊 View ASCII Architecture Diagram</b></summary>


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

</details>

✨ Features
🎛️ Admin CMS
<table> <tr> <td valign="top" width="50%">
🔐 Authentication

✅ JWT-based admin authentication

✅ Protected admin routes

✅ Role-based authorization

📊 Dashboard

✅ Central overview

✅ Management area shortcuts

📝 Content Modules

✅ About management

✅ About card management

✅ Skills management

✅ Projects management

</td> <td valign="top" width="50%">
📝 More Modules

✅ Experience management

✅ Services management

✅ Testimonials management

✅ Blog management

✅ Messages/contact management

✅ Media management

⚙️ Core Operations

✅ Create, Update, Delete (CRUD)

✅ Responsive admin interface

✅ Intuitive UX

</td> </tr> </table>
🌐 Public Portfolio
<table> <tr> <td valign="top" width="50%">
✅ Dynamic CMS-driven content

✅ Fully responsive design

✅ Hero section

✅ About section

✅ Skills section

✅ Projects section

</td> <td valign="top" width="50%">
✅ Experience section

✅ Services section

✅ Testimonials section

✅ Blog section

✅ Contact form

✅ Footer

✅ Dark/Light theme support 🌓

</td> </tr> </table>
⚡ Backend
<div align="center">
Feature	Status
FastAPI REST API	✅
PostgreSQL Integration	✅
SQLAlchemy ORM	✅
JWT Authentication	✅
Admin Authorization	✅
CRUD APIs	✅
Contact / Message APIs	✅
Media APIs	✅
Health Endpoint	✅
CORS Configuration	✅
Static Uploaded Media Support	✅
</div>
📤 Upload Service
<div align="center">
Separate Node.js / Express service for media handling

Format	Supported
🖼️ JPEG	✅
🖼️ PNG	✅
🖼️ WEBP	✅
🖼️ GIF	✅
</div>
🛠️ Technology Stack
<div align="center">
🎨 Frontend & Admin Panel
https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white
https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white

⚙️ Backend
https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white
https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white
https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white
https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white

📤 Upload Service & Deployment
https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white

</div><details> <summary><b>📋 Detailed Stack Breakdown</b></summary>
Layer	Technologies
Frontend	React, Vite, Tailwind CSS, React Router, Axios, Lucide React
Admin Panel	React, Vite, Tailwind CSS, React Router, Axios, Lucide React, JWT Auth
Backend	Python, FastAPI, SQLAlchemy, PostgreSQL, Pydantic, JWT, bcrypt, Uvicorn, python-multipart
Upload Service	Node.js, Express.js, Multer, PostgreSQL, JWT
Deployment	Vercel (Public + Admin), Render (FastAPI Backend), Render PostgreSQL (Database)
</details>
📁 Project Structure

Portfolio-CMS/
│
├── 📂 backend/                    # ⚡ FastAPI Backend
│   ├── app/
│   │   ├── core/                  # 🔧 Config, Security, Dependencies
│   │   ├── models/                # 🗄️ SQLAlchemy Models
│   │   ├── routes/                # 🛣️ API Route Handlers
│   │   ├── schemas/               # 📋 Pydantic Schemas
│   │   ├── services/              # 💼 Business Logic
│   │   └── main.py                # 🚀 App Entry Point
│   │
│   ├── uploads/                   # 📤 Uploaded Media
│   │   └── .gitkeep
│   ├── requirements.txt           # 📦 Python Dependencies
│   └── .env                       # 🔐 Environment Variables
│
├── 📂 admin-panel/                # 🔐 Admin CMS Panel
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json                # ⚙️ SPA Routing Config
│
├── 📂 frontend/                   # 🌐 Public Portfolio
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── 📂 upload-service/             # 📤 Media Upload Service
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

🗄️ Database Schema
The application uses PostgreSQL with SQLAlchemy ORM. Database tables are auto-created from SQLAlchemy models when the backend starts.

<div align="center">
🗂️ Table	📝 Description
👤 Users	Admin user accounts
📄 About	About section content
🎯 Skills	Skills with category, icon, proficiency
💼 Projects	Portfolio projects
📝 Blogs	Blog posts
🏢 Experience	Professional experience
💬 Testimonials	Client testimonials
🛠️ Services	Services offered
📬 Messages	Contact form submissions
🖼️ Media	Uploaded media files
</div>
🔑 Authentication Flow
<div align="center">

sequenceDiagram
    participant Admin
    participant Login as 🔐 Login Page
    participant API as ⚡ FastAPI Auth API
    participant DB as 🗄️ Database
    participant Panel as 🎛️ Admin Panel
    
    Admin->>Login: Enter Email + Password
    Login->>API: POST /auth/login
    API->>DB: Validate Credentials
    DB-->>API: User Found
    API-->>Login: Return JWT Token
    Login->>Panel: Store Token & Redirect
    Panel->>API: Authorized Requests (Bearer Token)
    API-->>Panel: Protected CMS Data

</div>
🛡️ All admin-only operations are protected by JWT authorization checks.

 📡 API Reference
Base API Prefix: /api/v1

<div align="center">
🔗 Endpoint	📝 Purpose
/api/v1/auth	🔐 Authentication
/api/v1/about	📄 About Content
/api/v1/skills	🎯 Skills
/api/v1/projects	💼 Projects
/api/v1/blogs	📝 Blogs
/api/v1/experience	🏢 Experience
/api/v1/testimonials	💬 Testimonials
/api/v1/services	🛠️ Services
/api/v1/media	🖼️ Media
/api/v1/contact	📮 Contact
/api/v1/messages	📬 Messages
/api/v1/dashboard	📊 Dashboard
</div>
🔍 Basic Endpoints

GET /          # 🏠 Root / Welcome
GET /health    # ❤️ Health Check

📘 Interactive API Docs: Visit /docs (Swagger UI) on the running backend.

🖥️ Admin Modules
<div align="center">
🧩 Module	📝 Description
📊 Dashboard	Overview of CMS information and management areas
📄 About	Manage main About content and About cards
🎯 Skills	Manage skill name, category, icon, and proficiency
💼 Projects	Manage portfolio projects
🏢 Experience	Manage professional experience
🛠️ Services	Manage services displayed on the portfolio
💬 Testimonials	Manage testimonials
📝 Blogs	Manage blog content
📬 Messages	View messages submitted via public contact form
🖼️ Media	Manage uploaded portfolio media
</div>
🎨 Public Portfolio Sections
<div align="center">

graph LR
    A[🧭 Navbar] --> B[🎯 Hero]
    B --> C[📄 About]
    C --> D[🎯 Skills]
    D --> E[💼 Projects]
    E --> F[🏢 Experience]
    F --> G[🛠️ Services]
    G --> H[💬 Testimonials]
    H --> I[📝 Blog]
    I --> J[📮 Contact]
    J --> K[🦶 Footer]
    
    style A fill:#2962FF,color:#fff
    style B fill:#00C853,color:#fff
    style C fill:#FF6D00,color:#fff
    style D fill:#AA00FF,color:#fff
    style E fill:#D50000,color:#fff
    style F fill:#0091EA,color:#fff
    style G fill:#00BFA5,color:#fff
    style H fill:#FFAB00,color:#000
    style I fill:#6200EA,color:#fff
    style J fill:#C51162,color:#fff
    style K fill:#455A64,color:#fff

</div>
🎯 All sections consume CMS content dynamically through backend APIs.

🔄 Content Flow
<div align="center">

flowchart TD
    A[👨‍💼 Admin Logs In] --> B[✏️ Creates / Updates Content]
    B --> C[📤 Admin Panel Sends API Request]
    C --> D[✅ FastAPI Validates Request]
    D --> E[🗄️ PostgreSQL Stores Data]
    E --> F[🌐 Public Portfolio Requests Data]
    F --> G[⚡ FastAPI Returns Latest Content]
    G --> H[🎨 Portfolio Displays Updated Content]
    
    style A fill:#2962FF,color:#fff
    style B fill:#00C853,color:#fff
    style C fill:#FF6D00,color:#fff
    style D fill:#AA00FF,color:#fff
    style E fill:#336791,color:#fff
    style F fill:#0091EA,color:#fff
    style G fill:#00BFA5,color:#fff
    style H fill:#6200EA,color:#fff

</div>

🖼️ Media Management
The project includes a separate upload service for portfolio images and media.

<div align="center">
📤 Supported Formats
https://img.shields.io/badge/JPEG-FF6F00?style=for-the-badge&logo=jpeg&logoColor=white
https://img.shields.io/badge/PNG-00A98F?style=for-the-badge&logo=png&logoColor=white
https://img.shields.io/badge/WEBP-4285F4?style=for-the-badge&logo=webp&logoColor=white
https://img.shields.io/badge/GIF-FF4088?style=for-the-badge&logo=gif&logoColor=white

Uploaded media is exposed by the backend through:

/uploads
</div>

🚀 Local Development
1️⃣ Clone Repository
git clone https://github.com/JADAVDHRUVIT21/Portfolio-CMS.git
cd Portfolio-CMS

2️⃣ Backend Setup ⚡
cd backend
python -m venv venv
.\env\Scripts\Activate.ps1     # Windows PowerShell
# source venv/bin/activate      # macOS / Linux

pip install -r requirements.txt

Create .env file:
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key

Run the server:
uvicorn app.main:app --reload

Service	URL
🏠 Backend	http://127.0.0.1:8000
📘 Swagger Docs	http://127.0.0.1:8000/docs
3️⃣ Public Frontend 🌐

cd frontend
npm install
npm run dev

Default: http://localhost:5173

4️⃣ Admin Panel 🔐

cd admin-panel
npm install
npm run dev

Default: http://localhost:5174

5️⃣ Upload Service 📤

cd upload-service
npm install
# Start using the configured server entry point

🏗️ Production Deployment
⚡ Backend — Render
The FastAPI backend is deployed as a Render Web Service.

uvicorn app.main:app --host 0.0.0.0 --port $PORT

🗄️ Production database hosted on Render PostgreSQL.

🔐 Admin Panel — Vercel
<div align="center">
Live: https://portfolio-cms-admin-panel.vercel.app/

</div>
⚙️ Vercel SPA routing configured so React routes like /login continue working after refresh.

🌐 Public Portfolio — Vercel
<div align="center">
Live: https://dhruvit-portfolio-cms.vercel.app/

</div>
🔧 Environment Variables
<table> <tr> <td valign="top" width="50%">
⚡ Backend

DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key

</td> <td valign="top" width="50%">
🌐 Frontend / Admin Panel
VITE_API_URL=your_render_backend_url
</td> </tr> </table>
⚠️ Never commit real production credentials or .env files to GitHub.

🧪 Testing Checklist
<div align="center">
#	✅ Test Case	Status
1	Public portfolio opens	⬜
2	Admin panel opens	⬜
3	Admin login works	⬜
4	Admin route refresh works	⬜
5	Dashboard loads	⬜
6	About CRUD works	⬜
7	About cards work	⬜
8	Skills CRUD works	⬜
9	Projects CRUD works	⬜
10	Experience CRUD works	⬜
11	Services CRUD works	⬜
12	Testimonials CRUD works	⬜
13	Blogs CRUD works	⬜
14	Messages work	⬜
15	Media management works	⬜
16	Contact form works	⬜
17	Backend health endpoint works	⬜
18	CMS changes appear on public portfolio	⬜
19	Desktop responsive layout works	⬜
20	Mobile responsive layout works	⬜
</div>
🔒 Security Notice
🛡️ Important Security Guidelines

The administrator credentials provided in this README are for the current project/demo environment only.

✅ For Production Use:
<table> <tr> <td valign="top" width="50%">
🔑 Change the admin password

🔐 Keep the JWT SECRET_KEY private

🗄️ Keep PostgreSQL credentials private

🌍 Store secrets in deployment environment variables

</td> <td valign="top" width="50%">
📁 Do not commit .env files

🚫 Restrict CORS to trusted production domains

🔄 Rotate credentials if accidentally exposed

🧹 Regularly audit access logs

</td> </tr> </table>
👨‍💻 Developer
<div align="center">
Dhruvit Jadav
Full Stack Developer & Software Engineer

https://img.shields.io/badge/GitHub-JADAVDHRUVIT21-181717?style=for-the-badge&logo=github

</div>
🎯 Areas of Development
<div align="center">
💻 Domain	🌟 Expertise
🧩 Full Stack Development	End-to-end application development
🐍 Python Development	Backend & scripting
⚡ Backend Development	REST APIs & microservices
🧱 MERN Stack Development	MongoDB, Express, React, Node
📱 Flutter Development	Cross-platform mobile apps
🤖 Android Development	Native Android applications
🔗 REST API Development	Scalable API design
🗄️ PostgreSQL / DB Development	Relational database design
📊 CMS Development	Custom content management systems
</div>
🎯 Project Purpose
This project demonstrates a complete custom portfolio CMS architecture with:

<div align="center">

mindmap
  root((🎯 Portfolio CMS))
    💻 Full-Stack Development
    ⚛️ React Frontend
    ⚡ FastAPI Backend
    🗄️ PostgreSQL Integration
    🔐 JWT Authentication
    👥 Role-Based Access
    🔗 REST API Development
    ✏️ CRUD Operations
    📊 CMS Architecture
    📤 Media/File Handling
    📱 Responsive UI
    ☁️ Production Deployment

</div>
🎯 Main Goal: Provide a portfolio website that can be maintained entirely through an administrator dashboard — without requiring direct frontend code changes for normal content updates.

📜 License
<div align="center">
This project is a custom Portfolio CMS developed for portfolio, internship, and project demonstration purposes.

📄 Custom License — Free for educational & portfolio use
</div>

<div align="center">
⭐ If you found this project helpful, please give it a star! ⭐
https://img.shields.io/github/stars/JADAVDHRUVIT21/Portfolio-CMS?style=for-the-badge&logo=github&color=yellow
https://img.shields.io/github/forks/JADAVDHRUVIT21/Portfolio-CMS?style=for-the-badge&logo=github&color=blue

https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=fadeIn

Made with ❤️ by Dhruvit Jadav

</div>