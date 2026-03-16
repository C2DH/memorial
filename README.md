# Memorial de la Deportation

A React application for the Memorial de la Shoah in Luxembourg. The app connects to a **Miller** CMS backend and provides interactive biographies, document browsing, full-text search, 3D visualizations, and multilingual support (English, French, German).

## Tech Stack

- **React 18** with **Vite 4** (replaced Create React App)
- **TypeScript** – ongoing migration; both `.jsx`/`.js` and `.tsx`/`.ts` files coexist (see [`TYPESCRIPT_MIGRATION.md`](./TYPESCRIPT_MIGRATION.md))
- **React Router 6**, **Zustand**, **TanStack React Query**, **Axios**
- **Bootstrap 5**, **Framer Motion**, **Three.js / React Three Fiber**, **Mapbox GL**
- **React i18next** for internationalisation

---

## Prerequisites

- **Node.js** ≥ 18 (see `.nvmrc` for the pinned version)
- **npm** ≥ 8 (or use `nvm use` to pick up `.nvmrc`)
- A running **Miller** backend (or any backend exposing the API described below)

---

## Development

### 1 – Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2 – Configure the proxy

Copy or edit `.env` and point the two proxy variables at your local Miller backend:

```dotenv
VITE_PROXY=http://localhost          # target for /api/* and /media/* and /pagefind/*
VITE_PEBBLE_API_PROXY=http://localhost  # target for /api/pebbles/*
```

All other `.env` variables are listed in the [Environment variables](#environment-variables) section below.

### 3 – Start the development server

```bash
make run-dev
# or equivalently:
npm run dev
```

Vite starts on `http://localhost:5173` by default and proxies `/api`, `/media`, and `/pagefind` to the backend defined by `VITE_PROXY`.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` / `npm start` | Start Vite dev server with HMR |
| `npm run build` | Production build → `build/` |
| `npm run serve` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix |

---

## External API

The React app communicates with a **Miller** backend. All requests are made via Axios and the `useGetJSON` hook (`src/hooks/data.js`), which wraps TanStack React Query for caching and de-duplication.

### `/api/story` – Biographies / Stories

Used to retrieve biography records (stories) from the CMS.

| Usage | Description |
|---|---|
| `GET /api/story` | Paginated list of stories. Accepts `limit`, `offset`, `orderby`, query-string filters (`exclude`, tags, …). |
| `GET /api/story/:id` | Single story by numeric ID. |

Example call (from `src/pages/Search.jsx`):

```js
axios.get('/api/story', {
  params: {
    limit: 10,
    offset: 0,
    orderby: 'title',
    exclude: { tags__slug__in: ['static', 'convoy'] },
  },
})
```

Pages / components that consume `/api/story`:
`Biographies`, `Convoy`, `Search`, `Slides`, `Story`, `Page`, `Hero`, `HomeBiographies`, `TopStories`, `SearchStories`, `SelectStory`

### `/api/document` – Resources & Person metadata

Used for both primary source documents and person (deportee) metadata.

| Usage | Description |
|---|---|
| `GET /api/document` | Paginated list of documents with filter params. |
| `GET /api/document/:id` | Single document or person record. |

Pages / components that consume `/api/document`:
`Document`, `Person`, `Lines`, `People`, `ListOfDocuments`, `TopDocuments`, `StoryTimeline`

### `/api/pebbles` – User pebbles (interactive 3D memorial)

| Usage | Description |
|---|---|
| `GET /api/pebbles/` | Retrieve all user-submitted pebble objects. |
| `GET /api/pebbles/extent-z` | Z-axis extent for the 3D scene. |
| `POST /api/pebbles/` | Submit a new pebble (requires `X-CSRFToken` header). |

### `/media/*` and `/pagefind/*`

Proxied transparently to the backend (`VITE_PROXY`). `/pagefind` powers the static full-text search index.

---

## Environment Variables

All variables are prefixed with `VITE_` so that Vite exposes them to the browser bundle via `import.meta.env`.

| Variable | Default / Example | Description |
|---|---|---|
| `VITE_PROXY` | `http://localhost` | Dev-server proxy target for `/api`, `/media`, `/pagefind` |
| `VITE_PEBBLE_API_PROXY` | `http://localhost` | Dev-server proxy target for `/api/pebbles` |
| `VITE_LANGUAGES` | `en-GB,fr-FR,de-DE` | Comma-separated list of supported locales |
| `VITE_EMAIL` | `c2dh.memorial@uni.lu` | Contact e-mail shown in the UI |
| `VITE_ORIGIN` | `https://memorialshoah.lu` | Canonical origin URL |
| `VITE_MAPBOX_ACCESS_TOKEN` | *(token)* | Mapbox GL access token |
| `VITE_MAPBOX_STYLE_URL` | *(style URL)* | Mapbox style URL |
| `VITE_LOCALSTORAGE_NAME` | `memorialshoah` | localStorage key namespace |
| `VITE_MATOMO_URLBASE` | *(URL)* | Matomo analytics base URL |
| `VITE_MATOMO_SITEID` | `2` | Matomo site ID |
| `VITE_CLOUDFLARE_TURNSTILE_SITE_KEY` | *(key)* | Cloudflare Turnstile CAPTCHA site key |
| `VITE_API_TIMEOUT` | `0` (no timeout) | Axios request timeout in ms |
| `VITE_GIT_TAG` | *(set at build time)* | Git tag injected by Makefile / Dockerfile |
| `VITE_GIT_BRANCH` | *(set at build time)* | Git branch injected by Makefile / Dockerfile |
| `VITE_GIT_REVISION` | *(set at build time)* | Short commit SHA injected by Makefile / Dockerfile |

---

## Deployment

### Docker

A multi-stage `Dockerfile` is provided. The first stage builds the app with Node 25 Alpine; the second stage copies only the static output into a minimal BusyBox image.

```bash
# Build with the Makefile helper (injects git metadata automatically)
make build-docker-image

# Or set a specific tag:
BUILD_TAG=v1.2.3 make build-docker-image
```

The GitHub Actions workflows publish Docker images automatically:

| Trigger | Image tag |
|---|---|
| Push to `master` | `c2dhunilu/memorial:latest` |
| Push tag `v*` or `preview-*` | `c2dhunilu/memorial:<tag>` |

Required repository secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD`.

### Netlify

`netlify.toml` redirects `/api/*`, `/media/*`, and `/pagefind/*` to `https://memorialshoah.lu` and falls back all other routes to `index.html` for SPA routing.

```bash
make run-deploy-netlify
```

---

## TypeScript Migration

The project is in the process of migrating from JavaScript to TypeScript. New files should be created as `.ts` / `.tsx`. See [`TYPESCRIPT_MIGRATION.md`](./TYPESCRIPT_MIGRATION.md) for the migration strategy, priority order, and common type patterns.

---

## License

[AGPL-3.0](./LICENSE.md) – Centre for Contemporary and Digital History (C²DH), University of Luxembourg.

