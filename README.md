# ⚡ Apex - AI-Powered Cloud Development & Interactive Workspace Platform

**Apex** is an enterprise-grade cloud-based development workspace and interactive IDE platform. Inspired by modern AI-native editors like Cursor, Apex features real-time browser terminal streaming, code editing with Monaco Editor, an autonomous agentic AI assistant powered by **LangChain** and **LangGraph**, workspace file system management, and a highly scalable microservices architecture deployed on **Amazon Web Services (AWS)** using **ECR**, **EC2**, and **Amazon ElastiCache for Redis**.

---

## 🏗️ Architecture Overview

Apex is structured as a decoupled microservices architecture separating the frontend client interface from backend services, AI agent workflows, and cloud infrastructure.

```
Apex Workspace
├── frontend/                     # React 19 + Vite + Tailwind CSS Frontend
└── backend/                      # Backend Microservices Architecture
    ├── gateway/                  # API Gateway & Traffic Router (Express)
    ├── docker-compose.yml        # Infrastructure orchestration (Redis, MongoDB)
    ├── shared/                   # Shared utilities, Redis connection & schemas
    └── services/                 # Microservices
        ├── ai/                   # AI Code Assistant (LangChain + LangGraph Agent)
        ├── auth/                 # Authentication & User Management (Firebase + MongoDB)
        ├── files/                # Workspace File System Storage Service
        ├── payment/              # Payment & Subscription Management
        ├── project/              # Project Workspace Manager Service
        └── terminal/             # Interactive PTY Terminal (Node-pty + WebSockets)
```

---

## ✨ Key Features

- 🧠 **Agentic AI Coding Assistant**: Stateful, multi-step code generation and filesystem manipulation using **LangChain** and **LangGraph** with custom tool orchestration (`get_tree`, `get_file`, `create_file`, `update_file`).
- 🖥️ **Interactive Web Terminal**: Real-time interactive shell access powered by `@xterm/xterm` on the frontend and `node-pty` streaming over WebSockets (`socket.io`) on the backend.
- 📝 **Monaco Code Editor**: Code editing experience powered by `@monaco-editor/react`, supporting syntax highlighting, dynamic themes, and live file synchronization.
- ⚡ **Microservices & Event Bus**: Decoupled, event-driven architecture using Express.js microservices communicating via an API Gateway and **Redis Pub/Sub**.
- ☁️ **AWS Cloud Deployment**: Fully containerized using **Docker**, images stored in **Amazon ECR**, deployed on **Amazon EC2**, and backed by **Amazon ElastiCache for Redis**.

---

## 🛠️ Comprehensive Tech Stack & Tools

### 🎨 Frontend
- **Core Framework**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing & Navigation**: [React Router DOM v7](https://reactrouter.com/)
- **Styling & Motion**: [Tailwind CSS v4](https://tailwindcss.com/), [Motion (Framer Motion)](https://motion.dev/), [Lucide React Icons](https://lucide.dev/), [Material Icon Theme](https://iconify.design/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`)
- **Code Editor**: [`@monaco-editor/react`](https://github.com/suren-atoyan/monaco-react)
- **Terminal Integration**: [`@xterm/xterm`](https://xtermjs.org/), [`@xterm/addon-fit`](https://xtermjs.org/)
- **Real-Time Streaming & APIs**: [`socket.io-client`](https://socket.io/), [Axios](https://axios-http.com/)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/)

### ⚙️ Backend Microservices
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Real-Time Terminal Engine**: [`node-pty`](https://github.com/microsoft/node-pty), [`socket.io`](https://socket.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
- **In-Memory Cache & Message Broker**: [Redis](https://redis.io/) (`ioredis`)

### 🤖 AI Agent Integration
- **Orchestration Framework**: **[LangChain](https://www.langchain.com/)** (`@langchain/core`, `langchain`)
- **Agentic Stateful Graph**: **[LangGraph](https://www.langchain.com/langgraph)** (`@langchain/langgraph`)
- **Model Providers**: [OpenRouter API](https://openrouter.ai/) (`@langchain/openrouter`)
- **Data Validation & Schemas**: [Zod](https://zod.dev/)
- **Agentic Tools**: Custom filesystem tools (`get_tree`, `get_file`, `create_folder`, `create_file`, `update_file`) for direct code editing and automated project generation inside the workspace.

### ☁️ AWS Infrastructure & Deployment
- **[Amazon ECR (Elastic Container Registry)](https://aws.amazon.com/ecr/)**: Private container registry for building, scanning, and storing Docker images for all microservices (Gateway, AI, Auth, Files, Project, Terminal).
- **[Amazon EC2 (Elastic Compute Cloud)](https://aws.amazon.com/ec2/)**: Virtual servers executing containerized services orchestrated via Docker / Docker Compose.
- **[Amazon ElastiCache for Redis](https://aws.amazon.com/elasticache/redis/)**: Fully managed, high-performance in-memory cache and Pub/Sub message broker linking microservices.
- **[Docker & Docker Compose](https://www.docker.com/)**: Multi-stage container builds ensuring identical local development and production runtime environments.

---

## 🤖 AI Service Architecture (LangChain & LangGraph)

The AI assistant inside `backend/services/ai` uses **LangGraph** stateful graphs to behave like an autonomous coding partner:

```
[User Request] 
      │
      ▼
┌──────────────┐
│  StateGraph  │ ◄─── State: MessagesAnnotation
└──────┬───────┘
       │
       ▼
┌──────────────┐      Call Tools       ┌─────────────────┐
│  LLM Agent   │ ───────────────────►  │    ToolNode     │
│ (OpenRouter) │ ◄───────────────────  │ (fileTools.js)  │
└──────────────┘    Tool Responses     └────────┬────────┘
       │                                        │
       │ Finished                               │ Operates on
       ▼                                        ▼
[Final Output]                        [Workspace Filesystem]
```

### Agent Features:
1. **Stateful Graph Execution**: Built using `StateGraph` and `MessagesAnnotation` from `@langchain/langgraph`.
2. **Autonomous Tool Selection**: Automatically decides when to inspect directory structure (`get_tree`), view files (`get_file`), or write code (`create_file`, `update_file`).
3. **Structured System Prompt**: Optimized for Cursor-like IDE editing—building minimal, working code directly in the target project workspace.

---

## 🌐 AWS Deployment & Cloud Infrastructure

Apex is engineered for scalable deployment on **Amazon Web Services (AWS)**.

```
                         ┌─────────────────────────────────────────┐
                         │               Vercel                    │
                         │      (React 19 + Vite Frontend)         │
                         └──────────────────┬──────────────────────┘
                                            │ HTTPS / WebSockets
                                            ▼
                         ┌─────────────────────────────────────────┐
                         │         AWS EC2 Instance / Cluster      │
                         │  ┌───────────────────────────────────┐  │
                         │  │        API Gateway (Docker)       │  │
                         │  └─────────────────┬─────────────────┘  │
                         │                    │                    │
                         │  ┌─────────────────┴─────────────────┐  │
                         │  │ Containerized Microservices       │  │
                         │  │  • AI Service (LangChain/Graph)   │  │
                         │  │  • Terminal Service (node-pty)    │  │
                         │  │  • Files / Auth / Project Services│  │
                         │  └─────────────────┬─────────────────┘  │
                         └────────────────────┼────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
                    ▼                                                   ▼
     ┌────────────────────────────┐                      ┌────────────────────────────┐
     │   Amazon ElastiCache Redis │                      │       MongoDB Atlas        │
     │   (Pub/Sub & Session Cache)│                      │    (Persistent Database)   │
     └────────────────────────────┘                      └────────────────────────────┘
```

### 1. Build and Push Images to Amazon ECR
```bash
# Authenticate Docker to your AWS ECR Registry
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com

# Build Docker Images
docker build -t apex-gateway ./backend/gateway
docker build -t apex-ai ./backend/services/ai
docker build -t apex-terminal ./backend/services/terminal

# Tag and Push to Amazon ECR
docker tag apex-ai:latest <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/apex-ai:latest
docker push <aws_account_id>.dkr.ecr.<your-region>.amazonaws.com/apex-ai:latest
```

### 2. AWS ElastiCache for Redis
1. Provision a Cluster in **Amazon ElastiCache for Redis**.
2. Pass the ElastiCache Endpoint URL (`redis://<elasticache-endpoint>:6379`) to all backend container configurations via the `REDIS_URL` environment variable.

### 3. Deploy on Amazon EC2
1. Launch an EC2 instance (e.g., Ubuntu `t3.medium` or higher for terminal PTY support).
2. Install Docker and Docker Compose on EC2.
3. Pull container images from **Amazon ECR** and run the services using `docker compose up -d`.

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Apex
```

### 2. Start Local Infrastructure
Start Redis and MongoDB containers locally:
```bash
cd backend
docker compose up -d
```

### 3. Install Dependencies & Start Services

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

**Backend Gateway:**
```bash
cd backend/gateway
npm install
npm run dev
```

**AI Service (LangChain & LangGraph):**
```bash
cd backend/services/ai
npm install
npm run dev
```

**Terminal Service:**
```bash
cd backend/services/terminal
npm install
npm run dev
```

---

## 📝 Environment Variables

Configure `.env` files for microservices:

### `frontend/.env`
```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5000
```

### `backend/gateway/.env`
```env
PORT=3000
CLIENT_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

### `backend/services/ai/.env`
```env
PORT=5001
OPENROUTER_API_KEY=your_openrouter_api_key
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/apex
```

### Production AWS Deployment (`.env` on EC2)
```env
REDIS_URL=redis://<your-elasticache-cluster-endpoint>:6379
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/apex
OPENROUTER_API_KEY=your_production_openrouter_api_key
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
