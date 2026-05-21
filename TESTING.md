# MoneyMind — Testing Strategy

## Automated tests

### Backend (`backend/`)

```bash
cd backend
npm test
```

| Suite | Covers |
| --- | --- |
| `src/utils/budget.test.ts` | Budget usage %, status thresholds |
| `src/utils/period.test.ts` | Month/year resolution |
| `src/validations/auth.validation.test.ts` | Register/login Zod rules |

Run in watch mode: `npm run test:watch`

### Frontend (`frontend/`)

```bash
cd frontend
npm test
```

| Suite | Covers |
| --- | --- |
| `src/lib/validations/auth.test.ts` | Login/register form schemas |

## Recommended next tests (not implemented)

- Supertest integration tests for `/api/auth/register`, `/api/auth/login`
- Service tests with mocked Prisma for transaction list filters
- React Testing Library tests for `ProtectedRoute` and transaction form

## Manual testing

See [MANUAL_TEST_CHECKLIST.md](./MANUAL_TEST_CHECKLIST.md).

## Pre-release commands

```bash
cd backend && npm run lint && npm run build && npm test
cd frontend && npm run lint && npm run build && npm test
```
