# Team Task Manager

A production-ready full-stack team collaboration and task management web application.

## Live Demo

> https://ideal-intuition-production-5f1d.up.railway.app/

---

## Tech Stack

**Frontend:**
- React 18 + Vite
- React Router v6 (`createBrowserRouter`)
- Tailwind CSS v3
- Axios (with interceptors)
- react-hot-toast
- lucide-react

**Backend:**
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT (httpOnly cookies) & OAuth 2.0 (Google, GitHub)
- Google Gemini API (`@google/genai`)
- bcryptjs, express-validator

---

## Features

- **Authentication** — Email/Password and Social Logins (Google & GitHub) with JWT stored in httpOnly cookies.
- **Premium Landing Page** — Beautifully crafted, high-converting landing page showcasing the product.
- **Minimalist, UI** — Elegant, uncluttered design prioritizing focus and ease of use, inspired by Raycast and Linear.
- **Micro-Animations** — Smooth transitions and 3D hover effects powered by Framer Motion.
- **User Profiles & Subscriptions** — Account settings modal to update profile details, and tiered subscription plans (Starter, Pro, Enterprise) to scale with growing teams.
- **Projects & Tasks** — Create, update, delete projects and tasks with full CRUD, assignments, priorities, and due dates.
- **Member Management** — Admins can add/remove team members by email with ADMIN or MEMBER roles.
- **Role-Based Access** — Admins can manage everything; members can update their assigned task status.
- **Productivity Analytics** — Real-time AI-powered dashboard powered by Google Gemini to analyze team workload, task completion rates, and project health scores.
- **AI Meeting Assistant** — Advanced meeting summaries and task extractions using Gemini.
- **Responsive Design** — Collapsible sidebar, mobile-friendly layouts.
- **Toast Notifications** — Instant feedback on all actions.

---

## Screenshots

| Dashboard | Productivity Analytics | AI Meeting Assistant |
|-----------|------------------------|----------------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Productivity Analytics](./screenshots/analytics.png) | ![AI Meeting Assistant](./screenshots/ai_meeting.png) |

| Create Project | Pricing Plans |
|----------------|---------------|
| ![Create Project](./screenshots/create_project.png) | ![Pricing Plans](./screenshots/pricing.png) |

---

## AI RAG Workflow

While traditionally RAG involves vector databases, our current implementation utilizes a contextual retrieval generation approach. The workflow operates as follows:

1. **Context Retrieval**: When a user requests AI insights (e.g., productivity analytics), the backend retrieves the relevant context (user's projects, tasks, member workloads, and completion rates) directly from the PostgreSQL database using Prisma.
2. **Prompt Construction**: This highly structured context is injected into a specialized prompt alongside the user's specific request or the meeting notes.
3. **Generation**: The compiled prompt is sent to the Google Gemini API (`gemini-2.5-flash`), instructing it to generate insights, health scores, or extract actionable tasks.
4. **Structured Output**: Gemini responds with a strict JSON structure, which is then parsed by the Express controller and sent back to the React client to be rendered on the dashboard or meeting summary views.

```mermaid
flowchart TD
    User[User] -->|Action / Input| Client[Client Interface]
    Client -->|API Request| API[Backend API]
    
    subgraph RAG Pipeline
        API -->|Context Query| DB[(PostgreSQL)]
        DB -->|Context Data| API
        API -->|Prompt + Context| Gemini[Google Gemini API]
    end
    
    Gemini -->|JSON Response| API
    API -->|Formatted Data| Client
    Client -->|Rendered UI| User
```

---

## Project Architecture

The application follows a modern client-server architecture:

- **Frontend (Client)**: A React Single Page Application (SPA) built with Vite. It manages state via Context API/Hooks and uses React Router for client-side routing. Tailwind CSS provides the styling system.
- **Backend (Server)**: A RESTful Node.js/Express API. It handles business logic, authentication (JWT/OAuth), and AI integrations.
- **Database Layer**: PostgreSQL serves as the primary data store, with Prisma ORM bridging the gap between the Express controllers and the database, ensuring type safety and easy schema migrations.
- **External Services**: Integrates with Google and GitHub for OAuth, and Google Gemini for AI-powered features.

```mermaid
flowchart TD
    subgraph Client
        React[React SPA]
    end

    subgraph Server
        API[Express API]
    end

    subgraph Database
        DB[(PostgreSQL)]
    end

    subgraph External
        OAuth[OAuth Providers]
        Gemini[Gemini API]
    end

    React <-->|REST / JSON| API
    API <-->|Prisma ORM| DB
    API <-->|Auth Tokens| OAuth
    API <-->|Prompts & Data| Gemini
```

---

## Folder Structure

```text
team-task-manager/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/
│       ├── api/            # Axios API client configurations
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── hooks/          # Custom React hooks
│       ├── layouts/        # Page layouts (e.g., Dashboard layout)
│       ├── pages/          # Individual page views
│       ├── App.jsx         # Root component
│       └── main.jsx        # Entry point
├── server/                 # Backend Express application
│   ├── prisma/             # Prisma schema and migrations
│   └── src/
│       ├── controllers/    # Route handlers and AI logic
│       ├── lib/            # Utility functions and DB connections
│       ├── middleware/     # Express middlewares (auth)
│       ├── routes/         # API route definitions
│       ├── services/       # External service integrations
│       ├── validators/     # Request validation schemas
│       └── index.js        # Entry point for the server
├── screenshots/            # Project screenshots for documentation
└── README.md               # Project documentation
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud like Railway/Neon)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Configure server environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
```
DATABASE_URL=postgresql://user:password@localhost:5432/taskmanager
JWT_SECRET=your-random-64-char-secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
NODE_ENV=development
PORT=5000

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret

# AI Features
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set up database

```bash
npx prisma db push
```

### 5. Install client dependencies

```bash
cd ../client
npm install
```

### 6. Start the servers

In one terminal (server):
```bash
cd server
npm run dev
```

In another terminal (client):
```bash
cd client
npm run dev
```

Visit **http://localhost:5173**

---

## API Documentation

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/signup` | Create account, set cookie | No |
| POST | `/api/auth/login` | Login, set cookie | No |
| POST | `/api/auth/logout` | Clear cookie | No |
| GET | `/api/auth/me` | Get current user | Cookie |
| PUT | `/api/auth/profile` | Update user profile | Cookie |
| GET | `/api/auth/google` | Initiate Google OAuth | No |
| GET | `/api/auth/github` | Initiate GitHub OAuth | No |
| GET | `/api/projects` | List user's projects | ✅ |
| POST | `/api/projects` | Create project | ✅ |
| GET | `/api/projects/:id` | Get project + members | ✅ Member |
| PUT | `/api/projects/:id` | Update project | ✅ Admin |
| DELETE | `/api/projects/:id` | Delete project | ✅ Admin |
| POST | `/api/projects/:id/members` | Add member by email | ✅ Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | ✅ Admin |
| GET | `/api/projects/:projectId/tasks` | List tasks (filterable) | ✅ Member |
| POST | `/api/projects/:projectId/tasks` | Create task | ✅ Member |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Update task | ✅ Member/Admin |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete task | ✅ Admin |
| GET | `/api/dashboard` | Get user dashboard stats | ✅ |
| GET | `/api/analytics/insights` | Get AI productivity metrics | ✅ |

---

## Deployment on Railway

1. Push to a GitHub repository.
2. In Railway, create a new project from GitHub.
3. Create **two services** from the same repo:
   - **server**: Root `/server`, build: `npx prisma generate && npx prisma db push`, start: `node src/index.js`
   - **client**: Root `/client`, build: `npm run build`, start: `npx serve dist -s -l $PORT`
4. Add a **PostgreSQL** database service.
5. Set server env vars: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`
6. Set client env var: `VITE_API_URL=https://your-server.up.railway.app/api`
