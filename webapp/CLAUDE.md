# CLAUDE.md

This file provides guidance to AI assistants when working with code in this repository.

## Project Overview

**SHIFT By Joe** is a full-stack Next.js application for a premium car import service (UAE to Egypt). It includes:
- A public marketing homepage with sections for services, trip ticket process, car showcase, and a contact form
- A public shipment tracking page (`/track/[trackingId]`)
- A full admin dashboard for managing shipments, leads, users, statuses, templates, and showcase cars
- Email notifications via Resend for shipment status updates
- PDF generation support for contracts and bills via `@react-pdf/renderer`

## Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checks
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database (tsx prisma/seed.ts)
npm run db:studio    # Open Prisma Studio
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2.3 with TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design system in `globals.css`
- **Database**: PostgreSQL with Prisma ORM 7.4 (using `@prisma/adapter-pg`)
- **Auth**: NextAuth v5 (beta 30) with credentials provider (JWT strategy)
- **Email**: Resend SDK for transactional emails
- **PDF**: `@react-pdf/renderer` for contract/bill generation
- **Validation**: Zod v4 for all form/action validation
- **Phone Input**: `react-phone-number-input` for international phone fields

## Project Structure

```
webapp/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script (admin user + default statuses)
├── prisma.config.ts           # Prisma configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Obviously font family loaded)
│   │   ├── page.tsx           # Public homepage (592 lines, all sections)
│   │   ├── globals.css        # Design system (CSS variables, utilities, animations)
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin layout (sidebar + header when authenticated)
│   │   │   ├── page.tsx       # Dashboard (stats, recent shipments, recent leads)
│   │   │   ├── login/page.tsx # Login page (credentials auth)
│   │   │   ├── shipments/     # CRUD for shipments
│   │   │   ├── leads/         # Lead management (contact form submissions)
│   │   │   ├── statuses/      # Shipment status management (SUPER_ADMIN)
│   │   │   ├── templates/     # Contract/bill/email templates (SUPER_ADMIN)
│   │   │   ├── showcase/      # Car showcase gallery management (SUPER_ADMIN)
│   │   │   └── users/         # User management (SUPER_ADMIN)
│   │   ├── track/
│   │   │   └── [trackingId]/  # Public tracking page + not-found
│   │   └── api/auth/          # NextAuth API route
│   ├── actions/               # Server actions (7 files)
│   │   ├── email.ts           # Send status update, thank you, custom emails
│   │   ├── leads.ts           # Create lead (public), mark contacted, delete
│   │   ├── shipments.ts       # CRUD shipments, update status (with auto-email)
│   │   ├── statuses.ts        # CRUD statuses, reorder (SUPER_ADMIN)
│   │   ├── templates.ts       # CRUD templates, preview with sample data (SUPER_ADMIN)
│   │   ├── showcase.ts        # CRUD showcase cars, toggle active, reorder (SUPER_ADMIN)
│   │   └── users.ts           # CRUD users with password hashing (SUPER_ADMIN)
│   ├── components/
│   │   ├── ui/                # Public-facing components
│   │   │   ├── Button.tsx     # Variant: primary|secondary|ghost, Size: sm|md|lg
│   │   │   ├── Logo.tsx       # SVG logo, Variant: full|compact|icon, Color: yellow|black|cream
│   │   │   ├── MobileNav.tsx  # Hamburger menu with portal overlay
│   │   │   └── ContactForm.tsx # Lead capture form with phone input + document status
│   │   ├── admin/             # Admin dashboard components
│   │   │   ├── AdminSidebar.tsx   # Navigation sidebar (role-aware)
│   │   │   ├── AdminHeader.tsx    # Top header with user info + sign out
│   │   │   ├── DataTable.tsx      # Generic sortable/searchable table component
│   │   │   ├── Modal.tsx          # Modal + ConfirmModal components
│   │   │   └── forms/             # Form components (Input, Select, Textarea, FileUpload, ShipmentForm)
│   │   └── tracking/          # Tracking page components
│   │       ├── ShipmentCard.tsx       # Vehicle info card with status badge
│   │       └── TrackingTimeline.tsx   # Visual timeline with progress indicator
│   └── lib/
│       ├── auth.ts            # NextAuth config (credentials, JWT callbacks)
│       ├── auth-utils.ts      # Server-side auth helpers (requireAuth, requireRole, requireSuperAdmin)
│       ├── email.ts           # Resend client + HTML email templates (status update, thank you)
│       ├── pdf.ts             # Placeholder system + default contract/bill templates
│       ├── prisma.ts          # Prisma client singleton with PrismaPg adapter
│       └── validations/
│           └── shipment.ts    # All Zod schemas + types (shipment, status, lead, template, user, showcase)
└── public/
    └── fonts/                 # Obviously font family (multiple weights/styles)
```

## Database Schema (Prisma)

### Models
- **User** - Admin users with `ADMIN` or `SUPER_ADMIN` roles, bcrypt passwords
- **Customer** - Optional customer records linked to shipments
- **Lead** - Contact form submissions (name, email, phone, documentStatus, contacted flag)
- **Shipment** - Core entity: car details (manufacturer, model, VIN, year, color, pictures), owner info, current status, notes, tracking ID
- **ShipmentStatus** - Configurable statuses with order, isTransit flag, notifyEmail flag, color
- **ShipmentStatusHistory** - Audit trail of status changes with timestamp and user
- **Template** - Document templates (CONTRACT, BILL, EMAIL types) with placeholder support
- **CarShowcase** - Frontend gallery items (image, model, year, origin, order, isActive)

### Default Seed Data
- Super Admin: `admin@shift.com` / `admin123`
- Statuses: Ordered → In Saudi / Deba → Markeb to Safaga → Arriving Soon → Delivered

## Authentication & Authorization

- **Auth**: NextAuth v5 with credentials provider, JWT session strategy
- **Login page**: `/admin/login`
- **Two roles**: `ADMIN` (basic access) and `SUPER_ADMIN` (full access)
- **ADMIN can**: View dashboard, manage shipments, manage leads
- **SUPER_ADMIN can**: All of above + manage statuses, templates, showcase, users
- **Server-side guards**: `requireAuth()`, `requireRole()`, `requireSuperAdmin()` in `lib/auth-utils.ts`
- **Action-level guards**: Each server action checks auth independently
- **Session shape**: `{ user: { id, email, name, role } }`

## Design System

### Brand Colors (CSS Variables)
- `--shift-yellow: #FFD628` (primary accent)
- `--shift-yellow-light: #FFE566`
- `--shift-yellow-dark: #E6B800`
- `--shift-black: #000000` (background)
- `--shift-black-soft: #0A0A0A`
- `--shift-black-muted: #1A1A1A`
- `--shift-cream: #FCFBE4` (text)
- `--shift-gray: #6B6B6B`
- `--shift-gray-light: #9A9A9A`

### Typography
- **Headings**: Obviously font (custom local font, `--font-obviously`)
- **Display headings** (h1): Obviously Wide (`--font-obviously-wide`), weight 900
- **Body**: Obviously font
- **Accent** (`.font-accent`): italic, normal case — used for "By Joe" branding
- All headings are uppercase by default via CSS

### Utility Classes (globals.css)
- `.text-gradient` — Yellow gradient text effect
- `.grain-overlay` — SVG noise texture overlay (very subtle, 3% opacity)
- `.glow-yellow` — Yellow box-shadow glow
- `.card` — Dark card with border, hover glow effect
- `.btn`, `.btn-primary`, `.btn-secondary` — Button styles
- `.racing-lines` — Brand signature racing line effect
- `.animate-fade-in`, `.animate-slide-up`, `.animate-slide-right`, `.animate-pulse-glow` — Animations
- `.phone-input-container` — Phone input styling for `react-phone-number-input`

### Tailwind Theme Integration
Colors are exposed to Tailwind via `@theme inline` block in globals.css, enabling usage like `bg-shift-yellow`, `text-shift-cream`, etc.

## Key Patterns

### Server Actions
- All mutations use Next.js server actions in `src/actions/`
- Consistent return type: `ActionResult<T> = { success: true; data: T } | { success: false; error: string }`
- Validation via Zod schemas before database operations
- `revalidatePath()` called after mutations for cache invalidation

### Admin Pages Pattern
Each admin section follows a consistent pattern:
1. **`page.tsx`** (server component): Fetches data, checks auth, renders the manager component
2. **Manager component** (client component): Full CRUD UI with modals, forms, and server action calls

### Shipment Status Flow
- Statuses are ordered and displayed as a timeline on the tracking page
- When status is updated, a `ShipmentStatusHistory` record is created
- If the status has `notifyEmail: true` and the shipment has an owner email, a status update email is sent automatically

### Template Placeholder System
Templates support placeholders like `{{ownerName}}`, `{{manufacturer}}`, `{{model}}`, `{{vin}}`, `{{year}}`, `{{color}}`, `{{trackingUrl}}`, `{{date}}`, `{{trackingId}}`. Preview uses sample data.

### Email System
- Lazy-loaded Resend client (won't crash if no API key)
- HTML email templates with SHIFT branding (dark theme, yellow accents)
- Two built-in templates: status update + thank you

## Component API Quick Reference

### UI Components
```tsx
<Button variant="primary|secondary|ghost" size="sm|md|lg" isLoading={boolean} />
<Logo variant="full|compact|icon" color="yellow|black|cream" className={string} />
<MobileNav />
<ContactForm />
```

### Admin Components
```tsx
<AdminSidebar user={{ role: UserRole }} />
<AdminHeader user={{ name, email, role }} />
<DataTable data={T[]} columns={Column[]} searchable searchKeys actions rowHref emptyMessage />
<Modal isOpen onClose title size="sm|md|lg|xl" footer>{children}</Modal>
<ConfirmModal isOpen onClose onConfirm title message variant="danger|warning|default" loading />
<Input label error helperText {...inputProps} />
<Select label error options={[{value, label}]} placeholder {...selectProps} />
<Textarea label error helperText {...textareaProps} />
<FileUpload label value onChange onUpload accept multiple maxFiles />
<ShipmentForm shipment? statuses={ShipmentStatus[]} />
```

### Tracking Components
```tsx
<ShipmentCard shipment={...} currentStatus={ShipmentStatus | null} />
<TrackingTimeline statuses={ShipmentStatus[]} currentStatus={ShipmentStatus | null} history={HistoryWithStatus[]} />
```

## Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — NextAuth JWT secret
- `NEXTAUTH_URL` — App URL for NextAuth
- `RESEND_API_KEY` — Resend API key (optional, email disabled without it)
- `EMAIL_FROM` — Sender email (default: `SHIFT By Joe <noreply@shiftbyjoe.com>`)
- `NEXT_PUBLIC_APP_URL` — Public app URL for tracking links

## Homepage Sections (page.tsx)
1. **Navigation** — Fixed top nav with logo, links (Services, Trip Ticket, Showcase, Contact), CTA button, mobile hamburger
2. **Hero** — Full-screen with gradient background, yellow glow accents, animated entrance, dual CTA buttons
3. **Services** — 2-column grid: Egypt Import + UAE Sourcing cards
4. **Trip Ticket** — 2-column layout: 4-step process explanation + trip ticket mockup card with progress bar
5. **Showcase** — 3-column grid of car cards with image placeholders, overlay info, "Delivered" badges (currently hardcoded, not yet connected to CarShowcase DB model)
6. **Contact** — 2-column: contact info (phone, location) + ContactForm component
7. **CTA** — Final call-to-action with pulsing glow button
8. **Footer** — 4-column: logo/description, quick links, contact info

## Notes
- The homepage showcase section uses hardcoded car data, not yet connected to the `CarShowcase` database model
- The ContactForm simulates submission (`setTimeout`) — not yet wired to the `createLead` server action
- File upload (`FileUpload` component) has `onUpload` prop but no upload implementation yet (TODO in ShipmentForm)
- Images in next.config.ts have `unoptimized: true` for compatibility
- The `CLAUDE.md` note about "static export mode" is outdated — the app now uses server-side features (API routes, server actions, Prisma)
