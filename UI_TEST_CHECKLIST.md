# MoneyMind UI Test Checklist

Use after the premium UX/UI redesign. Test at **375px**, **768px**, and **1280px** widths.

## Layout and navigation

- [ ] Desktop: light sidebar visible with active state (left border accent)
- [ ] Mobile: top bar + hamburger opens sheet navigation
- [ ] All nav links work: Dashboard, Transactions, Budgets, Reports, Categories, Settings
- [ ] Logout returns to login
- [ ] Page content uses consistent max width and padding

## Landing and auth

- [ ] Home: hero, feature cards, CTAs, demo hint in footer area
- [ ] Login/Register: split brand panel on large screens; form validates
- [ ] Auth errors show inline with `role="alert"`

## Dashboard

- [ ] Loading skeleton appears before data
- [ ] Error state with retry works
- [ ] Empty state links to transactions
- [ ] KPI cards and charts render; recent list readable

## Transactions

- [ ] Filters apply and clear
- [ ] Table sticky header, zebra rows on desktop
- [ ] Card list on mobile
- [ ] Add/edit modal works; delete confirm dialog works
- [ ] Pagination previous/next

## Categories

- [ ] Expense/income tabs switch lists
- [ ] Grid cards with color dot; edit/delete
- [ ] Empty/loading/error states per tab

## Budgets

- [ ] Month/year selector updates cards
- [ ] Progress bar colors: green / amber / red by status
- [ ] Status badge shows text (not color-only)
- [ ] Add/edit/delete flows work

## Reports

- [ ] Monthly/yearly tabs; loading skeleton
- [ ] CSV export toast on success/error
- [ ] Executive KPI strip and charts
- [ ] Transaction table in monthly report

## Settings

- [ ] Profile shows name and email
- [ ] Theme toggle: light / dark / system persists on reload
- [ ] Change password disabled with helper text

## Accessibility

- [ ] Tab through sidebar, sheet menu, forms, modals
- [ ] Icon buttons have `aria-label`
- [ ] Form inputs have associated labels
- [ ] Focus ring visible on interactive elements

## Regression

- [ ] No API or business logic changes broke CRUD
- [ ] `npm run build` and `npm run lint` pass in `frontend/`
