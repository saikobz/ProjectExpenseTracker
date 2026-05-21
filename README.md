# MoneyMind

Personal expense tracker web application — track income and expenses, manage categories and budgets, and visualize spending with dashboards and charts.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Node.js, Express, TypeScript, Prisma, Zod |
| Database | PostgreSQL |
| Auth | JWT, bcrypt |

## Project structure

```text
ProjectExpenseTracker/
├── frontend/          # React SPA
├── backend/           # Express REST API
├── docker-compose.yml # Local PostgreSQL
├── Plan.md            # Full product & roadmap spec
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)

## Quick start

### 1. Clone and install dependencies

```bash
cd ProjectExpenseTracker

cd backend
npm install

cd ../frontend
npm install
```

### 2. Start PostgreSQL

```bash
# From project root
docker compose up -d
```

Verify the container is healthy:

```bash
docker compose ps
```

### 3. Configure environment variables

**Backend** — copy the example file and adjust if needed:

```bash
cd backend
cp .env.example .env   # Windows: copy .env.example .env
```

**Frontend** (optional for Phase 0):

```bash
cd frontend
cp .env.example .env   # Windows: copy .env.example .env
```

Default `DATABASE_URL` matches `docker-compose.yml`:

```text
postgresql://moneymind:moneymind_secret@localhost:5432/moneymind?schema=public
```

### 4. Initialize Prisma

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

This applies the `User` model and other schema migrations.

### 5. Run the backend

```bash
cd backend
npm run dev
```

API: [http://localhost:3001](http://localhost:3001)  
Health check: [http://localhost:3001/api/health](http://localhost:3001/api/health)

Expected health response when the database is up:

```json
{
  "status": "ok",
  "service": "moneymind-api",
  "timestamp": "2026-05-21T12:00:00.000Z",
  "database": "connected"
}
```

### 6. Run the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

The Vite dev server proxies `/api` requests to the backend on port `3001`.

## Scripts

### Backend (`backend/`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run migrations (Phase 1+) |
| `npm run prisma:studio` | Open Prisma Studio |

### Frontend (`frontend/`)

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## API

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | API info |
| GET | `/api/health` | Service and database health |

### Authentication (Phase 1)

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Bearer token | Current user profile |
| POST | `/api/auth/logout` | Bearer token | Logout (client removes token) |

**Register / login example:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password123"}'
```

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Categories (Phase 2)

All category endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/categories` | List categories (`?type=expense` or `?type=income`) |
| POST | `/api/categories` | Create category |
| PATCH | `/api/categories/:id` | Update name/color |
| DELETE | `/api/categories/:id` | Delete category |

New users receive default income and expense categories on registration.

```bash
curl http://localhost:3001/api/categories?type=expense \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Coffee","type":"expense","color":"#8B5CF6"}'
```

### Transactions (Phase 3)

All transaction endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/transactions` | List with filters, search, sort, pagination |
| GET | `/api/transactions/:id` | Transaction detail |
| POST | `/api/transactions` | Create transaction |
| PATCH | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

**List example:**

```text
GET /api/transactions?type=expense&from=2026-05-01&to=2026-05-31&page=1&limit=10&search=coffee&sortBy=date&sortOrder=desc
```

```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","categoryId":"CATEGORY_UUID","amount":120,"description":"Lunch","transactionDate":"2026-05-21","paymentMethod":"cash"}'
```

## Development roadmap

| Phase | Scope |
| --- | --- |
| **0** | Project setup, tooling, health check |
| **1** | Authentication (register, login, JWT, protected routes) |
| **2** | Categories (CRUD, defaults, `/categories` UI) |
| **3** (current) | Transactions (CRUD, filters, `/transactions` UI) |
| **4+** | Dashboard, budgets, reports |

See [Plan.md](./Plan.md) for the full specification.

## Stopping services

```bash
docker compose down
```

To remove database data:

```bash
docker compose down -v
```

## License

Private / portfolio project — add a license when you publish the repository.
