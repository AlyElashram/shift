# SHIFT By Joe

Full-stack monorepo for a premium car import service (UAE to Egypt). React frontend + Ruby on Rails API backend.

## Architecture

```
shift/
├── frontend/          # React + Vite + CSS Modules
├── backend/           # Rails 8 API-only
├── docker-compose.yml # PostgreSQL
└── webapp/            # [Legacy] Next.js app (reference only)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router 7, CSS Modules, Axios |
| Backend | Ruby on Rails 8 (API-only) |
| Database | PostgreSQL 16 |
| Auth | Devise + JWT (custom controller) |
| Email | Action Mailer + Resend SMTP |
| Rate Limiting | Rack::Attack |

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Set up the backend

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3000
```

Rails API runs on `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs on `http://localhost:5173`.

### Default Admin

- **Email:** admin@shift.com
- **Password:** admin123
- **Role:** Super Admin

> Change this immediately in production.

## API Endpoints

All endpoints prefixed with `/api/v1/`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/login | No | Login, returns JWT + user |
| DELETE | /auth/logout | Yes | Revoke JWT |
| GET | /auth/me | Yes | Current user (token validation) |
| GET | /dashboard | Yes | Dashboard stats + recent activity |
| GET/POST | /shipments | Yes | List/create shipments |
| GET/PATCH/DELETE | /shipments/:id | Yes | Read/update/delete shipment |
| PATCH | /shipments/:id/update_status | Yes | Update shipment status |
| GET/POST | /leads | Mixed | List (auth) / Create (public) |
| DELETE | /leads/:id | Yes | Delete lead |
| DELETE | /leads/bulk_destroy | Yes | Bulk delete leads |
| PATCH | /leads/:id/mark_contacted | Yes | Mark lead contacted |
| GET/POST | /statuses | Yes* | List / Create status |
| PATCH/DELETE | /statuses/:id | Yes* | Update/delete status |
| PATCH | /statuses/reorder | Yes* | Reorder statuses |
| GET/POST | /templates | Yes* | List / Create template |
| GET/PATCH/DELETE | /templates/:id | Yes* | Read/update/delete template |
| POST | /templates/preview | Yes* | Preview with sample data |
| GET/POST | /showcases | Yes* | List / Create showcase |
| PATCH/DELETE | /showcases/:id | Yes* | Update/delete showcase |
| PATCH | /showcases/:id/toggle_active | Yes* | Toggle visibility |
| PATCH | /showcases/reorder | Yes* | Reorder showcase |
| GET/POST | /users | Yes* | List / Create user |
| PATCH/DELETE | /users/:id | Yes* | Update/delete user |
| GET | /track/:tracking_id | No | Public tracking |
| POST | /emails/status_update | Yes | Send status email |
| POST | /emails/thank_you | Yes | Send thank you email |
| POST | /emails/custom | Yes | Send custom email |

*Yes\* = Super Admin only*

## Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| DEVISE_JWT_SECRET | Yes | Secret for signing JWTs |
| FRONTEND_URL | Yes | Frontend origin for CORS |
| APP_URL | No | Used in email tracking links |
| RESEND_API_KEY | No | Resend API key for emails |
| EMAIL_FROM | No | Sender email address |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Yes | Backend API base URL |
