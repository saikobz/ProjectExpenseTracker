# MoneyMind — Final Manual Test Checklist

Use after local setup or deployment smoke test.

## Authentication

- [ ] Register new user with valid data
- [ ] Register rejects duplicate email
- [ ] Login with demo account (`demo@moneymind.app` / `password123`)
- [ ] Login rejects wrong password
- [ ] `/api/auth/me` returns user without `passwordHash`
- [ ] Logout clears session and redirects to login
- [ ] Protected routes redirect guests to login

## Categories

- [ ] List income and expense categories
- [ ] Create, edit, delete category
- [ ] Delete blocked when category has transactions (409)

## Transactions

- [ ] Create income and expense transactions
- [ ] Filter by type, date range, category, search
- [ ] Edit and delete with confirmation
- [ ] Pagination and sorting work

## Dashboard

- [ ] Summary cards show correct totals for selected month
- [ ] Category pie chart and monthly trend load
- [ ] Recent transactions list updates

## Budgets

- [ ] Create budget for expense category only
- [ ] Usage % and status (`normal` / `warning` / `over_budget`) match spending
- [ ] Edit and delete budget

## Reports

- [ ] Monthly report: totals, categories, MoM comparison, table
- [ ] Yearly report: 12 months, category breakdown, high/low months
- [ ] CSV export downloads with correct Thai text in Excel (UTF-8 BOM)
- [ ] Empty month/year shows empty state

## Security & isolation

- [ ] All private APIs return 401 without token
- [ ] User A cannot access User B data (different tokens)

## UI & responsive

- [ ] Sidebar and mobile nav work on small screens
- [ ] Loading and error states visible on main pages
- [ ] Toast appears on CSV export success/failure

## Deployment smoke (production)

- [ ] Frontend loads from hosting URL
- [ ] `VITE_API_URL` points to live API
- [ ] Backend health returns `database: connected`
- [ ] Login and dashboard work against production DB
