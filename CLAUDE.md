# CLAUDE.md

Context file for AI assistants working on the SHIFT By Joe codebase.

## Project Overview

Premium car import service (UAE to Egypt). Monorepo with React frontend and Rails API backend. Migrated from a Next.js app (legacy `webapp/` directory still present for reference).

## Monorepo Structure

```
shift/
├── frontend/          # React 19 + Vite + React Router + CSS Modules
├── backend/           # Rails 8 API-only + Devise JWT + PostgreSQL
├── webapp/            # Legacy Next.js app (reference only, being phased out)
├── docker-compose.yml # PostgreSQL 16 (root level, for both frontend/backend)
├── CLAUDE.md          # This file
└── README.md          # Developer setup guide
```

## Running the App

```bash
# Terminal 1: Database (if not already running)
docker compose up -d

# Terminal 2: Rails backend (port 3000)
cd backend && rails server -p 3000

# Terminal 3: React frontend (port 5173)
cd frontend && npm run dev
```

## Backend (Rails 8 API)

### Key Commands
```bash
cd backend
rails server -p 3000     # Start on port 3000
rails db:migrate          # Run migrations
rails db:seed             # Seed admin + statuses
rails console             # Interactive console
rails routes              # List all API routes
```

### Database
- PostgreSQL via Docker: `postgresql://root:mysecretpassword@localhost:5432/shift`
- NOTE: The existing Docker container uses password `mysecretpassword` (not `nopassword` as in docker-compose.yml). Check `config/database.yml` for current URL.
- String IDs on all models (SecureRandom.alphanumeric(25))

### Models (db/migrate/ + app/models/)
- **User** — Devise model with `role` enum (admin: 0, super_admin: 1). JTI-based JWT revocation. Has `name`, `email`, `encrypted_password`, `jti`.
- **Customer** — Optional, linked to shipments
- **Lead** — Contact form submissions. `document_status` is a string: "non-egyptian-passport", "uae-eqama", "none"
- **Shipment** — Core entity. `tracking_id` (auto-generated), `manufacturer`, `model`, `vin`, `year`, `color`, `pictures` (Postgres array), `owner_name`, `owner_email`, `owner_phone`, `notes`. Belongs to `current_status`, `created_by`, `customer`.
- **ShipmentStatus** — Ordered pipeline stages. `name`, `order`, `is_transit`, `notify_email`, `color`. Default scope orders by `order`.
- **ShipmentStatusHistory** — Audit log. Belongs to `shipment`, `status`, `changed_by`.
- **Template** — Document templates. `template_type` enum (contract: 0, bill: 1, email: 2). `content` with `{{placeholder}}` support.
- **CarShowcase** — Gallery items. `image`, `model`, `year`, `origin`, `order`, `is_active`.

### Seed Data
- Super Admin: `admin@shift.com` / `admin123` / role: super_admin
- 5 statuses: Ordered → In Saudi / Deba → Markeb to Safaga → Arriving Soon → Delivered

### Authentication (Custom JWT, NOT Devise controllers)
- Login: `POST /api/v1/auth/login` — Custom `SessionsController` (NOT Devise::SessionsController). Manually finds user, validates password, generates JWT via `Warden::JWTAuth::UserEncoder`.
- Logout: `DELETE /api/v1/auth/logout` — Decodes token, rotates user's JTI to revoke.
- Current user: `GET /api/v1/auth/me` — Returns current user from JWT.
- IMPORTANT: Devise's built-in session controller does NOT work in API-only mode (no session store). That's why we use a custom controller that bypasses `sign_in()`.
- JWT secret: `ENV["DEVISE_JWT_SECRET"]` or falls back to `credentials.secret_key_base`
- Token expiry: 30 days

### Controllers (app/controllers/api/v1/)
All inherit from `BaseController` which handles JWT auth via `authenticate_request!`.
- `SessionsController` — Login/logout (inherits from ActionController::API, NOT Devise)
- `MeController` — Current user endpoint
- `ShipmentsController` — CRUD + `update_status` (auto-sends email if status.notify_email)
- `LeadsController` — CRUD + `mark_contacted`/`mark_uncontacted` + `bulk_destroy`. `create` is public (skip auth).
- `StatusesController` — CRUD + `reorder`. Index is open to all auth'd users, mutations require super_admin.
- `TemplatesController` — CRUD + `preview`. All require super_admin.
- `ShowcasesController` — CRUD + `toggle_active` + `reorder`. All require super_admin.
- `UsersController` — CRUD. All require super_admin. Self-deletion and self-role-change prevented.
- `EmailsController` — `status_update`, `thank_you`, `custom`. All require auth.
- `DashboardController` — Stats + recent activity.
- `TrackingController` — Public (skip auth). Lookup by `tracking_id`.

### Serializers (app/serializers/, using Alba)
- ShipmentSerializer, ShipmentStatusSerializer, LeadSerializer, TemplateSerializer, CarShowcaseSerializer, UserSerializer, UserSummarySerializer, StatusHistorySerializer

### Rate Limiting
- Rack::Attack: 5 login attempts per IP per 15 minutes on `POST /api/v1/auth/login`

### Email
- Action Mailer + Resend SMTP (config/initializers/resend.rb)
- Templates in app/views/shipment_mailer/ (status_update.html.erb, thank_you.html.erb)
- Falls back to `:test` delivery if no RESEND_API_KEY

### CORS
- config/initializers/cors.rb allows `ENV["FRONTEND_URL"]` (default: http://localhost:5173)
- Exposes `Authorization` header for JWT

## Frontend (React + Vite)

### Key Commands
```bash
cd frontend
npm run dev              # Vite dev server on port 5173
npm run build            # Production build to dist/
```

### Architecture
- **Vite** for build/dev server
- **React Router v7** for routing (import from `react-router`, NOT `react-router-dom`)
- **CSS Modules** for component styling (NO Tailwind)
- **Axios** for API calls with JWT interceptor

### CRITICAL: Vite HMR Constraints
- **NEVER mix component exports and hook/function exports in the same file.** Vite's React Fast Refresh requires files to export ONLY components OR ONLY non-components. Mixing causes `hmr invalidate` → full page reload → flash/blank screen.
- Auth is split into 3 files because of this:
  - `hooks/AuthContext.tsx` — Context + types (no components, no hooks)
  - `hooks/AuthProvider.tsx` — Provider component (only components)
  - `hooks/useAuth.ts` — Hook (only function export)
- **NEVER put fetch() calls in React render bodies.** Always use `useEffect` or event handlers. Render-body fetch causes infinite re-render loops in StrictMode.

### API Client (src/api/)
- `client.ts` — Axios instance, base URL from `VITE_API_URL` (default: http://localhost:3000/api/v1). Request interceptor adds JWT from localStorage. Response interceptor clears localStorage on 401 but does NOT hard-redirect (React Router handles navigation).
- Per-resource files: `auth.ts`, `dashboard.ts`, `shipments.ts`, `leads.ts`, `statuses.ts`, `templates.ts`, `showcases.ts`, `users.ts`, `emails.ts`, `tracking.ts`

### Auth Flow
1. Login page calls `useAuth().login(email, password)` → `POST /api/v1/auth/login`
2. Token + user stored in localStorage
3. On page load: `AuthProvider` initializes user synchronously from localStorage (no loading flash)
4. Background `GET /api/v1/auth/me` validates token; if expired, user set to null → React Router redirects to login
5. `AdminLayout` checks `useAuth().user` — if null, renders `<Navigate to="/admin/login" />`
6. Logout calls `DELETE /api/v1/auth/logout` → clears localStorage → sets user to null

### Routing (src/App.tsx)
```
/                        → Home.tsx (public marketing page)
/track/:trackingId       → Track.tsx (public shipment tracking)
/admin/login             → Login.tsx (no layout wrapper)
/admin                   → AdminLayout → Dashboard.tsx
/admin/shipments         → AdminLayout → Shipments.tsx
/admin/shipments/new     → AdminLayout → ShipmentNew.tsx
/admin/shipments/:id     → AdminLayout → ShipmentDetail.tsx
/admin/shipments/:id/edit → AdminLayout → ShipmentEdit.tsx
/admin/leads             → AdminLayout → Leads.tsx
/admin/statuses          → AdminLayout → Statuses.tsx
/admin/templates         → AdminLayout → Templates.tsx
/admin/showcase          → AdminLayout → Showcase.tsx
/admin/users             → AdminLayout → Users.tsx
*                        → NotFound.tsx
```

### Components (src/components/)

**UI (public-facing):**
- `Button.tsx` — Variant: primary|secondary|ghost, Size: sm|md|lg, isLoading prop
- `Logo.tsx` — SVG brand mark. Variant: full|compact|icon, Color: yellow|black|cream
- `MobileNav.tsx` — Hamburger menu with portal overlay
- `ContactForm.tsx` — Lead capture form with phone input + document status radio

**Admin:**
- `AdminLayout.tsx` — Auth guard + sidebar + header + Outlet
- `AdminSidebar.tsx` — Navigation, role-aware (shows Super Admin section for super_admin)
- `AdminHeader.tsx` — Welcome text, user info, avatar, sign out button (uses useAuth().logout)
- `DataTable.tsx` — Generic sortable/searchable table
- `Modal.tsx` + `ConfirmModal` — Modal components
- `forms/` — Input, Select, Textarea, FileUpload, ShipmentForm

**Tracking:**
- `ShipmentCard.tsx` — Vehicle info with status badge
- `TrackingTimeline.tsx` — Visual status timeline

### Styling
- `src/styles/global.css` — Design system: @font-face declarations, CSS variables, base styles, animations, utility classes (.card, .text-gradient, .grain-overlay, .glow-yellow)
- `src/styles/components/*.module.css` — Per-component CSS Modules
- `src/styles/pages/*.module.css` — Per-page CSS Modules
- NO Tailwind — all custom CSS with `var(--shift-*)` design tokens

### Design System (CSS Variables)
```
--shift-yellow: #FFD628        (primary accent)
--shift-yellow-light: #FFE566
--shift-yellow-dark: #E6B800
--shift-black: #000000         (background)
--shift-black-soft: #0A0A0A
--shift-black-muted: #1A1A1A
--shift-cream: #FCFBE4         (text)
--shift-gray: #6B6B6B
--shift-gray-light: #9A9A9A
```

### Typography
- Obviously font (local .otf files in public/fonts/)
- `--font-heading: 'Obviously'` — headings, body, UI
- `--font-display: 'Obviously Wide'` — hero/display headings (weight 900)
- All headings uppercase by default

### Rails API Response Format (snake_case)
All API responses use snake_case field names:
- `owner_name`, `owner_email`, `owner_phone`
- `tracking_id`, `current_status`, `current_status_id`
- `created_at`, `updated_at`, `changed_at`
- `is_transit`, `notify_email`, `is_default`, `is_active`
- `document_status`, `template_type`
- User roles: `admin`, `super_admin` (lowercase)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://root:mysecretpassword@localhost:5432/shift
DEVISE_JWT_SECRET=generate-with-openssl-rand-base64-32
FRONTEND_URL=http://localhost:5173
APP_URL=http://localhost:5173
RESEND_API_KEY=           # optional, email disabled without
EMAIL_FROM=SHIFT By Joe <noreply@shiftbyjoe.com>
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api/v1
```

## Known Issues / Gotchas

1. **Vite HMR + mixed exports = page flash.** Never export a component and a hook from the same file. See "CRITICAL: Vite HMR Constraints" above.
2. **No fetch() in render bodies.** Causes infinite re-render loops under React StrictMode.
3. **Axios interceptor does NOT hard-redirect on 401.** It only clears localStorage. Navigation is handled by React Router via AdminLayout's auth guard.
4. **Devise session controller doesn't work in API-only Rails.** We use a custom SessionsController that manually authenticates and encodes JWT. Do NOT change it to inherit from Devise::SessionsController.
5. **Docker Postgres password mismatch.** docker-compose.yml says `nopassword` but the running container uses `mysecretpassword`. Check `backend/config/database.yml` for truth.
6. **Obviously font is a demo version.** Files are named "ObviouslyDemo-*". Need full license for production.

## What's Left / TODO
- Homepage showcase section still uses hardcoded car data (not connected to CarShowcase API)
- ContactForm simulates submission (not wired to createLead API)
- File upload (FileUpload component) has no actual upload implementation
- Some admin pages may need additional visual polish to fully match the original Next.js design
- Production deployment setup (Nginx, SSL, etc.)
- Remove legacy `webapp/` directory once migration is fully verified
