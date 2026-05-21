# MoneyMind

Personal expense tracker — track income and expenses, manage categories and budgets, visualize spending with dashboards, and export reports to CSV.

![Screenshots placeholder](./docs/screenshots/README.md)

> Add screenshots of Dashboard, Transactions, Budgets, and Reports to `docs/screenshots/` when publishing the portfolio.

## Features

- JWT authentication (register, login, protected routes)
- Custom income/expense categories with default seeds
- Transactions with filters, search, sort, and pagination
- Dashboard with summary cards, charts, and recent activity
- Monthly budgets with usage tracking (`normal` / `warning` / `over_budget`)
- Monthly and yearly reports with CSV export (UTF-8 for Thai/Excel)
- Demo seed data for quick evaluation

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Query, Sonner |
| Backend | Node.js, Express 5, TypeScript, Prisma, Zod, JWT, bcrypt |
| Database | PostgreSQL 16 |
| DevOps | Docker Compose (local DB), deploy-ready for Vercel + Render/Railway + Neon/Supabase |

## Project structure

```text
ProjectExpenseTracker/
├── backend/                 # Express REST API
│   ├── prisma/              # Schema, migrations, seed
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── routes/
│       ├── middlewares/
│       ├── validations/
│       └── utils/
├── frontend/                # React SPA
│   └── src/
│       ├── pages/
│       ├── features/
│       ├── components/
│       └── services/
├── docker-compose.yml
├── TESTING.md
├── MANUAL_TEST_CHECKLIST.md
└── Plan.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (local PostgreSQL)

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | API port (default `3001`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 characters |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

Copy from `backend/.env.example`.

### Frontend (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:3001`). Empty uses Vite proxy in dev. |

Copy from `frontend/.env.example`.

## Local setup

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start PostgreSQL

```bash
# From project root
docker compose up -d
```

### 3. Configure env

```bash
cd backend
cp .env.example .env

cd ../frontend
cp .env.example .env
```

### 4. Database migrate & seed

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5. Run development servers

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

- API: http://localhost:3001/api/health
- App: http://localhost:5173

### Demo account

After seeding:

| Field | Value |
| --- | --- |
| Email | `demo@moneymind.app` |
| Password | `password123` |

## Scripts

### Backend

| Script | Description |
| --- | --- |
| `npm run dev` | API with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run prisma:migrate` | Apply migrations |
| `npm run prisma:seed` | Demo user + sample data |
| `npm run prisma:studio` | Prisma Studio |

### Frontend

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest (form validation) |

## API overview

All private routes require `Authorization: Bearer <token>`.

| Area | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Auth | `POST /api/auth/register`, `login`, `GET /me`, `POST /logout` |
| Categories | `GET/POST/PATCH/DELETE /api/categories` |
| Transactions | `GET/POST/PATCH/DELETE /api/transactions` |
| Dashboard | `GET /api/dashboard/summary`, `category-expenses`, `monthly-trend`, `recent-transactions` |
| Budgets | `GET/POST/PATCH/DELETE /api/budgets` |
| Reports | `GET /api/reports/monthly`, `yearly`, `export-csv` |

See earlier phase sections in git history or [Plan.md](./Plan.md) for curl examples.

## Testing

- Automated: see [TESTING.md](./TESTING.md)
- Manual: see [MANUAL_TEST_CHECKLIST.md](./MANUAL_TEST_CHECKLIST.md)

## Deployment

### Database (Neon / Supabase / Railway)

1. Create a PostgreSQL instance.
2. Copy the connection string to `DATABASE_URL` on the backend host.

### Backend (Render / Railway / Fly.io)

1. Connect the repo `backend/` folder (or monorepo subpath).
2. Build: `npm install && npm run prisma:generate && npm run build`
3. Start: `npm run start`
4. Release command (first deploy): `npx prisma migrate deploy`
5. Set env: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your frontend URL), `PORT` (often provided by host).

### Frontend (Vercel / Netlify)

1. Root directory: `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Env: `VITE_API_URL=https://your-api.example.com`

### Post-deploy smoke test

1. `GET https://your-api.example.com/api/health` → `database: connected`
2. Login with demo account (re-run seed on production DB if needed)
3. Open dashboard and export CSV

## Development roadmap

| Phase | Scope |
| --- | --- |
| 0–6 | Setup through reports & CSV export |
| **7** (current) | Testing, refactoring, seed, docs, deployment readiness |

## Future improvements

- Rate limiting and security headers (Helmet)
- E2E tests (Playwright)
- Multi-currency support
- Recurring transactions
- Email/password reset

## Known limitations

- Logout is client-side only (JWT is stateless)
- No rate limiting on auth endpoints
- CSV export optimized for Excel UTF-8 (BOM); other tools may differ
- Single currency (no FX)

## Stopping services

```bash
docker compose down
# Remove DB volume: docker compose down -v
```

## License

Private / portfolio project.
