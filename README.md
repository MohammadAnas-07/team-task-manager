# Team Task Manager

A production-ready full-stack team collaboration and task management web application.

## Live Demo

> Deploy to Railway and add your link here.

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
- JWT (httpOnly cookies)
- bcryptjs, express-validator

---

## Features

- **Authentication** — Signup/Login with JWT stored in httpOnly cookies. Session persists across page refreshes.
- **Projects** — Create, update, delete projects. Each project has an owner (ADMIN) and members.
- **Member Management** — Admins can add/remove team members by email with ADMIN or MEMBER roles.
- **Tasks** — Full CRUD with title, description, priority (LOW/MEDIUM/HIGH), status (TODO/IN_PROGRESS/DONE), assignee, and due date.
- **Role-Based Access** — Admins can manage everything; members can update their assigned task status.
- **Dashboard** — Personalized stats: total tasks, to do, in progress, done, overdue tasks, and recent activity.
- **Responsive Design** — Collapsible sidebar, mobile-friendly layouts.
- **Toast Notifications** — Instant feedback on all actions.

---

## Screenshots

| Dashboard | Project Detail | Task Modal |
|-----------|---------------|------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

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
NODE_ENV=development
PORT=5000
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
