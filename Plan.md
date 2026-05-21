# MoneyMind: Personal Expense Tracker Web Application

## 1. Project Overview

**MoneyMind** คือ Web Application สำหรับบันทึก วิเคราะห์ และวางแผนการเงินส่วนบุคคล โดยผู้ใช้สามารถบันทึกรายรับรายจ่าย จัดหมวดหมู่รายการ ตั้งงบประมาณรายเดือน และดูสรุปการเงินผ่าน Dashboard และกราฟวิเคราะห์ข้อมูล

เป้าหมายของระบบคือช่วยให้ผู้ใช้เข้าใจพฤติกรรมการใช้เงินของตนเอง ลดปัญหาใช้เงินเกินงบ และสามารถวางแผนการเงินรายเดือนได้อย่างมีประสิทธิภาพ

---

## 2. Business Problem

ผู้ใช้จำนวนมากมีปัญหาในการติดตามรายรับรายจ่ายประจำวัน ทำให้ไม่ทราบว่าเงินถูกใช้ไปกับหมวดหมู่ใดมากที่สุด และไม่สามารถควบคุมงบประมาณรายเดือนได้อย่างเป็นระบบ

ระบบ MoneyMind จึงถูกออกแบบมาเพื่อแก้ปัญหาดังนี้:

- ผู้ใช้ไม่สามารถติดตามรายจ่ายรายวันได้อย่างต่อเนื่อง
- ไม่มีภาพรวมรายรับรายจ่ายในแต่ละเดือน
- ไม่ทราบหมวดหมู่ที่ใช้เงินมากที่สุด
- ไม่สามารถตั้งงบประมาณและติดตามการใช้เงินเทียบกับงบได้
- ขาดรายงานสรุปเพื่อช่วยวางแผนการเงิน

---

## 3. Project Objectives

### Primary Objectives

- พัฒนา Web Application สำหรับจัดการรายรับรายจ่ายส่วนบุคคล
- รองรับระบบ Authentication เพื่อแยกข้อมูลของผู้ใช้แต่ละคน
- รองรับ CRUD สำหรับรายการรายรับรายจ่าย
- สร้าง Dashboard สำหรับสรุปสถานะการเงินรายเดือน
- แสดงผลข้อมูลผ่านกราฟเพื่อช่วยวิเคราะห์พฤติกรรมการใช้เงิน
- รองรับการตั้งงบประมาณรายเดือนตามหมวดหมู่

### Secondary Objectives

- ออกแบบระบบให้สามารถขยายต่อได้ง่าย
- วางโครงสร้างโค้ดแบบ Clean Architecture ในระดับที่เหมาะสมกับโปรเจก
- รองรับการ Deploy จริง
- จัดทำเอกสาร README, API Documentation และ Database Schema
- ทำให้โปรเจกเหมาะสำหรับใช้เป็น Portfolio

---

## 4. Target Users

กลุ่มผู้ใช้หลักของระบบ ได้แก่:

- นักเรียน / นักศึกษา
- พนักงานประจำ
- ฟรีแลนซ์
- บุคคลทั่วไปที่ต้องการวางแผนการเงิน
- ผู้ที่ต้องการเห็นภาพรวมการใช้เงินรายเดือน

---

## 5. Core Features

## 5.1 Authentication

ระบบต้องรองรับการจัดการผู้ใช้พื้นฐาน

### Functional Requirements

- Register
- Login
- Logout
- Password hashing
- JWT-based authentication
- Protected routes
- User-specific data isolation

### Acceptance Criteria

- ผู้ใช้สามารถสมัครสมาชิกด้วยชื่อ อีเมล และรหัสผ่านได้
- ผู้ใช้สามารถเข้าสู่ระบบด้วยอีเมลและรหัสผ่านได้
- ผู้ใช้ที่ไม่ได้เข้าสู่ระบบไม่สามารถเข้าหน้า Dashboard ได้
- ข้อมูลรายรับรายจ่ายของผู้ใช้แต่ละคนต้องแยกจากกันอย่างชัดเจน

---

## 5.2 Transaction Management

ระบบต้องรองรับการจัดการรายการรายรับรายจ่าย

### Functional Requirements

- Create transaction
- Read transaction list
- Update transaction
- Delete transaction
- Filter by type, category, date range
- Search by description
- Sort by date and amount

### Transaction Fields

| Field | Type | Required | Description |
|---|---|---|---|
| id | UUID / Integer | Yes | Transaction ID |
| user_id | UUID / Integer | Yes | Owner of transaction |
| category_id | UUID / Integer | Yes | Category reference |
| type | Enum | Yes | income / expense |
| amount | Decimal | Yes | Transaction amount |
| description | String | No | Transaction note |
| transaction_date | Date | Yes | Actual transaction date |
| payment_method | String | No | Cash, transfer, credit card, e-wallet |
| created_at | Timestamp | Yes | Created timestamp |
| updated_at | Timestamp | Yes | Updated timestamp |

### Acceptance Criteria

- ผู้ใช้สามารถเพิ่มรายการรายรับหรือรายจ่ายได้
- ผู้ใช้สามารถแก้ไขรายการเดิมได้
- ผู้ใช้สามารถลบรายการได้
- ผู้ใช้สามารถดูรายการย้อนหลังได้
- ระบบต้องแสดงเฉพาะรายการของผู้ใช้ที่เข้าสู่ระบบเท่านั้น

---

## 5.3 Category Management

ระบบต้องรองรับการจัดการหมวดหมู่รายรับรายจ่าย

### Functional Requirements

- Create category
- Edit category
- Delete category
- Separate income and expense categories
- Assign color to category
- Default categories for new users

### Default Expense Categories

- Food
- Transportation
- Shopping
- Rent
- Utilities
- Health
- Entertainment
- Education
- Others

### Default Income Categories

- Salary
- Freelance
- Investment
- Bonus
- Gift
- Others

### Acceptance Criteria

- ผู้ใช้สามารถสร้างหมวดหมู่ของตนเองได้
- หมวดหมู่ต้องผูกกับผู้ใช้แต่ละคน
- หมวดหมู่รายรับและรายจ่ายต้องแยกประเภทกัน
- ไม่ควรลบหมวดหมู่ที่มี transaction ผูกอยู่โดยตรง หรือควรมี fallback category

---

## 5.4 Dashboard

Dashboard เป็นหน้าหลักของระบบหลังจากผู้ใช้เข้าสู่ระบบ

### Functional Requirements

- Monthly income summary
- Monthly expense summary
- Current balance
- Top spending category
- Recent transactions
- Expense by category chart
- Income vs Expense monthly chart
- Budget usage summary

### Dashboard Metrics

| Metric | Description |
|---|---|
| Total Income | รายรับรวมของเดือนปัจจุบัน |
| Total Expense | รายจ่ายรวมของเดือนปัจจุบัน |
| Balance | รายรับลบรายจ่าย |
| Top Expense Category | หมวดหมู่ที่มีรายจ่ายสูงสุด |
| Budget Usage | เปอร์เซ็นต์การใช้งบประมาณ |
| Recent Transactions | รายการล่าสุด 5-10 รายการ |

### Acceptance Criteria

- Dashboard ต้องโหลดข้อมูลเฉพาะของผู้ใช้ที่เข้าสู่ระบบ
- Summary ต้องคำนวณจากข้อมูลของเดือนที่เลือก
- กราฟต้องแสดงข้อมูลถูกต้องตาม transaction จริง
- ผู้ใช้สามารถเปลี่ยนเดือนหรือปีเพื่อดูข้อมูลย้อนหลังได้

---

## 5.5 Budget Management

ระบบต้องรองรับการตั้งงบประมาณรายเดือน

### Functional Requirements

- Create monthly budget by category
- Update budget amount
- Delete budget
- Show budget usage percentage
- Warning when usage exceeds 80%
- Alert when usage exceeds 100%

### Budget Fields

| Field | Type | Required | Description |
|---|---|---|---|
| id | UUID / Integer | Yes | Budget ID |
| user_id | UUID / Integer | Yes | Owner of budget |
| category_id | UUID / Integer | Yes | Budget category |
| month | Integer | Yes | Month |
| year | Integer | Yes | Year |
| amount | Decimal | Yes | Budget limit |
| created_at | Timestamp | Yes | Created timestamp |
| updated_at | Timestamp | Yes | Updated timestamp |

### Acceptance Criteria

- ผู้ใช้สามารถตั้งงบประมาณแยกตามหมวดหมู่ได้
- ระบบต้องคำนวณยอดใช้จริงเทียบกับงบประมาณ
- หากใช้เกิน 80% ต้องแสดงสถานะ Warning
- หากใช้เกิน 100% ต้องแสดงสถานะ Over Budget

---

## 5.6 Reports

ระบบต้องมีหน้ารายงานเพื่อดูข้อมูลเชิงลึก

### Functional Requirements

- Monthly report
- Yearly report
- Expense breakdown by category
- Income breakdown by category
- Compare current month with previous month
- Export CSV

### Acceptance Criteria

- ผู้ใช้สามารถเลือกเดือนและปีที่ต้องการดูรายงานได้
- ระบบต้องแสดงผลรวมรายรับ รายจ่าย และคงเหลือ
- ระบบต้องแสดงรายจ่ายแยกตามหมวดหมู่
- ระบบสามารถ export รายการเป็น CSV ได้

---

## 6. Non-Functional Requirements

## 6.1 Security

- Password ต้องถูก hash ด้วย bcrypt
- API ที่ต้องใช้ authentication ต้องตรวจสอบ JWT ทุกครั้ง
- User ไม่สามารถเข้าถึงข้อมูลของ user อื่นได้
- Validate input ทั้งฝั่ง client และ server
- ป้องกัน SQL Injection ผ่าน ORM
- ไม่เก็บ password แบบ plain text
- ใช้ environment variables สำหรับ secrets

## 6.2 Performance

- Dashboard API ควรตอบกลับภายใน 500ms - 1s สำหรับข้อมูลขนาดเล็กถึงกลาง
- ใช้ pagination สำหรับ transaction list
- ใช้ database index กับ field ที่ค้นหาบ่อย เช่น user_id, transaction_date, category_id
- หลีกเลี่ยงการ query ข้อมูลทั้งหมดโดยไม่จำเป็น

## 6.3 Maintainability

- แยก layer ของระบบให้ชัดเจน
- ใช้ naming convention ที่สม่ำเสมอ
- มี reusable components ใน frontend
- มี centralized error handling ใน backend
- มี API response format ที่เป็นมาตรฐาน
- มี README สำหรับ setup project

## 6.4 Scalability

ระบบควรถูกออกแบบให้สามารถขยายต่อได้ เช่น:

- เพิ่ม multi-currency
- เพิ่ม recurring transaction
- เพิ่ม upload CSV
- เพิ่ม AI-based insight
- เพิ่ม mobile application
- เพิ่ม notification system

---

## 7. Recommended Tech Stack

## 7.1 Frontend

| Technology | Purpose |
|---|---|
| React + Vite | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| React Router | Client-side routing |
| React Hook Form | Form handling |
| Zod | Form validation |
| Recharts | Data visualization |
| Axios | HTTP client |
| TanStack Query | Server state management |

## 7.2 Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Backend framework |
| TypeScript | Type safety |
| Prisma | ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod / Joi | Request validation |
| CORS | API access control |
| Morgan / Winston | Logging |

## 7.3 Development Tools

| Tool | Purpose |
|---|---|
| Git | Version control |
| GitHub | Repository hosting |
| Docker | Local database environment |
| Postman / Insomnia | API testing |
| ESLint | Code quality |
| Prettier | Code formatting |
| Husky | Git hooks |
| GitHub Actions | CI pipeline |
| Vercel | Frontend deployment |
| Render / Railway / Fly.io | Backend deployment |
| Supabase / Neon | PostgreSQL hosting |

---

## 8. System Architecture

## 8.1 High-Level Architecture

```text
Client Browser
      |
      v
React Frontend
      |
      v
REST API - Express.js
      |
      v
Service Layer
      |
      v
Repository / Prisma ORM
      |
      v
PostgreSQL Database

8.2 Backend Layering
src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── repositories/
├── validations/
├── utils/
├── types/
└── app.ts

Layer Responsibilities
| Layer        | Responsibility                |
| ------------ | ----------------------------- |
| Routes       | Define API endpoints          |
| Controllers  | Handle request and response   |
| Services     | Business logic                |
| Repositories | Database access               |
| Middlewares  | Auth, error handling, logging |
| Validations  | Request validation schemas    |
| Utils        | Shared helper functions       |

9. Database Design
9.1 Entity Relationship Overview
User 1 --- N Transaction
User 1 --- N Category
User 1 --- N Budget
Category 1 --- N Transaction
Category 1 --- N Budget

9.2 Tables
users
| Column        | Type         | Constraint       |
| ------------- | ------------ | ---------------- |
| id            | UUID         | Primary Key      |
| name          | VARCHAR(100) | Not Null         |
| email         | VARCHAR(255) | Unique, Not Null |
| password_hash | TEXT         | Not Null         |
| created_at    | TIMESTAMP    | Not Null         |
| updated_at    | TIMESTAMP    | Not Null         |

categories
| Column     | Type         | Constraint       |
| ---------- | ------------ | ---------------- |
| id         | UUID         | Primary Key      |
| user_id    | UUID         | Foreign Key      |
| name       | VARCHAR(100) | Not Null         |
| type       | ENUM         | income / expense |
| color      | VARCHAR(20)  | Nullable         |
| created_at | TIMESTAMP    | Not Null         |
| updated_at | TIMESTAMP    | Not Null         |

transactions
| Column           | Type          | Constraint       |
| ---------------- | ------------- | ---------------- |
| id               | UUID          | Primary Key      |
| user_id          | UUID          | Foreign Key      |
| category_id      | UUID          | Foreign Key      |
| type             | ENUM          | income / expense |
| amount           | DECIMAL(12,2) | Not Null         |
| description      | TEXT          | Nullable         |
| transaction_date | DATE          | Not Null         |
| payment_method   | VARCHAR(50)   | Nullable         |
| created_at       | TIMESTAMP     | Not Null         |
| updated_at       | TIMESTAMP     | Not Null         |

budgets
| Column      | Type          | Constraint  |
| ----------- | ------------- | ----------- |
| id          | UUID          | Primary Key |
| user_id     | UUID          | Foreign Key |
| category_id | UUID          | Foreign Key |
| month       | INTEGER       | Not Null    |
| year        | INTEGER       | Not Null    |
| amount      | DECIMAL(12,2) | Not Null    |
| created_at  | TIMESTAMP     | Not Null    |
| updated_at  | TIMESTAMP     | Not Null    |

10. API Design
10.1 Authentication APIs
| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user        |
| GET    | /api/auth/me       | Get current user  |
| POST   | /api/auth/logout   | Logout user       |

10.2 Transaction APIs
| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | /api/transactions     | Get transaction list   |
| GET    | /api/transactions/:id | Get transaction detail |
| POST   | /api/transactions     | Create transaction     |
| PATCH  | /api/transactions/:id | Update transaction     |
| DELETE | /api/transactions/:id | Delete transaction     |

Query Parameters
/api/transactions?type=expense&categoryId=xxx&from=2026-05-01&to=2026-05-31&page=1&limit=10&search=coffee

10.3 Category APIs
| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | /api/categories     | Get categories  |
| POST   | /api/categories     | Create category |
| PATCH  | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

10.4 Budget APIs
| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | /api/budgets     | Get monthly budgets |
| POST   | /api/budgets     | Create budget       |
| PATCH  | /api/budgets/:id | Update budget       |
| DELETE | /api/budgets/:id | Delete budget       |

10.5 Dashboard APIs
| Method | Endpoint                           | Description                          |
| ------ | ---------------------------------- | ------------------------------------ |
| GET    | /api/dashboard/summary             | Get monthly summary                  |
| GET    | /api/dashboard/category-expenses   | Get expense by category              |
| GET    | /api/dashboard/monthly-trend       | Get monthly income and expense trend |
| GET    | /api/dashboard/recent-transactions | Get recent transactions              |

11. Frontend Pages
11.1 Public Pages
| Page         | Route     | Description          |
| ------------ | --------- | -------------------- |
| Login        | /login    | Login page           |
| Register     | /register | Register page        |
| Landing Page | /         | Project introduction |

11.2 Protected Pages
| Page         | Route         | Description            |
| ------------ | ------------- | ---------------------- |
| Dashboard    | /dashboard    | Financial overview     |
| Transactions | /transactions | Manage transactions    |
| Categories   | /categories   | Manage categories      |
| Budgets      | /budgets      | Manage monthly budgets |
| Reports      | /reports      | View reports           |
| Settings     | /settings     | User settings          |

12. Frontend Component Structure
src/
├── components/
│   ├── common/
│   ├── forms/
│   ├── charts/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   ├── transactions/
│   ├── categories/
│   ├── budgets/
│   ├── dashboard/
│   └── reports/
├── hooks/
├── lib/
├── pages/
├── routes/
├── services/
├── stores/
├── types/
└── main.tsx

Key Components
| Component         | Purpose                     |
| ----------------- | --------------------------- |
| AppLayout         | Main authenticated layout   |
| Sidebar           | Navigation menu             |
| SummaryCard       | Display financial metrics   |
| TransactionTable  | Display transaction list    |
| TransactionForm   | Create and edit transaction |
| CategoryForm      | Create and edit category    |
| BudgetProgress    | Show budget usage           |
| ExpensePieChart   | Expense by category         |
| MonthlyTrendChart | Income vs expense trend     |
| DateRangeFilter   | Filter by date              |

13. Development Roadmap
Phase 0: Project Setup
Duration

2-3 days

Tasks
Create GitHub repository
Setup frontend project with React + Vite + TypeScript
Setup backend project with Express + TypeScript
Setup PostgreSQL using Docker
Setup Prisma
Setup ESLint and Prettier
Setup environment variables
Define base folder structure
Setup API health check
Deliverables
Running frontend project
Running backend project
Connected database
Initial README
Development environment setup guide
Phase 1: Authentication Module
Duration

3-5 days

Tasks
Design user schema
Implement register API
Implement login API
Implement password hashing
Implement JWT generation
Implement auth middleware
Implement protected routes
Build login page
Build register page
Store auth token securely
Implement logout flow
Deliverables
Users can register
Users can login
Protected APIs require JWT
Frontend route protection works
Phase 2: Category Module
Duration

2-3 days

Tasks
Design category schema
Create default categories after user registration
Implement category CRUD APIs
Build category management page
Implement category form validation
Add color support for categories
Deliverables
Users can manage income and expense categories
Categories are user-specific
Default categories are created automatically
Phase 3: Transaction Module
Duration

5-7 days

Tasks
Design transaction schema
Implement transaction CRUD APIs
Implement transaction validation
Implement pagination
Implement search and filters
Build transaction list page
Build create/edit transaction form
Add delete confirmation modal
Add empty state and loading state
Deliverables
Users can create, read, update, and delete transactions
Users can filter and search transactions
Transaction list supports pagination
Phase 4: Dashboard Module
Duration

4-6 days

Tasks
Implement monthly summary API
Implement expense by category API
Implement monthly trend API
Implement recent transactions API
Build dashboard layout
Build summary cards
Build pie chart
Build bar chart or line chart
Add month/year selector
Handle loading and error states
Deliverables
Dashboard shows monthly financial summary
Dashboard displays charts correctly
Users can view data by selected month/year
Phase 5: Budget Module
Duration

4-5 days

Tasks
Design budget schema
Implement budget CRUD APIs
Prevent duplicate budget for same category/month/year
Calculate budget usage
Build budget page
Build budget form
Add progress bar
Add warning and over-budget indicators
Deliverables
Users can set budgets by category
Users can see actual spending compared with budget
System displays warning when spending exceeds threshold
Phase 6: Reports and Export
Duration

3-5 days

Tasks
Implement monthly report API
Implement yearly report API
Implement category breakdown
Implement month-over-month comparison
Build report page
Add CSV export
Add report filters
Deliverables
Users can view monthly and yearly reports
Users can export transaction data as CSV
Users can compare current month with previous month
Phase 7: Testing, Refactoring, and Deployment
Duration

4-7 days

Tasks
Add backend unit tests for services
Add API integration tests for critical endpoints
Add frontend form validation tests where necessary
Refactor duplicated code
Improve error handling
Add seed data
Prepare production environment variables
Deploy frontend
Deploy backend
Deploy database
Update README with screenshots and deployment link
Deliverables
Stable production-ready version
Deployed frontend URL
Deployed backend API
Final README
Demo account
Project screenshots

14. Suggested Timeline
| Week   | Focus                               | Output                              |
| ------ | ----------------------------------- | ----------------------------------- |
| Week 1 | Setup, Auth, Category               | Project foundation and login system |
| Week 2 | Transaction CRUD                    | Main data entry system              |
| Week 3 | Dashboard and Charts                | Visual financial overview           |
| Week 4 | Budget, Reports, Export, Deployment | Complete portfolio-ready version    |

15. Git Branching Strategy
ใช้ Git branching แบบง่ายแต่เป็นระบบ
main
develop
feature/auth
feature/categories
feature/transactions
feature/dashboard
feature/budgets
feature/reports
fix/*
refactor/*

16. API Response Standard
Success Response
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "uuid",
    "amount": 250,
    "type": "expense"
  }
}

Error Response
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}

17. Error Handling Strategy
ระบบควรจัดการ error อย่างเป็นมาตรฐาน
Common Error Cases
| Case                  | HTTP Status | Description              |
| --------------------- | ----------- | ------------------------ |
| Validation Error      | 400         | Invalid request body     |
| Unauthorized          | 401         | Missing or invalid token |
| Forbidden             | 403         | Access denied            |
| Not Found             | 404         | Resource not found       |
| Conflict              | 409         | Duplicate resource       |
| Internal Server Error | 500         | Unexpected server error  |

Backend Strategy
ใช้ centralized error middleware
สร้าง custom error class
Validate request ก่อนเข้า service layer
ไม่ส่ง stack trace ไปยัง client ใน production
18. Validation Rules
18.1 Register
name: required, 2-100 characters
email: required, valid email format, unique
password: required, minimum 8 characters
18.2 Login
email: required
password: required
18.3 Transaction
type: required, income หรือ expense
amount: required, greater than 0
category_id: required
transaction_date: required, valid date
description: optional, maximum 255 characters
payment_method: optional
18.4 Budget
category_id: required
month: required, 1-12
year: required
amount: required, greater than 0
19. Security Checklist
 Hash password with bcrypt
 Use JWT expiration
 Store JWT securely on frontend
 Protect private routes
 Validate all request bodies
 Sanitize user input
 Enforce user ownership in queries
 Use CORS configuration
 Store secrets in environment variables
 Do not expose database credentials
 Disable detailed errors in production
 Add rate limiting for auth endpoints if possible
20. Performance Checklist
 Add pagination to transaction list
 Add database indexes
 Avoid N+1 queries
 Cache selected dashboard queries if necessary
 Use loading skeletons on frontend
 Optimize chart data payload
 Avoid over-fetching
 Use TanStack Query for server state caching
21. Testing Strategy
21.1 Backend Testing
Unit Tests
Auth service
Transaction service
Budget calculation service
Dashboard summary service
Integration Tests
Register API
Login API
Create transaction API
Get transaction list API
Create budget API
Dashboard summary API
21.2 Frontend Testing
Recommended Coverage
Login form validation
Register form validation
Transaction form validation
Budget form validation
Protected route behavior

22. Deployment Plan
22.1 Frontend Deployment
Recommended platform:
Vercel
Netlify
Required Environment Variables
VITE_API_BASE_URL=https://api.example.com

22.2 Backend Deployment

Recommended platform:

Render
Railway
Fly.io
Required Environment Variables
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
22.3 Database Deployment

Recommended platform:

Supabase
Neon
Railway PostgreSQL
23. MVP Scope

MVP ควรมีฟีเจอร์ขั้นต่ำดังนี้:

User registration
User login
Protected dashboard
Category management
Transaction CRUD
Monthly summary
Expense by category chart
Income vs expense chart
Budget management
Basic report page
24. Out of Scope for MVP

ฟีเจอร์ที่ยังไม่ควรทำในเวอร์ชันแรก:

เชื่อมต่อธนาคารจริง
ระบบชำระเงินจริง
Mobile application
Multi-currency
OCR อ่านใบเสร็จ
AI financial advisor
Shared wallet
Recurring transaction
Notification system

ฟีเจอร์เหล่านี้สามารถเพิ่มในเวอร์ชันถัดไปได้หลังจาก MVP เสถียรแล้ว

25. Future Enhancements

หลังจาก MVP เสร็จ สามารถต่อยอดได้ดังนี้:

Recurring transactions
CSV bank statement import
PDF monthly report export
AI-generated spending insights
Multi-currency support
Shared household budget
Mobile responsive PWA
Email notification
Spending anomaly detection
Financial goal tracking

26. Risk Assessment
| Risk                     | Impact | Mitigation                               |
| ------------------------ | ------ | ---------------------------------------- |
| Scope creep              | High   | Lock MVP scope before development        |
| Poor data modeling       | High   | Design ERD before coding                 |
| Weak authentication      | High   | Use bcrypt, JWT expiry, protected routes |
| Dashboard query too slow | Medium | Add indexes and aggregate queries        |
| Inconsistent UI          | Medium | Use component library and design system  |
| Deployment issues        | Medium | Deploy early with simple version         |
| Lack of testing          | Medium | Test critical business logic first       |

27. Definition of Done

แต่ละ feature จะถือว่าเสร็จเมื่อ:

Code ผ่าน lint
ไม่มี TypeScript error
API มี validation ครบ
มี error handling
UI รองรับ loading, error และ empty state
ข้อมูลถูกจำกัดตาม user ที่ login
ทดสอบ manual flow เรียบร้อย
Merge เข้า develop ผ่าน Pull Request
Update documentation ถ้ามี endpoint หรือ behavior ใหม่
28. Final Deliverables

เมื่อจบโปรเจก ควรมีสิ่งต่อไปนี้:

Source code frontend
Source code backend
Database schema
API documentation
README setup guide
ER Diagram
Screenshots
Live demo URL
Demo account
Short project presentation
Deployment documentation
29. Success Criteria

โปรเจกจะถือว่าสำเร็จเมื่อ:

ผู้ใช้สมัครสมาชิกและเข้าสู่ระบบได้
ผู้ใช้สามารถจัดการรายรับรายจ่ายได้ครบ CRUD
Dashboard แสดงข้อมูลสรุปถูกต้อง
กราฟแสดงผลจากข้อมูลจริง
ผู้ใช้สามารถตั้งงบประมาณและดูสถานะการใช้งบได้
ระบบแยกข้อมูลของผู้ใช้แต่ละคนอย่างปลอดภัย
โปรเจกสามารถ deploy และใช้งานจริงผ่าน URL ได้
โค้ดมีโครงสร้างชัดเจน อ่านง่าย และต่อยอดได้

30. Recommended Development Priority

ลำดับการทำงานที่แนะนำ:

1. Project setup
2. Database schema
3. Authentication
4. Category management
5. Transaction CRUD
6. Dashboard summary
7. Charts
8. Budget management
9. Reports
10. Export CSV
11. Testing
12. Deployment
13. Documentation

Summary

MoneyMind เป็น Web Application สำหรับจัดการรายรับรายจ่ายส่วนบุคคลที่มี scope ชัดเจน เหมาะสำหรับการพัฒนาเป็นโปรเจกจบหรือ Portfolio โดยควรเริ่มจาก MVP ที่ประกอบด้วย Authentication, Transaction CRUD, Category, Dashboard, Charts และ Budget Management ก่อน จากนั้นจึงค่อยต่อยอดไปยัง Reports, Export, CSV Import และ AI Insight ในอนาคต