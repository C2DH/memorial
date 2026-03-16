# AGENTS.md – Developer & AI Agent Guide

This file describes the codebase architecture, key conventions, and workflows for developers and AI coding agents working on the **Memorial de la Deportation** React application.

---

## Project Overview

**Memorial de la Deportation** is a React 18 + Vite single-page application that presents the biographies and archival documents of deportation victims. It is maintained by the [Centre for Contemporary and Digital History (C²DH)](https://www.c2dh.uni.lu/) at the University of Luxembourg.

The front end connects to a **Miller** CMS backend through a set of REST API endpoints. The build output is a static bundle served behind an HTTP server (or Netlify / Docker).

---

## Repository Layout

```
memorial/
├── src/
│   ├── App.jsx              # Root component, router setup
│   ├── index.jsx            # React entry point, global initialisation
│   ├── store.js             # Global Zustand state
│   ├── constants.js         # App-wide constants
│   ├── translations.json    # i18n strings (en / fr / de)
│   ├── components/          # Reusable UI components
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   │   ├── data.js          # useGetJSON – main data-fetching hook
│   │   ├── timeout.js       # useTimeout
│   │   ├── language.js      # useCurrentLanguage
│   │   └── usePagefind.ts   # Full-text search hook (TypeScript)
│   ├── logic/               # Pure utility functions (no JSX)
│   ├── styles/              # Global CSS
│   └── data/                # Static JSON data (authors, biographies)
├── public/                  # Static assets (images, icons)
├── index.html               # Vite HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration (strict mode)
├── tsconfig.node.json       # TypeScript config for Vite config file
├── .env                     # Default environment variables
├── Dockerfile               # Multi-stage production Docker build
├── Makefile                 # Local build shortcuts
├── netlify.toml             # Netlify redirect / proxy rules
└── .github/workflows/       # GitHub Actions CI/CD
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Bundler | Vite 4 |
| Language | JavaScript (JSX) + TypeScript (ongoing migration) |
| Routing | React Router 6 |
| State | Zustand 4 |
| Data fetching | TanStack React Query 5 + Axios 0.27 |
| Styling | Bootstrap 5 + custom CSS |
| Animation | Framer Motion 10 |
| 3D | Three.js + React Three Fiber + Drei |
| Maps | Mapbox GL + react-map-gl |
| i18n | react-i18next |
| Full-text search | Pagefind (static index served by backend) |
| Analytics | Matomo |
| CAPTCHA | Cloudflare Turnstile |

---

## Data Fetching

### `useGetJSON` hook (`src/hooks/data.js`)

All read requests go through `useGetJSON`, which wraps Axios inside TanStack React Query:

```js
import { useGetJSON } from './hooks/data'

const { data, status, error } = useGetJSON({
  url: '/api/story',
  params: { limit: 10, offset: 0 },
  // optional:
  delay: 500,            // ms before the query is enabled (for debouncing)
  timeout: 30000,        // Axios timeout in ms (defaults to VITE_API_TIMEOUT)
  enabled: true,         // pass false to defer the fetch
  memoid: 'unique-key',  // extra cache key discriminator
})
```

The hook automatically handles:
- Request deduplication and caching via React Query
- Optional delayed activation (useful for debouncing search inputs)
- Download-progress callbacks (`onDownloadProgress`)

For **infinite scroll / paginated** endpoints (e.g. `Search.jsx`), use TanStack React Query's `useInfiniteQuery` directly with Axios.

### Direct Axios calls

A few places bypass `useGetJSON` and call Axios directly:
- `src/index.jsx` – initial boot request (`/api/pebbles/extent-z`)
- `src/pages/Search.jsx` – infinite query
- `src/components/Hero/store.js` – hero pebble data
- `src/components/Hero/ui/ModalCreateNew.jsx` – POST new pebble

---

## API Endpoints

The app expects the following REST endpoints to be available at `/api/`:

### `GET /api/story`

Returns paginated biography / story records.

**Query parameters used by the app:**

| Parameter | Type | Description |
|---|---|---|
| `limit` | integer | Page size |
| `offset` | integer | Pagination offset |
| `orderby` | string | Sort field |
| `exclude` | object | Exclusion filters (e.g. `tags__slug__in`) |
| *(other filters)* | various | Forwarded from URL query string |

**Response shape:**
```json
{
  "count": 123,
  "results": [ { "id": 1, "title": "...", ... } ]
}
```

### `GET /api/story/:id`

Returns a single story by numeric ID. Used by `Story`, `Convoy`, `Slides`, `Page`.

### `GET /api/document`

Returns paginated document / person records. Accepts filter and pagination params identical in shape to `/api/story`.

### `GET /api/document/:id`

Returns a single document (archival resource) or person (deportee metadata). Used by `Document` and `Person`.

### `GET /api/pebbles/`

Returns user-submitted pebble objects for the interactive 3D memorial.

### `GET /api/pebbles/extent-z`

Returns the Z-axis extent for the 3D pebble scene.

### `POST /api/pebbles/`

Creates a new pebble. Requires the `X-CSRFToken` header (CSRF token retrieved from the `csrftoken` cookie).

### `/media/*` and `/pagefind/*`

Proxied directly to the backend. `/pagefind` serves the static full-text search index generated by the backend.

---

## Development Workflow

### Install and run

```bash
npm install --legacy-peer-deps   # install dependencies
make run-dev                     # start Vite dev server (injects git metadata)
# or: npm run dev
```

### Linting

```bash
npm run lint          # check
npm run lint:fix      # fix auto-fixable issues
```

The project uses ESLint with `eslint-config-react-app` and TypeScript ESLint. Configuration is in `.eslintrc`.

### Build

```bash
npm run build   # outputs to build/
npm run serve   # preview the production build at http://localhost:4173
```

### TypeScript check (no emit)

```bash
npx tsc --noEmit
```

---

## TypeScript Migration

The codebase is being **incrementally migrated** from JavaScript to TypeScript. Key points:

- New files **should** be created as `.ts` / `.tsx`.
- Existing `.js` / `.jsx` files remain valid and coexist with TypeScript files.
- `tsconfig.json` is set to `strict: true`; you may need to use `any` temporarily when touching legacy code.
- See [`TYPESCRIPT_MIGRATION.md`](./TYPESCRIPT_MIGRATION.md) for the recommended migration order and patterns.

### Current TypeScript files

- `vite.config.ts`
- `src/hooks/usePagefind.ts`
- *(add more as migration progresses)*

---

## Environment Variables

All runtime configuration is passed through Vite environment variables (prefix `VITE_`). The defaults live in `.env`. Override them in `.env.local` (git-ignored) for local development.

| Variable | Description |
|---|---|
| `VITE_PROXY` | Dev proxy target for `/api`, `/media`, `/pagefind` |
| `VITE_PEBBLE_API_PROXY` | Dev proxy target for `/api/pebbles` |
| `VITE_LANGUAGES` | Comma-separated supported locale codes |
| `VITE_ORIGIN` | Canonical origin URL |
| `VITE_EMAIL` | Contact e-mail |
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox GL token |
| `VITE_MAPBOX_STYLE_URL` | Mapbox style URL |
| `VITE_LOCALSTORAGE_NAME` | localStorage namespace |
| `VITE_MATOMO_URLBASE` | Matomo analytics URL |
| `VITE_MATOMO_SITEID` | Matomo site ID |
| `VITE_CLOUDFLARE_TURNSTILE_SITE_KEY` | Cloudflare CAPTCHA site key |
| `VITE_API_TIMEOUT` | Axios timeout in ms (default: `0` = no timeout) |
| `VITE_GIT_TAG` / `VITE_GIT_BRANCH` / `VITE_GIT_REVISION` | Injected at build time by Makefile / Dockerfile |

---

## Routing

Routes are defined in `src/App.jsx` using React Router 6. Key routes:

| Path pattern | Page component | Description |
|---|---|---|
| `/` | `Home` | Homepage with 3D pebble hero |
| `/:lang/biographies` | `Biographies` | Paginated biography list |
| `/:lang/biography/:id` | `Story` | Single biography |
| `/:lang/document/:id` | `Document` | Single archival document |
| `/:lang/person/:id` | `Person` | Deportee profile |
| `/:lang/people` | `People` | People index |
| `/:lang/search` | `Search` | Full-text / filter search |
| `/:lang/lines` | `Lines` | Timeline visualisation |
| `/:lang/convoy/:id` | `Convoy` | Convoy detail |
| `/:lang/slides/:id` | `Slides` | Slide-show presentation |

The `:lang` segment maps to one of the locales in `VITE_LANGUAGES`.

---

## Deployment

### Docker (production)

```bash
# Build a tagged image (git metadata injected automatically)
make build-docker-image
BUILD_TAG=v1.2.3 make build-docker-image

# GitHub Actions builds and publishes to Docker Hub automatically:
#   push to master  → c2dhunilu/memorial:latest
#   push tag v*/preview-* → c2dhunilu/memorial:<tag>
```

The final Docker image is minimal (BusyBox + static files). It is intended to be served by an external web server that also hosts the Miller backend.

### Netlify

```bash
make run-deploy-netlify
```

`netlify.toml` proxies `/api/*`, `/media/*`, and `/pagefind/*` to `https://memorialshoah.lu` and rewrites all other routes to `index.html` for SPA navigation.

---

## Key Conventions

- **Imports**: No file extensions required in import paths (Vite's `bundler` module resolution).
- **Formatting**: Prettier is configured (`.prettierrc`). Run `prettier --write .` before committing.
- **State management**: Use Zustand stores for global / cross-component state; keep local UI state in `useState`.
- **Data fetching**: Always use `useGetJSON` for read-only API calls. Use Axios directly only for mutations or when `useInfiniteQuery` is needed.
- **i18n**: Use the `useTranslation` hook from react-i18next. Strings live in `src/translations.json`.
- **CSS**: Global styles in `src/styles/`. Component-level overrides inline or with Bootstrap utility classes.
