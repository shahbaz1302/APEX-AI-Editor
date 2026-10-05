# ⚡ Apex - Cloud Development & Workspace Platform

Apex is a cloud-based development workspace and interactive IDE platform. It features real-time browser terminal streaming, code editing with Monaco Editor, AI assistance, file system management, and a scalable microservices architecture.

---

## 🏗️ Architecture Overview

Apex is structured as a modular microservices architecture separating the frontend client interface from backend services and API routing.

```
Apex Workspace
├── frontend/                     # React 19 + Vite Frontend Application
└── backend/                      # Backend Microservices Architecture
    ├── gateway/                  # API Gateway & Traffic Router
    ├── docker-compose.yml        # Infrastructure setup (Redis, databases)
    ├── shared/                   # Shared utilities, middleware & schemas
    └── services/                 # Microservices
        ├── ai/                   # AI Code Assistant Service
        ├── auth/                 # Authentication & User Management
        ├── files/                # File System & Workspace Storage Service
        ├── payment/              # Payment & Subscription Service
        ├── project/              # Project Workspace Manager Service
        └── terminal/             # Interactive PTY Terminal Service (Node-pty + WebSockets)
```

---

## ✨ Key Features

- **Interactive Web Terminal**: Powered by `@xterm/xterm` on the frontend and `node-pty` with `socket.io` on the backend for real-time shell access.
- **Monaco Code Editor**: Full-featured code editing experience using `@monaco-editor/react`.
- **AI Coding Assistant**: Intelligent code completions, suggestions, and chat integrations.
- **Microservices Architecture**: Decoupled, independent services communicating through an API Gateway and Redis pub/sub message bus.
- **Containerized Infrastructure**: Docker support for services, gateway, and infrastructure dependencies.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS, Motion (Framer Motion), Lucide / Iconify React Icons
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Editor & Terminal**: `@monaco-editor/react`, `@xterm/xterm`, `@xterm/addon-fit`
- **Real-Time Communication**: `socket.io-client`, `axios`
- **Authentication**: Firebase

### Backend & Infrastructure
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database & Cache**: MongoDB / Mongoose, Redis
- **Terminal Engine**: `node-pty`, `socket.io`
- **Containerization**: Docker, Docker Compose

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ or v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) & Docker Compose (for running Redis and containerized services)

---

### 1. Local Setup

#### Clone the Repository
```bash
git clone <repository-url>
cd Apex
```

#### Set Up Infrastructure
Start Redis using Docker Compose:
```bash
cd backend
docker compose up -d
```

#### Install Dependencies

**Frontend:**
```bash
cd ../frontend
npm install
```

**Backend Gateway & Services:**
```bash
cd ../backend/gateway
npm install

# Install dependencies for individual services as needed
cd ../services/terminal
npm install
```

---

### 2. Running Locally

#### Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will start at `http://localhost:5173`.

#### Start Backend Gateway & Services
Start the gateway and required microservices:
```bash
# Start Gateway
cd backend/gateway
npm run dev

# Start Terminal Service
cd ../services/terminal
npm run dev
```

---

## 🌐 Deployment Strategy

### Frontend Deployment (Vercel)
The `frontend` application is built with Vite and can be deployed directly to [Vercel](https://vercel.com):

1. Set the Root Directory on Vercel to `frontend`.
2. Framework Preset: `Vite`.
3. Set environment variables:
   - `VITE_API_GATEWAY_URL`: URL of your deployed backend gateway.
   - `VITE_SOCKET_URL`: URL of your deployed terminal service.

### Backend Microservices Deployment (Railway / Render / Cloud Run)
Because services like `terminal` rely on `node-pty` and persistent WebSocket connections (`socket.io`), deploy the containerized services to a container hosting provider:

- **Options**: [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), or [Google Cloud Run](https://cloud.google.com/run).
- **Setup**: Deploy `backend/gateway` as your entry point and containerize individual services in `backend/services/*`.

---

## 📝 Environment Variables

Example `.env` templates should be configured per service:

### `frontend/.env`
```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5000
```

### `backend/gateway/.env`
```env
PORT=3000
CLIENT_URL=http://localhost:5173
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
