# DevBox

DevBox is a full-stack, developer-first workspace platform designed to centralize the technical resources developers use every day. It combines the workflow of a note-taking tool, a code snippet library, an API vault, a SQL query notebook, a command reference, and a personal knowledge hub into one polished SaaS-style experience.

The application is built as a production-oriented monorepo with a React/Vite frontend, an Express/TypeScript backend, Prisma ORM, PostgreSQL, and deployment-ready configuration for Vercel and Render.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Why DevBox](#why-devbox)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security & Reliability](#security--reliability)
- [Code Quality & Contribution Workflow](#code-quality--contribution-workflow)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)

---

## Project Overview

DevBox is intended to act as a modern developer productivity platform that helps users:

- organize technical notes and project context
- store reusable code snippets with syntax highlighting
- save SQL queries by database type
- manage API collections, request examples, and payload templates
- keep useful resources and terminal commands in one place
- search across all content types from a unified experience
- bookmark favorite items and personalize their workspace

The experience is designed to feel premium and modern, inspired by the productivity and design language of Linear, Notion, Vercel, Clerk, and Supabase Studio.

---

## Why DevBox

DevBox stands out because it is not just a note taker. It is a developer workspace that unifies several categories of technical knowledge into one coherent application:

- personal knowledge management
- code and snippet organization
- API and request exploration
- SQL query storage and reuse
- terminal command reference
- searchable developer memory

Instead of spreading these assets across separate tools, DevBox offers a single place to manage them with authentication, structure, search, and persistence.

---

## Core Features

### Authentication

- user registration
- login and logout
- refresh token handling
- protected routes
- password hashing with bcrypt
- role-based user identity with support for developer and admin roles

### Dashboard

- overview cards and summary statistics
- recent notes
- recent snippets
- recent APIs
- recent SQL queries
- favorite items
- quick access to key collections

### Notes

- create, read, update, and delete notes
- markdown-friendly content support
- search notes
- tag support
- favorite notes
- delete and edit workflows

### Code Snippets

- create, read, update, and delete snippets
- syntax highlighting for multiple languages
- language filter
- search by title, description, or content
- favorite snippets
- copy-to-clipboard support

### SQL Queries

- create, read, update, and delete SQL queries
- database type support
- query descriptions and tags
- search and favorite workflows
- copy query content

### API Vault

- create, read, update, and delete API collections
- HTTP method support
- headers, body, and response example storage
- search and favorite support
- developer-focused request organization

### Resources

- manage links and references
- categorize resources by topic or type
- add descriptions and tags
- search and favorite resources

### Terminal Commands

- save commands by operating system
- organize by use case or description
- copy command content quickly
- favorite and search commands

### Global Search

- search across notes, snippets, SQL queries, API collections, resources, and terminal commands
- grouped and unified results experience

### Favorites

- central page for bookmarked items across the platform
- quick access to the most-used assets

### Profile

- update profile information
- change password
- avatar support
- account personalization

### User Experience

- modern SaaS-style UI
- responsive layout
- sidebar navigation
- top navigation bar
- cards, tables, dialogs, and empty states
- skeleton loading states
- 404 handling
- dark mode support
- polished typography and motion

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Lucide Icons
- Prism.js for code highlighting
- React Markdown for rich content
- Vitest for testing
- Testing Library for UI tests

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs
- Helmet
- CORS
- Morgan
- dotenv

### DevOps & Delivery

- Git and GitHub
- Vercel for frontend deployment
- Render for backend deployment
- Neon PostgreSQL for production database hosting

---

## Architecture

DevBox follows a clean architectural approach with separate frontend, backend, and data layers.

### Backend Structure

- controllers
- services
- routes
- middlewares
- config
- utils
- types
- validators
- prisma schema

### Frontend Structure

- components
- pages
- hooks
- layouts
- features
- services
- store
- types
- utils

The backend exposes REST APIs with proper status codes, centralized error handling, authentication middleware, validation, and environment-based configuration.

---

## Project Structure

```text
client/
  src/
    components/
    pages/
    lib/
    types/
    styles.css
    App.tsx
    main.tsx

server/
  src/
    controllers/
    services/
    routes/
    middlewares/
    config/
    utils/
    types/
    lib/
  prisma/
    schema.prisma
    seed.ts
    migrations/

render.yaml
vercel.json
package.json
Project_Specifications.md
```

---

## Getting Started

### Prerequisites

Before running the project locally, make sure you have:

- Node.js 20+
- npm or pnpm
- PostgreSQL running locally or a remote PostgreSQL database
- Git

### Installation

```bash
git clone <your-repository-url>
cd Full_Stack_Project1
npm install
```

The repository uses npm workspaces for the client and server.

---

## Environment Variables

Create the necessary environment variables before starting the backend.

### Server Environment Variables

Create a `.env` file inside the server directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devbox
JWT_SECRET=devbox-super-secret-key
JWT_REFRESH_SECRET=devbox-refresh-secret-key
PORT=4000
NODE_ENV=development
```

### Frontend Environment Variables

Use a frontend environment variable for the API base URL:

```env
VITE_API_URL=http://localhost:4000
```

If the frontend is built for production, point `VITE_API_URL` to your deployed backend URL.

---

## Database Setup

This project uses Prisma with PostgreSQL.

### Generate Prisma Client

```bash
cd server
npm run prisma:generate
```

### Run Database Migrations

```bash
npm run db:migrate
```

### Seed the Database

```bash
npm run db:seed
```

If you are using a local PostgreSQL instance, ensure the database exists and that the connection string in `DATABASE_URL` points to it.

---

## Running Locally

### Start the Backend

```bash
npm run dev -w server
```

The backend will start on:

```text
http://localhost:4000
```

### Start the Frontend

```bash
npm run dev -w client
```

The frontend will start on:

```text
http://127.0.0.1:5173
```

### Verify the App

Open the frontend in the browser and verify the following flows:

- user registration
- login/logout
- dashboard load
- note creation and update
- snippet creation and highlighting
- SQL query creation
- API collection creation
- resource management
- terminal command storage
- global search
- favorites page
- profile edits

---

## API Overview

The backend exposes REST APIs under `/api` with routes for:

- authentication: `/api/auth`
- notes: `/api/notes`
- snippets: `/api/snippets`
- SQL queries: `/api/sqlqueries`
- API collections: `/api/apicollections`
- resources: `/api/resources`
- terminal commands: `/api/terminalcommands`
- search: `/api/search`
- favorites: `/api/favorites`
- profile: `/api/profile`

Health check endpoint:

```text
GET /health
```

All protected routes require a valid JWT in the `Authorization` header.

---

## Testing

### Frontend Tests

```bash
npm run test:client
```

### Backend Tests

```bash
npm run test:server
```

### Full Test Run

```bash
npm run test
```

The test suite validates important user flows, authentication behavior, and health checks for the backend.

---

## Deployment

### Frontend Deployment

The frontend is designed for deployment on Vercel.

Recommended build settings:

```bash
npm run build -w client
```

Output directory:

```text
client/dist
```

### Backend Deployment

The backend is designed for deployment on Render.

Recommended build settings:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

### Production Environment Variables

On Render, configure:

- `PORT=4000`
- `NODE_ENV=production`
- `DATABASE_URL=<postgresql-connection-string>`
- `JWT_SECRET=<secure-secret>`
- `JWT_REFRESH_SECRET=<secure-refresh-secret>`

On Vercel, configure:

- `VITE_API_URL=<deployed-backend-url>`

---

## Security & Reliability

DevBox is built with the following security and reliability principles:

- password hashing with bcrypt
- JWT-based authentication
- protected routes and middleware-based authorization
- HTTP security headers through Helmet
- cross-origin policy handling through CORS
- environment variable-based configuration
- input validation and safe request handling
- SQL injection prevention through Prisma parameterized queries
- centralized error handling for predictable behavior

---

## Code Quality & Contribution Workflow

The project follows professional software engineering practices:

- strict TypeScript usage
- reusable components and services
- no duplicated logic where shared abstractions are possible
- clear folder boundaries for frontend and backend
- conventional commits
- test-first or regression-oriented development practices
- compile and test before releasing new features

Suggested commit style:

```text
feat(auth): implement JWT authentication
feat(notes): add notes CRUD
feat(search): implement global search
fix(api): improve validation
style(ui): redesign dashboard
```

---

## Screenshots

Placeholder for screenshots of:

- dashboard
- notes workspace
- snippets page
- API vault
- global search
- profile page

---

## Roadmap

Planned improvements and extensions include:

- real-time collaboration
- team workspaces and shared collections
- AI-assisted search and summarization
- import/export for notes and snippets
- plugin integrations for external tools
- richer analytics and activity tracking
- advanced permissions and sharing controls
- execution support for SQL and API experiments

---

## License

This project is currently intended for educational and portfolio purposes unless otherwise licensed.
