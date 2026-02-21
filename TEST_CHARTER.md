# SHIFT By Joe — Manual Test Charter

**Tester:** _______________
**Date:** _______________
**Environment:** `http://localhost:5173` (frontend) / `http://localhost:3000` (backend)
**Login:** `admin@shift.com` / `admin123`

---

## Prerequisites

Before testing, ensure all three services are running:

```bash
docker compose up -d          # PostgreSQL
cd backend && rails server -p 3000   # Rails API
cd frontend && npm run dev           # React frontend
```

---

## 1. PUBLIC — Homepage

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 1.1 | Page loads | Navigate to `http://localhost:5173` | Hero section, nav, all sections render without errors | |
| 1.2 | Navigation links | Click Services, Our Process, Showcase, Get Started | Smooth scroll to correct section | |
| 1.3 | Mobile nav | Resize to mobile width, tap hamburger | Menu opens with all links, closes on tap | |
| 1.4 | Showcase section | Check the Showcase section | Shows cars from the database (or empty if none active). No hardcoded placeholder data. | |
| 1.5 | Showcase images | Add a showcase car in admin with an image URL, then refresh homepage | Car appears with the actual image | |
| 1.6 | Contact form — validation | Submit the form empty | All 4 fields show validation errors | |
| 1.7 | Contact form — phone validation | Enter an invalid phone number, submit | "Please enter a valid phone number" error | |
| 1.8 | Contact form — success | Fill all fields correctly (name, valid phone, email, select document status), submit | Shows "Thank You!" success state. Check admin Leads page — new lead appears. | |
| 1.9 | Contact form — API error | Disconnect backend (kill Rails), try submitting | Error message appears (not a silent failure or blank success) | |
| 1.10 | Footer links | Click Quick Links and Contact section links | Navigate correctly | |

---

## 2. PUBLIC — Tracking Page

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 2.1 | Valid tracking ID | Get a tracking ID from admin, navigate to `/track/{trackingId}` | Shipment card + tracking timeline render correctly | |
| 2.2 | Invalid tracking ID | Navigate to `/track/nonexistent123` | "Shipment Not Found" error page with back link | |
| 2.3 | Shipment card data | Check the card content | Manufacturer, model, year, VIN, color, owner name all display correctly | |
| 2.4 | Status timeline | Check timeline matches shipment's status history | Completed statuses have yellow checkmarks, current has glow, future is dimmed | |
| 2.5 | Transit badge | If current status has `is_transit: true` | "In Transit" badge pulses next to the status name | |
| 2.6 | Timeline line alignment | Visual check | Yellow progress line is centered through the circles | |
| 2.7 | Responsive | Resize to mobile | Card stacks above timeline, still readable | |

---

## 3. AUTH — Login / Logout

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 3.1 | Login page | Navigate to `/admin/login` | Login form with email/password fields | |
| 3.2 | Invalid login | Enter wrong credentials, submit | "Invalid email or password" error | |
| 3.3 | Valid login | Enter `admin@shift.com` / `admin123` | Redirects to `/admin` dashboard | |
| 3.4 | Session persistence | Refresh the page after login | Still logged in (no flash to login page) | |
| 3.5 | Auth guard | While logged out, navigate to `/admin/shipments` | Redirected to login | |
| 3.6 | Logout | Click Sign Out in the header | Redirected to login page. Navigating to `/admin` redirects back to login. | |

---

## 4. ADMIN — Dashboard

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 4.1 | Stats load | Navigate to `/admin` | Shows shipment count, lead count, status count | |
| 4.2 | Recent shipments | Check Recent Shipments section | Shows up to 5 most recent shipments with status badges | |
| 4.3 | Recent leads | Check New Leads section | Shows up to 5 uncontacted leads | |
| 4.4 | Quick action | Click "New Shipment" card | Navigates to `/admin/shipments/new` | |
| 4.5 | Empty state | If no shipments/leads exist | Shows "No shipments yet" / "No new leads" messages | |

---

## 5. ADMIN — Shipments

### 5a. Shipment List

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 5a.1 | List loads | Navigate to `/admin/shipments` | Table shows all shipments with vehicle, owner, status, date | |
| 5a.2 | Search | Type a VIN or owner name in search | Table filters in real-time | |
| 5a.3 | Status filter | Select a status from the dropdown | Only shipments with that status appear | |
| 5a.4 | Row click | Click a shipment row | Navigates to shipment detail page | |
| 5a.5 | Delete | Click delete icon, confirm in modal | Shipment removed from list | |

### 5b. Create Shipment

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 5b.1 | Form loads | Navigate to `/admin/shipments/new` | Form with Vehicle Info, Vehicle Photos, Owner Info, Notes sections | |
| 5b.2 | Required fields | Submit with empty manufacturer/model/VIN/owner name | Error message from API | |
| 5b.3 | Duplicate VIN | Enter a VIN that already exists | "Vin has already been taken" error | |
| 5b.4 | Successful create | Fill all required fields, submit | Redirects to the new shipment's detail page | |
| 5b.5 | File upload | Click the upload zone, select an image | Image uploads, preview thumbnail appears. Can remove it. | |
| 5b.6 | Multiple uploads | Upload 2-3 images | All show as thumbnails in the preview grid | |

### 5c. Shipment Detail

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 5c.1 | Detail loads | Click into a shipment | Vehicle info, owner info, status history, sidebar all render | |
| 5c.2 | Update status | Click "Update Status", select a status, add optional notes, confirm | Status badge updates, new entry appears in status history | |
| 5c.3 | Tracking link | Copy the tracking link | Clipboard contains the correct `/track/` URL. "View tracking page" link opens it. | |
| 5c.4 | Edit | Click "Edit Shipment" | Form pre-filled with current data. Changes save correctly. | |
| 5c.5 | Back navigation | Click "Back to Shipments" | Returns to shipment list | |

### 5d. Documents & Emails (requires templates to be created first — see Section 9)

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 5d.1 | No templates state | View a shipment before creating any templates | "No templates created yet" message in Documents card | |
| 5d.2 | Generate Contract | Create a contract template, then click "Generate Contract" | Modal opens with template selected. Click "Download PDF" — PDF downloads with filename "Contract - {Owner Name}.pdf" | |
| 5d.3 | Generate Bill | Create a bill template, then click "Generate Bill" | PDF downloads with filename "Bill - {Owner Name}.pdf" | |
| 5d.4 | PDF content | Open the downloaded PDF | Placeholders like `{{ownerName}}`, `{{manufacturer}}` are replaced with actual shipment data | |
| 5d.5 | Send Email | Create an email template, then click "Send Email" | Modal shows email template selector + optional PDF attachments checkboxes | |
| 5d.6 | Send Email with attachment | Select email template, check a contract PDF attachment, send | Success banner appears. (Email delivery depends on Resend API key config.) | |
| 5d.7 | No owner email | View a shipment with no owner email | "Send Email" button should not appear | |

---

## 6. ADMIN — Leads

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 6.1 | List loads | Navigate to `/admin/leads` | Table with all leads showing contact info, document status, date | |
| 6.2 | Filter tabs | Click "Pending" tab | Shows only uncontacted leads | |
| 6.3 | Filter tabs | Click "Contacted" tab | Shows only contacted leads | |
| 6.4 | Mark contacted | Click "Mark Contacted" on a pending lead | Button changes to "Contacted" (green). Lead moves to Contacted filter. | |
| 6.5 | Mark uncontacted | Click "Contacted" on a contacted lead | Reverts to pending state | |
| 6.6 | Delete single | Click delete on a lead, confirm | Lead removed from list | |
| 6.7 | Bulk select | Check multiple leads using checkboxes | "Delete X Selected" button appears | |
| 6.8 | Bulk delete | Click "Delete X Selected", confirm | All selected leads removed | |
| 6.9 | Select all | Click header checkbox | All visible leads selected | |
| 6.10 | Document status badge | Check badges | "Non-Egyptian Passport" (blue), "UAE Eqama" (green), "None" (gray) | |

---

## 7. ADMIN — Statuses

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 7.1 | List loads | Navigate to `/admin/statuses` | Ordered list of statuses with badges for Transit/Email | |
| 7.2 | Create status | Click "Add Status", fill name, toggle Transit/Email, save | New status appears at the end of the list | |
| 7.3 | Edit status | Click edit on a status, change the name, save | Name updates in the list | |
| 7.4 | Reorder | Click up/down arrows | Status moves position. Refresh page — order persists. | |
| 7.5 | Delete unused | Delete a status not assigned to any shipment | Status removed | |
| 7.6 | Delete in-use | Delete a status assigned to a shipment | Error: "Cannot delete: X shipment(s) are using this status" | |

---

## 8. ADMIN — Showcase

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 8.1 | List loads | Navigate to `/admin/showcase` | Grid of showcase cars with images | |
| 8.2 | Add car | Click "Add Car", fill image URL + model + year + origin, save | Car appears in grid. Image preview shows in the modal. | |
| 8.3 | Edit car | Click edit, change model name, save | Name updates | |
| 8.4 | Toggle active | Click "Active" button on a car | Toggles to hidden state with "Hidden" badge and opacity change | |
| 8.5 | Reorder | Use up/down arrows | Cars reorder. Refresh — order persists. | |
| 8.6 | Homepage sync | Set a car to active, check homepage | Car appears in the Showcase section. Set to inactive — disappears. | |
| 8.7 | Delete | Delete a car, confirm | Removed from grid | |

---

## 9. ADMIN — Templates

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 9.1 | List loads | Navigate to `/admin/templates` | Templates grouped by type (Contract, Bill, Email) | |
| 9.2 | Create email template | Click "Add Template", select type Email, add name and content with placeholders like `Hello {{ownerName}}`, save | Template appears under Email group | |
| 9.3 | Create contract template | Same as above but type Contract | Appears under Contract group | |
| 9.4 | Create bill template | Same but type Bill | Appears under Bill group | |
| 9.5 | Preview | Edit a template, click Preview tab | Placeholders replaced with sample data (Ahmed Hassan, Toyota Land Cruiser, etc.) | |
| 9.6 | Set as default | Check "Set as Default" on a template, save | "Default" badge appears. Only one default per type. | |
| 9.7 | Insert placeholder | Click a placeholder button (e.g., `{{ownerName}}`) | Placeholder text inserted into the content field | |
| 9.8 | Edit | Edit name/content of existing template | Changes persist after save | |
| 9.9 | Delete | Delete a template | Removed from list | |

---

## 10. ADMIN — Users (Super Admin only)

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 10.1 | List loads | Navigate to `/admin/users` | List of users with role badges and "You" indicator | |
| 10.2 | Create user | Click "Add User", fill name/email/password/role, save | New user appears in list | |
| 10.3 | Duplicate email | Create user with an existing email | "A user with this email already exists" error | |
| 10.4 | Edit user | Click edit, change name, save | Name updates | |
| 10.5 | Change password | Edit user, enter new password, save | User can log in with new password | |
| 10.6 | Cannot change own role | Edit your own user, try to change role | Role dropdown is disabled with helper text | |
| 10.7 | Cannot delete self | Try to delete your own account | Delete button is disabled | |
| 10.8 | Delete other user | Delete another user (with no associated data) | User removed | |

---

## 11. CROSS-CUTTING

| # | Test | Steps | Expected | Pass? |
|---|------|-------|----------|-------|
| 11.1 | 404 page | Navigate to `/nonexistent` | Custom 404 page with SHIFT branding and "Back to Home" link | |
| 11.2 | API error display | All admin forms should show specific API error messages, not generic "An unexpected error occurred" | Trigger a validation error (e.g., duplicate VIN) | |
| 11.3 | Token expiry | Wait 30+ days (or manually clear `jwt_token` from localStorage) | Redirected to login on next navigation | |
| 11.4 | Responsive admin | Resize admin to tablet/mobile widths | Sidebar collapses, tables scroll horizontally, forms stack vertically | |
| 11.5 | Browser back/forward | Navigate through several admin pages, use browser back/forward | Navigation works correctly without errors | |

---

## Test Notes

_Use this space for any bugs, observations, or follow-ups:_

```
-
-
-
```
