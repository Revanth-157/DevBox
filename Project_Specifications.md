You are an experienced Senior Full Stack Engineer and Software Architect.

I want you to build a production-quality SaaS application called DevBox.

Do NOT generate everything at once.

Build the project exactly like a real software company would.

Each phase must compile successfully before moving to the next phase.

Never leave TODOs.

Never use placeholder code.

Never skip error handling.

Write production-ready code.

Project Overview

DevBox is a developer productivity platform.

Think:

Notion
GitHub Gists
Postman
SQL Notebook

combined into one application.

Developers should be able to organize every technical resource they use daily inside one centralized workspace.

The UI should look modern and premium similar to Linear, Notion, Vercel, Clerk Dashboard and Supabase Studio.

Tech Stack

Frontend

React 19
TypeScript
Vite
TailwindCSS
shadcn/ui
React Router
React Query
Zustand
Axios
React Hook Form
Zod
Lucide Icons

Backend

Node.js
Express
TypeScript
Prisma ORM
PostgreSQL
JWT Authentication
bcrypt
Helmet
CORS
Morgan
Rate Limiting
dotenv

Database

PostgreSQL

ORM

Prisma

Deployment

Frontend

Vercel

Backend

Render

Database

Neon PostgreSQL

Version Control

Git

GitHub

Use Conventional Commits.

Architecture

Use clean architecture.

client/

server/

database/

docs/


Backend

src/

controllers/

services/

repositories/

middlewares/

routes/

config/

utils/

types/

validators/

prisma/


Frontend

components/

pages/

hooks/

layouts/

features/

services/

store/

types/

utils/

Authentication

Implement

JWT Authentication

Features

Register

Login

Logout

Refresh Token

Protected Routes

Password Hashing

Role field

Developer

Admin
Database Design

Users

id

name

email

password

avatar

role

createdAt

updatedAt

Notes

id

title

content

favorite

tags

createdAt

updatedAt

userId

Snippets

id

title

language

description

code

favorite

tags

userId

SQL Queries

id

title

databaseType

query

description

favorite

userId

API Collections

id

title

method

url

headers

body

responseExample

favorite

userId

Resources

id

title

url

category

description

favorite

userId

Terminal Commands

id

title

command

description

os

favorite

userId
Features
Dashboard

Statistics

Recent Notes

Recent Snippets

Recent APIs

Recent SQL Queries

Favorite Items

Search Bar

Notes

CRUD

Markdown support

Search

Tags

Favorite

Delete

Code Snippets

CRUD

Syntax Highlighting

Language Filter

Search

Favorite

Copy Button

SQL Queries

CRUD

Database Type

Search

Favorite

Copy

API Vault

CRUD

HTTP Method

Headers

Body

Response Example

Search

Terminal Commands

CRUD

Linux

Windows

Mac

Copy Button

Resources

CRUD

Links

Categories

Tags

Search

Global Search

Search everything simultaneously.

Return grouped results.

Notes

Snippets

Queries

Resources

Commands

APIs

Favorites

Unified favorite page.

Profile

Update Profile

Change Password

Avatar Upload

UI

Modern SaaS UI.

Responsive.

Sidebar Navigation.

Top Navbar.

Cards.

Tables.

Dialogs.

Skeleton Loading.

Empty States.

404 Page.

Dark Mode.

Professional typography.

Smooth animations.

Backend APIs

REST APIs.

Use proper HTTP Status Codes.

Validation

Centralized Error Handling.

Pagination.

Filtering.

Searching.

Sorting.

Authentication Middleware.

Security

Helmet

Rate Limiter

Password Hashing

JWT Expiration

Input Validation

SQL Injection Protection

CORS

Environment Variables

Code Quality

Use

ESLint

Prettier

Strict TypeScript

Reusable Components

Reusable Services

No duplicated code.

Git Workflow

Every major feature should represent one commit.

Example

feat(auth): implement jwt authentication

feat(notes): add notes CRUD

feat(search): implement global search

fix(api): improve validation

style(ui): redesign dashboard
Documentation

Generate

README.md

Installation Guide

Environment Variables

API Documentation

Folder Structure

Screenshots Placeholder

Deployment Guide

Development Order

Build ONLY in this exact order.

Phase 1

Project initialization

Folder structure

Dependencies

Configuration

Phase 2

Database

Prisma

Models

Migration

Seed

Phase 3

Authentication

Phase 4

Backend APIs

Phase 5

Frontend Layout

Phase 6

Authentication UI

Phase 7

Dashboard

Phase 8

Notes

Phase 9

Snippets

Phase 10

SQL Queries

Phase 11

API Vault

Phase 12

Resources

Phase 13

Terminal Commands

Phase 14

Global Search

Phase 15

Favorites

Phase 16

Deployment

Phase 17

Testing

Phase 18

Documentation

Important Rules

Never skip phases.

Never assume code exists.

Compile after every phase.

Fix all TypeScript errors.

Fix lint errors.

Ensure the application runs before moving to the next phase.

Do NOT generate everything in one response.

Wait after each phase for confirmation before continuing.