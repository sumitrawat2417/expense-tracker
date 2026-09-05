# 💸 Expense Tracker (Real-World SaaS)

## 1. Project Description
**Expense Tracker** is a full-stack, multi-tenant web application designed for securely recording, managing, and analyzing personal expenses. What started as a foundational project has evolved into a production-ready application featuring robust JWT Authentication, a serverless PostgreSQL database (Neon), and a premium glassmorphism user interface.

## 2. Features
* **Multi-Tenant Architecture**: Complete data isolation. Users can sign up, log in, and securely manage their own private data.
* **JWT Authentication**: Passwords are mathematically hashed with `bcryptjs`, and sessions are managed securely using JSON Web Tokens.
* **Full CRUD Functionality**: Create, Read, Update, and Delete your expenses.
* **Dynamic Search & Filtering**: Fuzzy search (`ILIKE`) and category filtering that instantly updates the UI.
* **Real-time Spending Summaries**: Instantly calculates total spending and categorizes breakdowns.
* **Premium Glassmorphism UI**: A gorgeous, modern, 2-column responsive layout built from scratch with custom CSS and typography.

## 3. Architecture
The application follows a standard three-tier architecture:
```text
┌─────────────────────┐
│      Browser        │ (React + TypeScript + CSS Modules)
└──────────┬──────────┘
           │ HTTP/REST (Protected by JWT Bearer Tokens)
           ▼
┌─────────────────────┐
│     Backend API     │ (Node.js + Express)
└──────────┬──────────┘
           │ SQL
           ▼
┌─────────────────────┐
│ Neon Serverless DB  │ (PostgreSQL)
└─────────────────────┘
```

The backend is separated logically into `Routes → Middleware (Auth) → Controllers → Services → Repositories → Database`, ensuring clean maintainability and separation of concerns.

## 4. Technology Stack
* **Frontend:** React, TypeScript, Vite, Vanilla CSS (Glassmorphism)
* **Backend:** Node.js, Express, TypeScript, `jsonwebtoken`, `bcryptjs`
* **Database:** PostgreSQL (Hosted on Neon)
* **Version Control:** Git & GitHub

## 5. Database Schema
**Table:** `users`
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique user identifier (Primary Key) |
| `email` | VARCHAR(255) | Unique email |
| `password_hash` | VARCHAR(255) | Bcrypt hashed password |
| `created_at` | TIMESTAMPTZ | Account creation time |

**Table:** `expenses`
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique expense identifier (Primary Key) |
| `user_id` | UUID | Foreign Key linking to `users` |
| `amount` | NUMERIC(10,2) | Expense amount |
| `category` | VARCHAR(100) | Expense category |
| `description` | TEXT | Optional description |
| `expense_date` | TIMESTAMP | Date of the expense |

## 6. Installation Instructions
1. Clone the repository: `git clone https://github.com/sumitrawat2417/expense-tracker.git`
2. Navigate to the project directory: `cd expense-tracker`
3. Install frontend dependencies: `cd frontend && npm install`
4. Install backend dependencies: `cd ../backend && npm install`

## 7. Environment Variables
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://your_db_user:password@your_neon_host.aws.neon.tech/neondb?sslmode=require
PORT=3000
JWT_SECRET=super_secret_auth_key_for_expense_tracker
```
**Note:** Never commit the `.env` file to version control.

## 8. Running Locally
1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend server: `cd frontend && npm run dev`
3. Open your browser and navigate to `http://localhost:5173`.
4. Create an account and start tracking!

## 9. Future Improvements
* Advanced financial analytics, monthly budgets, and chart visualizations (e.g. Chart.js or Recharts)
* CSV Import/Export functionality
* Automatic cloud deployment via Vercel and Render
