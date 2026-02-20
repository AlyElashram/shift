# SHIFT By Joe — Webapp

Full-stack Next.js application for a premium car import service (UAE to Egypt). Includes a public marketing site, shipment tracking, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Database | PostgreSQL |
| ORM | Prisma 7 (with `@prisma/adapter-pg`) |
| Auth | NextAuth v5 (credentials + JWT) |
| Email | Resend |
| PDF | @react-pdf/renderer |
| Validation | Zod 4 |

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use Docker — see below)

## Quick Start

### 1. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL on port `5432` with:
- **User:** `root`
- **Password:** `nopassword`
- **Database:** `shift`

To stop/destroy:

```bash
docker compose down        # keep data
docker compose down -v     # destroy data volumes too
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below).

### 4. Set up the database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed default admin + statuses
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://root:nopassword@localhost:5432/shift` |
| `NEXTAUTH_SECRET` | Yes | Random secret for signing JWTs. Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | App URL, e.g. `http://localhost:3000` |
| `RESEND_API_KEY` | No | Resend API key for sending emails. Email features are disabled without it. |
| `EMAIL_FROM` | No | Sender address. Defaults to `SHIFT By Joe <noreply@shiftbyjoe.com>` |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL for tracking links in emails. Defaults to `http://localhost:3000` |

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB (no migration history) |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with default data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Public homepage (marketing)
│   ├── globals.css                 # Design system (CSS variables, animations)
│   ├── layout.tsx                  # Root layout (Obviously font)
│   ├── admin/
│   │   ├── layout.tsx              # Admin shell (sidebar + header)
│   │   ├── page.tsx                # Dashboard (stats, recent activity)
│   │   ├── login/page.tsx          # Login page
│   │   ├── shipments/              # Shipment CRUD
│   │   ├── leads/                  # Lead management
│   │   ├── statuses/               # Status config (SUPER_ADMIN)
│   │   ├── templates/              # Doc templates (SUPER_ADMIN)
│   │   ├── showcase/               # Car gallery (SUPER_ADMIN)
│   │   └── users/                  # User management (SUPER_ADMIN)
│   ├── track/[trackingId]/         # Public shipment tracking
│   └── api/auth/                   # NextAuth + rate-limited login
├── actions/                        # Server actions (all mutations)
│   ├── shipments.ts                # Shipment CRUD + status updates
│   ├── leads.ts                    # Lead CRUD (createLead is public)
│   ├── statuses.ts                 # Status CRUD + reorder
│   ├── templates.ts                # Template CRUD + preview
│   ├── showcase.ts                 # Showcase car CRUD + reorder
│   ├── users.ts                    # User CRUD + password hashing
│   └── email.ts                    # Email sending actions
├── components/
│   ├── ui/                         # Public components (Button, Logo, MobileNav, ContactForm)
│   ├── admin/                      # Admin components (DataTable, Modal, forms)
│   └── tracking/                   # Tracking components (ShipmentCard, TrackingTimeline)
├── lib/
│   ├── auth.ts                     # NextAuth config
│   ├── auth-utils.ts               # Server-side auth guards
│   ├── rate-limit.ts               # In-memory login rate limiter
│   ├── prisma.ts                   # Prisma client singleton
│   ├── email.ts                    # Resend client + email templates
│   ├── pdf.ts                      # Placeholder system + default templates
│   └── validations/shipment.ts     # All Zod schemas
└── fonts/                          # Obviously font files
```

## Authentication & Authorization

### Roles

| Role | Access |
|------|--------|
| `ADMIN` | Dashboard, shipments, leads |
| `SUPER_ADMIN` | Everything above + statuses, templates, showcase, users |

### Default Credentials (from seed)

- **Email:** `admin@shift.com`
- **Password:** `admin123`
- **Role:** `SUPER_ADMIN`

> **Change this immediately in production.**

### Rate Limiting

The login endpoint is protected by an in-memory rate limiter:
- **5 failed attempts** per IP triggers a **15-minute lockout**
- Lockout clears automatically after the window expires
- Successful login resets the counter

### JWT Sessions

Sessions use signed JWTs (not database sessions). Tokens are signed with `NEXTAUTH_SECRET` and contain user ID + role. Default expiry is 30 days.

## Database Schema

Key models:

- **User** — Admin users (email, hashed password, role)
- **Shipment** — Cars being imported (vehicle details, owner info, status, tracking ID)
- **ShipmentStatus** — Configurable pipeline stages (ordered, in transit, delivered, etc.)
- **ShipmentStatusHistory** — Audit log of all status changes
- **Lead** — Contact form submissions
- **Template** — Document templates with `{{placeholder}}` support (CONTRACT, BILL, EMAIL)
- **CarShowcase** — Gallery items for the public homepage
- **Customer** — Optional customer records linked to shipments

See `prisma/schema.prisma` for the full schema.

## Design System

Brand colors are defined as CSS variables in `globals.css`:

| Variable | Value | Usage |
|----------|-------|-------|
| `--shift-yellow` | `#FFD628` | Primary accent |
| `--shift-black` | `#000000` | Background |
| `--shift-cream` | `#FCFBE4` | Text |
| `--shift-gray` | `#6B6B6B` | Secondary text |

Typography uses the **Obviously** font family (local files in `src/fonts/`):
- **Obviously** — Headings and body (multiple weights)
- **Obviously Wide** — Hero/display headings (bold + black weights)

Utility classes: `.card`, `.text-gradient`, `.grain-overlay`, `.glow-yellow`, `.animate-fade-in`, `.animate-slide-up`, `.animate-pulse-glow`

## Security Notes

- All passwords hashed with bcrypt (cost factor 12)
- All database queries via Prisma (parameterized — no SQL injection)
- All inputs validated with Zod before hitting the database
- Server actions check auth independently (not relying on middleware alone)
- Login rate limiting: 5 attempts per IP, 15-minute lockout
- Generic error messages on login (no user enumeration)

## Deployment

### Vercel

The app is ready for Vercel deployment. Set all environment variables in the Vercel dashboard. The database must be an external PostgreSQL instance (e.g., Neon, Supabase, Railway).

### Post-Deploy Checklist

1. Change the default admin password
2. Set a strong `NEXTAUTH_SECRET`
3. Configure `RESEND_API_KEY` if you want email notifications
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
