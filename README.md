# 🚀 Mini Vercel

**A simplified, Vercel-inspired deployment platform that makes CI/CD visible.**

Mini Vercel lets a developer connect a GitHub repository and have it automatically built and deployed through a fully automated pipeline — GitHub Actions builds the app and ships it to Amazon S3, with every step of that process visualized in the dashboard rather than hidden behind a spinner.

Built with **React, TypeScript, Node.js, Express, MongoDB, GitHub OAuth, GitHub Actions, and Amazon S3.**

> This is a personal/portfolio project inspired by Vercel's developer experience. It is not affiliated with or endorsed by Vercel.

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=flat&logo=amazons3&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=white)

---

## Table of Contents

- [Why Mini Vercel](#why-mini-vercel)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [CI/CD Pipeline](#️-cicd-pipeline)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Live Demo](#-live-demo)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Author](#-author)

---

## Why Mini Vercel

Most deployment platforms hide the deployment process behind a loading spinner. You push code, wait, and eventually receive either a success notification or an error.

Mini Vercel takes a different approach.

Instead of hiding the deployment process, it visualizes every stage of the CI/CD pipeline so developers can clearly understand what is happening during deployment.

Each deployment is represented as a sequence of visible stages:

- GitHub
- GitHub Actions
- Amazon S3

This makes the deployment workflow easier to understand, debug, and demonstrate for educational purposes.


---

## ✨ Features

- 🔐 **GitHub OAuth Authentication** — sign in with your GitHub account, no separate credentials to manage
- 📂 **Repository Import** — connect any repository you have access to in one step
- 📦 **Project Dashboard** — see all your imported projects and their current status at a glance
- 📊 **Interactive Deployment Pipeline Visualization** — a live, stage-by-stage view of each deployment as it happens
- 🔄 **One-Click Redeploy** — re-trigger a deployment without leaving the dashboard
- 🗑️ **Project Deletion** — remove imported projects you no longer need
- 🎨 **Modern, Vercel-Inspired UI** — clean, dark-themed interface built with Tailwind CSS
- ⚡ **Responsive Frontend** — works across desktop and mobile viewports

---

## 🏆 Project Highlights

This project demonstrates:

- GitHub OAuth authentication using Passport.js
- REST API development with Express.js
- MongoDB data modeling with Mongoose
- React + TypeScript frontend architecture
- Responsive dashboard design using Tailwind CSS
- Automated CI/CD pipeline using GitHub Actions
- Static website deployment to Amazon S3
- AWS IAM integration using deployment credentials
- Modern deployment dashboard inspired by Vercel

---

## 🏗️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js 
- GitHub OAuth 

**DevOps / Cloud**
- GitHub Actions (CI/CD)
- Amazon S3 (static hosting)
- AWS IAM (deployment credentials)

---

## 🧭 Architecture

```
 User (Browser)
      │
      ▼
 React Frontend (Vite + TypeScript)
      │  REST API
      ▼
 Express Backend  ──────►  GitHub OAuth / GitHub REST API
      │
      ▼
 MongoDB
 (Users · Projects · Deployments)
```

Deployments themselves are handled outside the backend, by GitHub Actions directly — see the pipeline below.

---

## ⚙️ CI/CD Pipeline

Every push to `main` automatically triggers the deployment workflow defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

```
Push to GitHub
      │
      ▼
GitHub Actions Triggered
      │
      ▼
Install Dependencies
(npm install)
      │
      ▼
Build React App
(npm run build)
      │
      ▼
Upload dist/ Folder
to Amazon S3
      │
      ▼
Frontend Live on AWS

```

No manual build process.

No manual uploads.

A simple **git push** automatically deploys the latest frontend to Amazon S3.


---

## 📁 Project Structure

```
mini-vercel/
│
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
│
├── server/                 # Express backend
│   └── src/
│       ├── routes/
│       ├── models/
│       └── ...
│
├── docs/                   # Project documentation
│
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD pipeline definition
```

---

## 🧪 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [GitHub OAuth App](https://github.com/settings/developers) (for authentication)
- An AWS account with an S3 bucket configured for static website hosting (if you want deployments to actually publish somewhere)

### 1. Clone the repository

```bash
git clone <repository-url>
cd mini-vercel
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `client/` with:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

## 🌐 Live Demo

### Frontend

🔗 http://mini-vercel-frontend-harshita.s3-website.ap-south-1.amazonaws.com

The frontend is automatically built and deployed using **GitHub Actions** and **Amazon S3 Static Website Hosting**.

> **Note:** The backend is currently intended for local development. Authentication and repository management features require running the backend locally as described in the Getting Started section.

---

## 🗺️ Roadmap

Future improvements include:

- [ ] Deploy backend to AWS EC2 / Render
- [ ] CloudFront CDN integration
- [ ] HTTPS support
- [ ] Deployment history
- [ ] Rollback support
- [ ] Custom domain support
- [ ] Environment Variable Management
- [ ] Preview Deployments
- [ ] Build Logs
- [ ] Stage Duration Metrics
---

## 🎓 Academic Context

This project was developed as part of a cloud deployment automation project focused on implementing a CI/CD pipeline using **GitHub Actions** and **Amazon S3**.

The objective was to automate frontend deployment while demonstrating modern cloud deployment practices and providing a transparent visualization of the deployment workflow.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👩‍💻 Author

**Harshita Mugdha**

Built as a hands-on exploration of:

- CI/CD Automation
- GitHub OAuth
- Cloud Deployment
- GitHub Actions
- Amazon S3
- React + TypeScript
- Express & MongoDB

⭐ If you found this project interesting, consider giving the repository a star.
