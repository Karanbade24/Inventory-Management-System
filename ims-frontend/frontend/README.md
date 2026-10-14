# IMS Frontend — Inventory Management System

A React (Vite) single-page app for User Story 03: entering material purchases
from vendors and generating a vendor-wise purchase report for a date range.
Layout is a sidebar dashboard (Dashboard / Purchase Entry / Purchase Report),
matching the approved application prototype.

## Pages

- **Login** (`/login`) — hardcoded client-side credentials only (`admin` /
  `admin123`) — there's no auth microservice in this project, so this is a
  gate, not real authentication. Every other route redirects here if you're
  not "logged in" (session persists in `localStorage` until you log out).

- **Dashboard** (`/`) — landing page with a hero banner and four cards
  (Vendors, Materials, Purchase Entry, Purchase Reports) linking into the
  rest of the app.
- **Vendors** (`/vendors`) — read-only table of vendor records from the
  vendor microservice (via the backend's `/vendors` endpoint).
- **Materials** (`/materials`) — Material Categories table plus a Material
  Types table with a "Filter by Category" dropdown. There's no single
  "all types" endpoint on the backend, so this page fetches the category
  list, fans out one `getUnitAndTypeList` call per category, and merges the
  results client-side.
- **Purchase Entry** (`/purchase`) — the purchase order form. Vendor and
  material category lists are loaded from the backend; choosing a category
  loads the matching unit and material-type lists. Client-side validation
  covers mandatory fields, numeric/format checks (whole-number quantity,
  2-decimal amount, past purchase date), inline error messages, submit
  blocking, and green/red visual feedback per field — mirroring the
  `@NotBlank` / `@NotNull` / `@Past` constraints on `PurchaseBean`.
- **Confirmation** (`/purchase-success`) — shown after a successful save,
  with the generated transaction ID and a summary of what was recorded.
- **Purchase Report** (`/reports`) — pick a vendor and a date range to list
  every purchase recorded against them, with the vendor's address/contact
  details and a record count shown above the results table.

## Deployment model

Two ways to run this, same codebase — only ports differ.

**A. Local standalone dev (default)** — each service is its own embedded
Spring Boot app:

| App | Port | Full base URL |
|---|---|---|
| Vendor service | 8087 | `http://localhost:8087/vendor` |
| Material service | 8088 | `http://localhost:8088/material` |
| IMS backend (this project) | 8089 | `http://localhost:8089` |
| Frontend (this app) | 3001 | `http://localhost:3001` |

**B. Jenkins/Tomcat pipeline** — all three deployed as WARs to one shared
Tomcat on port 8081, routed by context path:

| App | WAR | Context path | Full base URL |
|---|---|---|---|
| Vendor service | `vendor.war` | `/vendor` | `http://localhost:8081/vendor` |
| Material service | `material.war` | `/material` | `http://localhost:8081/material` |
| IMS backend | `inventory.war` | `/inventory` | `http://localhost:8081/inventory` |

When deployed as a WAR, `server.port` in `application.properties` is ignored —
Tomcat owns the port, and the context path comes from the WAR's `finalName`
in `pom.xml`. Switch between the two modes by changing the consumer URLs in
`application.properties` (mode A values are the current defaults) and the
frontend's `VITE_API_BASE_URL`.

## Running locally

The backend (`PurchaseEntryController` / `ReportsController`) is annotated
with `@CrossOrigin(origins = "http://localhost:3001")`, so the dev server is
pinned to port 3001 (port 3000 is reserved for Gitea on this machine).

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:3001
```

For mode A, start the three backend apps on their own ports (8087, 8088,
8089) before using the frontend — it calls `http://localhost:8089` by
default. For mode B, set `VITE_API_BASE_URL=http://localhost:8081/inventory`
(e.g. in `frontend/.env.local`) and confirm all three WARs show `true` under
"Running" in the Tomcat Manager.

To point the frontend at a different backend URL, set `VITE_API_BASE_URL`
(e.g. in a `.env.local` file) before running `npm run dev` or `npm run build`.

## Production build

```bash
npm run build      # outputs to frontend/dist
npm run preview    # serve the production build locally
```
