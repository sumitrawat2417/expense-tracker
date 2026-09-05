# Expense Tracker

## 1. Project Overview

**Expense Tracker** is a full-stack web application for recording, managing, and analyzing personal expenses.

The project is designed as the first project in a software-development learning roadmap. The goal is not only to build a working expense tracker, but to learn the engineering concepts required to build maintainable full-stack applications.

The application will run in a web browser. The browser will communicate with a backend REST API, and the backend will store expense data in PostgreSQL.

### Core Architecture

```text
┌─────────────────────┐
│      Browser        │
│  React + TypeScript │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│     Backend API     │
│ Node.js + Express   │
│     + TypeScript    │
└──────────┬──────────┘
           │ SQL
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│      Database       │
└─────────────────────┘
```

---

# 2. Project Goals

The project has two goals:

### Product Goal

Provide a simple application that allows a user to:

- Add expenses
- View expenses
- Edit expenses
- Delete expenses
- Categorize expenses
- Track total spending
- Filter and search expenses
- View basic spending summaries

### Learning Goal

Use the project to learn:

- Frontend development
- Backend development
- REST APIs
- HTTP request/response flow
- CRUD operations
- PostgreSQL and SQL
- Database design
- Data validation
- Error handling
- Application architecture
- Testing
- Git and GitHub
- Environment variables
- Deployment
- Basic production practices

---

# 3. Target User

The initial application is designed for a single user managing their personal expenses.

Authentication is **not required for the MVP**.

Authentication can be introduced in a later version after the core application is stable.

---

# 4. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- HTML
- CSS
- Fetch API or an HTTP client

## Backend

- Node.js
- Express
- TypeScript

## Database

- PostgreSQL

## Development Tools

- Git
- GitHub
- VS Code
- Postman or equivalent API testing tool

## Later Tools

- Docker
- Docker Compose
- CI/CD
- Cloud hosting

The project should avoid unnecessary technologies during the first implementation. The purpose is to understand the fundamentals rather than hide them behind a large framework or managed platform.

---

# 5. Functional Requirements

## FR-01: Create Expense

The user must be able to create an expense.

Required information:

- Amount
- Category
- Description
- Expense date

Example:

```text
Amount: ₹250
Category: Food
Description: Lunch
Date: 2026-09-06
```

---

## FR-02: View Expenses

The user must be able to view all recorded expenses.

Each expense should display:

- Amount
- Category
- Description
- Date
- Created date

Expenses should normally be displayed with the newest expense first.

---

## FR-03: View Single Expense

The system should provide an API endpoint for retrieving one expense by its ID.

Example:

```http
GET /api/expenses/:id
```

---

## FR-04: Edit Expense

The user must be able to modify an existing expense.

The user should be able to change:

- Amount
- Category
- Description
- Expense date

---

## FR-05: Delete Expense

The user must be able to delete an expense.

The UI should request confirmation before deleting an expense.

---

## FR-06: Calculate Total Spending

The application must calculate total expenses.

Example:

```text
Total Spending
₹12,450
```

The calculation should be based on database records rather than a hard-coded value.

---

## FR-07: Categories

The system must support expense categories.

Initial categories:

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Other

The category system should be designed so additional categories can be added later.

---

## FR-08: Filter Expenses

The user should be able to filter expenses by:

- Category
- Date
- Date range

Example:

```text
Category: Food
From: 2026-09-01
To: 2026-09-06
```

---

## FR-09: Search Expenses

The user should be able to search expenses using text.

The search should initially cover:

- Description
- Category

Example:

```text
Search: "lunch"
```

---

## FR-10: Expense Summary

The application should provide basic summaries.

Examples:

```text
Total Spending: ₹12,450

Food:          ₹4,200
Transport:     ₹2,100
Shopping:      ₹3,000
Bills:         ₹2,150
Other:         ₹1,000
```

This feature can initially be implemented after the basic CRUD functionality is complete.

---

# 6. Non-Functional Requirements

## NFR-01: Usability

The interface should be simple enough that a user can add an expense without instructions.

## NFR-02: Responsiveness

The application should work on:

- Desktop
- Tablet
- Mobile browser

## NFR-03: Validation

Invalid data must be rejected.

Examples:

- Amount cannot be negative.
- Amount cannot be zero.
- Required fields cannot be empty.
- Expense date must be valid.
- ID must be valid when accessing a specific expense.

## NFR-04: Error Handling

The application must handle:

- Invalid requests
- Missing records
- Database errors
- Server errors
- Network failures

The backend should return appropriate HTTP status codes.

## NFR-05: Security

The application must:

- Validate incoming data.
- Never expose database credentials to the frontend.
- Store secrets in environment variables.
- Use parameterized SQL queries.
- Avoid trusting user input.
- Configure CORS appropriately.

## NFR-06: Maintainability

Frontend, backend, database, and shared concerns should be separated logically.

The project should not become one large source file.

---

# 7. Database Design

## Expenses Table

Initial schema:

```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique expense identifier |
| `amount` | NUMERIC(12,2) | Expense amount |
| `category` | VARCHAR(50) | Expense category |
| `description` | TEXT | Optional description |
| `expense_date` | DATE | Date of the expense |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last modification time |

### Important Database Rules

- Use `NUMERIC`, not floating-point types, for monetary values.
- `id` must be unique.
- `amount` must be greater than zero.
- Required fields must use `NOT NULL`.
- Database constraints should complement backend validation.

---

# 8. API Design

Base API path:

```text
/api
```

## Create Expense

```http
POST /api/expenses
```

Request:

```json
{
  "amount": 250.00,
  "category": "Food",
  "description": "Lunch",
  "expenseDate": "2026-09-06"
}
```

Response:

```json
{
  "id": "uuid",
  "amount": 250.00,
  "category": "Food",
  "description": "Lunch",
  "expenseDate": "2026-09-06",
  "createdAt": "2026-09-06T10:00:00Z",
  "updatedAt": "2026-09-06T10:00:00Z"
}
```

Expected status:

```text
201 Created
```

---

## Get Expenses

```http
GET /api/expenses
```

Possible query parameters:

```text
GET /api/expenses?category=Food
GET /api/expenses?from=2026-09-01&to=2026-09-06
GET /api/expenses?search=lunch
```

Expected status:

```text
200 OK
```

---

## Get Single Expense

```http
GET /api/expenses/:id
```

Expected responses:

```text
200 OK
404 Not Found
```

---

## Update Expense

```http
PATCH /api/expenses/:id
```

Request:

```json
{
  "amount": 300.00,
  "description": "Lunch and coffee"
}
```

Expected responses:

```text
200 OK
400 Bad Request
404 Not Found
```

---

## Delete Expense

```http
DELETE /api/expenses/:id
```

Expected responses:

```text
204 No Content
404 Not Found
```

---

## Summary API

Later version:

```http
GET /api/summary
```

Possible query:

```text
GET /api/summary?from=2026-09-01&to=2026-09-30
```

Example response:

```json
{
  "total": 12450.00,
  "count": 42,
  "byCategory": {
    "Food": 4200.00,
    "Transport": 2100.00,
    "Shopping": 3000.00,
    "Bills": 2150.00,
    "Other": 1000.00
  }
}
```

---

# 9. HTTP Status Codes

The API should use meaningful HTTP status codes.

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created |
| `204` | Successful deletion with no response body |
| `400` | Invalid request |
| `404` | Resource not found |
| `500` | Unexpected server error |

---

# 10. Frontend Requirements

The frontend should initially contain:

## Dashboard

Display:

- Total spending
- Number of expenses
- Recent expenses
- Category summary

## Expense Form

Fields:

```text
Amount
Category
Description
Date
[Add Expense]
```

## Expense List

Each expense should provide:

```text
Food
Lunch
₹250
06 Sep 2026

[Edit] [Delete]
```

## Filters

Provide:

```text
Search
Category
Start Date
End Date
```

## Loading State

The UI should clearly indicate when data is being loaded.

## Empty State

If no expenses exist:

```text
No expenses found.
Add your first expense to get started.
```

## Error State

If an API request fails, show a useful error message instead of silently failing.

---

# 11. Suggested Frontend Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── ExpenseItem.tsx
│   │   ├── ExpenseFilters.tsx
│   │   └── SummaryCard.tsx
│   │
│   ├── pages/
│   │   └── Dashboard.tsx
│   │
│   ├── services/
│   │   └── expenseApi.ts
│   │
│   ├── types/
│   │   └── expense.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── tsconfig.json
```

The exact structure can change as the project grows.

---

# 12. Suggested Backend Structure

```text
backend/
├── src/
│   ├── controllers/
│   │   └── expenseController.ts
│   │
│   ├── routes/
│   │   └── expenseRoutes.ts
│   │
│   ├── services/
│   │   └── expenseService.ts
│   │
│   ├── repositories/
│   │   └── expenseRepository.ts
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   │
│   ├── db/
│   │   └── database.ts
│   │
│   ├── types/
│   │   └── expense.ts
│   │
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Responsibility Separation

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

This separation is intentionally introduced to teach backend architecture.

---

# 13. Project Repository Structure

The GitHub repository can use:

```text
expense-tracker/
├── frontend/
├── backend/
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── api.md
│
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

Docker files can be added later.

---

# 14. Development Phases

## Phase 0 — Project Setup

Tasks:

- Create Git repository
- Create frontend
- Create backend
- Configure TypeScript
- Create PostgreSQL database
- Configure environment variables
- Create initial project structure

Deliverable:

```text
Browser → Backend → PostgreSQL
```

with a working connection.

---

## Phase 1 — Database

Tasks:

- Create `expenses` table
- Create migration/schema
- Test database connection
- Insert test record
- Read test record

Deliverable:

Working PostgreSQL persistence.

---

## Phase 2 — Backend CRUD

Implement:

- POST expense
- GET expenses
- GET expense by ID
- PATCH expense
- DELETE expense

Test all endpoints independently.

Deliverable:

Complete REST API.

---

## Phase 3 — Validation

Add validation for:

- Amount
- Category
- Description
- Date
- UUID

Test invalid requests.

Deliverable:

API rejects bad data correctly.

---

## Phase 4 — Frontend

Build:

- Dashboard
- Expense form
- Expense list
- Edit UI
- Delete UI
- Loading states
- Error states

Deliverable:

Complete browser-based application.

---

## Phase 5 — Filtering and Search

Add:

- Category filter
- Date range
- Search
- Sorting

Deliverable:

Useful expense management interface.

---

## Phase 6 — Analytics

Add:

- Total spending
- Number of expenses
- Category totals
- Date-based summaries

Charts can be introduced here.

Deliverable:

Basic financial analytics.

---

## Phase 7 — Testing

Add:

### Backend tests

- Create expense
- Retrieve expense
- Update expense
- Delete expense
- Invalid expense
- Missing expense

### Frontend tests

- Form validation
- Expense rendering
- Loading state
- Error state

Deliverable:

Automated test suite.

---

## Phase 8 — Production Preparation

Add:

- Environment variables
- Production configuration
- Logging
- Error handling
- CORS configuration
- Database migrations
- Docker
- CI/CD

Deliverable:

Application ready for deployment.

---

## Phase 9 — Deployment

Possible deployment architecture:

```text
                 Internet
                    │
                    ▼
             ┌─────────────┐
             │   Browser   │
             └──────┬──────┘
                    │ HTTPS
                    ▼
             ┌─────────────┐
             │   Frontend  │
             └──────┬──────┘
                    │ API
                    ▼
             ┌─────────────┐
             │   Backend   │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │ PostgreSQL  │
             └─────────────┘
```

The specific hosting provider can be selected after the application is production-ready.

---

# 15. Version Roadmap

The project should be developed incrementally.

## v0.1 — Basic Application

- React frontend
- Backend server
- PostgreSQL
- Create expense
- List expenses

## v0.2 — Complete CRUD

- Edit
- Delete
- Get single expense

## v0.3 — Validation

- Backend validation
- Frontend validation
- Error handling

## v0.4 — Filtering

- Search
- Category filtering
- Date filtering
- Sorting

## v0.5 — Analytics

- Total spending
- Category totals
- Monthly summaries
- Charts

## v0.6 — Testing

- Unit tests
- Integration tests
- API tests
- Frontend tests

## v0.7 — Production

- Logging
- Environment configuration
- Docker
- CI/CD
- Deployment

## v0.8 — Authentication

Optional future feature:

- Registration
- Login
- Password hashing
- Sessions/JWT
- User-specific expenses

Authentication should not be added until the core system is understood and working.

---

# 16. Security Requirements

Even though this is a learning project, basic security practices are required.

### Never commit secrets

Do not commit:

```text
DATABASE_PASSWORD
API_KEYS
JWT_SECRET
```

Use:

```text
.env
```

and provide:

```text
.env.example
```

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
PORT=3000
```

The real `.env` file must be included in `.gitignore`.

### SQL Injection Protection

Do not construct SQL using string concatenation.

Bad:

```text
SELECT * FROM expenses WHERE id = '${id}'
```

Use parameterized queries instead.

---

# 17. Testing Strategy

Testing should be introduced progressively.

## Unit Tests

Test individual functions.

Example:

```text
calculateTotal()
validateExpense()
formatExpense()
```

## Integration Tests

Test:

```text
API → Service → Database
```

Example:

```text
POST /api/expenses
        ↓
Database
        ↓
Created expense
```

## API Testing

Test endpoints with Postman or an equivalent tool.

## Manual UI Testing

Verify:

- Create
- Edit
- Delete
- Search
- Filter
- Error states
- Mobile layout

---

# 18. Git Strategy

Git should be used from the beginning.

Example commits:

```text
chore: initialize repository
feat: create React frontend
feat: create Express backend
feat: connect PostgreSQL database
feat: add expense database schema
feat: implement create expense API
feat: implement expense listing API
feat: implement expense update API
feat: implement expense deletion API
feat: add expense form
feat: add expense list
feat: add expense filtering
fix: reject negative expense amounts
test: add expense API tests
docs: add API documentation
```

Avoid commits such as:

```text
update
changes
final
new
stuff
```

Commits should describe what changed.

---

# 19. README Requirements

The final GitHub README should contain:

1. Project title
2. Project description
3. Problem statement
4. Features
5. Screenshots
6. Architecture
7. Technology stack
8. Database schema
9. API documentation
10. Installation instructions
11. Environment variables
12. Running locally
13. Testing
14. Deployment
15. Limitations
16. Future improvements
17. License

---

# 20. Documentation Requirements

The repository should eventually contain:

```text
docs/
├── architecture.md
├── database.md
├── api.md
├── decisions.md
└── testing.md
```

### `architecture.md`

Explain:

- Frontend
- Backend
- Database
- Request flow
- Responsibilities of each layer

### `database.md`

Explain:

- Tables
- Columns
- Constraints
- Relationships
- Indexes
- Migrations

### `api.md`

Document:

- Endpoints
- Request bodies
- Responses
- Status codes
- Errors

### `decisions.md`

Record important technical decisions.

Example:

```text
Decision:
Use PostgreSQL instead of browser localStorage.

Reason:
The project is intended to teach database-backed application architecture.
```

---

# 21. Out of Scope for MVP

The following should **not** be implemented initially:

- Authentication
- Multi-user support
- Bank account integration
- Automatic transaction imports
- AI expense categorization
- Payment gateway
- Complex budgeting
- Investment tracking
- Cryptocurrency tracking
- Mobile native application
- Microservices
- Kubernetes
- Real-time synchronization

These can be considered only after the core application is complete.

---

# 22. Future Features

Potential future versions:

### Personal Finance

- Monthly budgets
- Recurring expenses
- Income tracking
- Savings goals
- Budget alerts

### Advanced Analytics

- Monthly comparison
- Spending trends
- Category trends
- Custom reports

### Multi-user

- Authentication
- User profiles
- User-specific data
- Roles and permissions

### Import/Export

- CSV import
- CSV export
- JSON export
- Backup and restore

### Notifications

- Budget alerts
- Recurring expense reminders
- Monthly reports

---

# 23. Definition of Done

The project is considered complete when:

### Functionality

- [ ] User can create expenses
- [ ] User can view expenses
- [ ] User can edit expenses
- [ ] User can delete expenses
- [ ] User can search expenses
- [ ] User can filter expenses
- [ ] Total spending is calculated
- [ ] Category summaries work

### Backend

- [ ] REST API implemented
- [ ] Validation implemented
- [ ] Error handling implemented
- [ ] PostgreSQL connected
- [ ] SQL queries use parameters
- [ ] API tested

### Frontend

- [ ] Responsive UI
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Form validation
- [ ] API integration

### Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] API tests
- [ ] Critical UI tests

### GitHub

- [ ] Clean repository
- [ ] Meaningful commits
- [ ] README
- [ ] Architecture documentation
- [ ] API documentation
- [ ] Database documentation
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] License

### Deployment

- [ ] Production build works
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database deployed
- [ ] HTTPS enabled
- [ ] Environment variables configured

---

# 24. Learning Outcomes

After completing this project properly, the developer should understand:

```text
Browser
   ↓
HTTP Request
   ↓
REST API
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
SQL
   ↓
PostgreSQL
```

and the reverse path:

```text
PostgreSQL
   ↓
Backend
   ↓
JSON Response
   ↓
Frontend
   ↓
React State
   ↓
UI
```

The project should therefore be treated as a **software engineering exercise**, not simply as an expense-tracking UI.

---

# 25. Project Success Criteria

The project succeeds if the developer can explain, without relying on a tutorial:

- How the browser communicates with the backend
- What an HTTP request is
- How REST endpoints work
- How CRUD operations work
- How PostgreSQL stores the data
- How SQL queries retrieve and modify data
- Why validation exists at multiple layers
- How errors travel from the backend to the frontend
- Why secrets must not be stored in frontend code
- How the frontend and backend are separated
- How the application can be tested
- How the application can be deployed

The primary objective is **understanding the complete request-to-database-to-response lifecycle**.

---

# 26. Initial MVP Checklist

Before adding advanced features, complete only this:

```text
[ ] Create repository
[ ] Initialize React + TypeScript frontend
[ ] Initialize Node.js + Express + TypeScript backend
[ ] Install/configure PostgreSQL
[ ] Connect backend to PostgreSQL
[ ] Create expenses table
[ ] Implement POST /api/expenses
[ ] Implement GET /api/expenses
[ ] Implement GET /api/expenses/:id
[ ] Implement PATCH /api/expenses/:id
[ ] Implement DELETE /api/expenses/:id
[ ] Add backend validation
[ ] Build expense form
[ ] Build expense list
[ ] Connect frontend to API
[ ] Add edit functionality
[ ] Add delete functionality
[ ] Add total spending
[ ] Add basic error/loading states
[ ] Test the complete flow
```

Only after this MVP works should filtering, analytics, testing, Docker, CI/CD, and authentication be added.
