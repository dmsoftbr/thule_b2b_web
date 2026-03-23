# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thule B2B — a business-to-business web portal for order management, product catalogs, customer registrations, reports, and mobile communications. Built for sales representatives and administrators.

## Commands

- `npm run dev` — start dev server (HTTPS on localhost:3000, requires SSL certs in `ssl/`)
- `npm run build` — type-check with `tsc -b` then Vite build
- `npm run lint` — ESLint
- `npm run preview` — preview production build

No test runner is configured.

## Tech Stack

- **React 19** + **TypeScript 5.8** + **Vite 7** (base path: `/b2b/`)
- **TanStack Router** — file-based routing in `src/pages/`, route tree auto-generated to `src/route-tree.gen.ts`. Routes directory token is `layout` (not `route`).
- **TanStack React Query** — server state / data fetching
- **TanStack React Table** — data grids
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin) + **shadcn/ui** components (Radix primitives in `src/components/ui/`)
- **Zustand** — client state management
- **React Hook Form** + **Zod v4** — form handling and validation
- **Axios** — HTTP client (configured in `src/lib/api.ts`)
- **nuqs** — URL query state management
- **date-fns** — date utilities
- **Recharts** — dashboard charts
- **@react-pdf/renderer** — PDF generation
- **Sonner** — toast notifications

## Architecture

### Routing (`src/pages/`)

File-based routing via TanStack Router. The `_app/` prefix is a layout route that wraps authenticated pages with sidebar + header. Auth pages live under `auth/`. Dynamic segments use `$param` syntax (e.g., `$orderId/`). Co-located route helpers use `-` prefix directories (`-components/`, `-context/`, `-utils/`).

### API Layer

- `src/lib/api.ts` — Axios instance with JWT Bearer auth, automatic token refresh via interceptor, and `waftoken` header. API base URL comes from `window.__APP_CONFIG__.API_URL`.
- `src/services/` — Static service classes organized by domain (e.g., `OrdersService`, `ProductsService`). Each class has a `basePath` and uses the shared `api` instance. Pattern: `ServiceName.method()` returning typed promises.

### Authentication

`src/contexts/auth-context.tsx` — React context providing `session`, `login`, `logout`, `isAuthenticated`. Session persisted in `localStorage` as `b2b@session`. An event bus (`src/lib/event-bus.ts`) synchronizes token refresh between the Axios interceptor and the Auth context.

### Models (`src/models/`)

TypeScript interfaces organized by domain. DTOs for API requests/responses live in `src/models/dto/`. Key shared models: `PagedRequestModel`, `PagedResponseModel<T>`.

### Components

- `src/components/ui/` — shadcn/ui primitives (button, dialog, data-grid, etc.)
- `src/components/form/` — form field wrappers for React Hook Form (`form-input.tsx`, `form-select.tsx`, `form-search-combo.tsx`, etc.)
- `src/components/server-table/` — server-side paginated table component that posts to API list-paged endpoints
- `src/components/app/` — shared app-level components (combos for customers, products, payment conditions)
- `src/components/layout/` — sidebar, header, tooltip

### Path Alias

`@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

### Form Actions Pattern

Pages use `FORM_ACTIONS` type (`"ADD" | "EDIT" | "VIEW"`) from `src/@types/form-actions.ts` to control form mode.

## Language

Code comments and some UI text are in Portuguese (Brazilian). The codebase is a mix of English (code identifiers, component names) and Portuguese (comments, labels, some file names in reports like `faturamento-cliente`).
