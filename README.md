# Expense Tracker

## 1. Project Description
**Expense Tracker** is a full-stack web application designed for recording, managing, and analyzing personal expenses. Built as a foundational software engineering exercise, the core objective of this project is to learn and implement the complete request-to-database-to-response lifecycle, encompassing frontend, backend, REST API, and PostgreSQL concepts.

## 2. Problem Statement
Managing personal finances can be disorganized. Many existing apps are either too complex or hide their architecture from developers. This project solves two problems: it provides a simple interface to manage personal spending, while simultaneously serving as a hands-on learning environment for full-stack engineering, emphasizing database design, REST APIs, and application architecture.

## 3. Features
* **Create, View, Edit, and Delete Expenses**
* **Categorize Expenses** (e.g., Food, Transport, Shopping, Bills)
* **Track Total Spending** dynamically based on database records
* **Filter and Search Expenses** by category, date, and text
* **Expense Summaries** to visualize spending per category

## 4. Screenshots
*(Screenshots will be added once the application UI is fully developed)*

## 5. Architecture
The application follows a standard three-tier architecture:
```text
┌─────────────────────┐
│      Browser        │ (React + TypeScript)
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│     Backend API     │ (Node.js + Express)
└──────────┬──────────┘
           │ SQL
           ▼
┌─────────────────────┐
│     PostgreSQL      │
└─────────────────────┘
```

The backend is further separated logically into Routes → Controllers → Services → Repositories → Database, ensuring clean maintainability and separation of concerns.

## 6. Technology Stack
* **Frontend:** React, TypeScript, Vite, HTML, CSS
* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL
* **Tools:** Git, GitHub, VS Code, API Testing (e.g., Postman)

## 7. Database Schema
**Table:** `expenses`
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique expense identifier (Primary Key) |
| `amount` | NUMERIC(12,2) | Expense amount |
| `category` | VARCHAR(50) | Expense category |
| `description` | TEXT | Optional description |
| `expense_date` | DATE | Date of the expense |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last modification time |

## 8. API Documentation
* **POST `/api/expenses`**: Create an expense
* **GET `/api/expenses`**: Retrieve all expenses (supports `category`, `from`, `to`, `search` query parameters)
* **GET `/api/expenses/:id`**: Retrieve a single expense by ID
* **PATCH `/api/expenses/:id`**: Update an expense
* **DELETE `/api/expenses/:id`**: Delete an expense
* **GET `/api/summary`**: Retrieve total spending and category summaries

## 9. Installation Instructions
1. Clone the repository: `git clone https://github.com/sumitrawat2417/expense-tracker.git`
2. Navigate to the project directory: `cd expense-tracker`
3. Install frontend dependencies: `cd frontend && npm install`
4. Install backend dependencies: `cd ../backend && npm install`

## 10. Environment Variables
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
PORT=3000
```
**Note:** Never commit the `.env` file to version control.

## 11. Running Locally
1. Start the PostgreSQL database and ensure it's running.
2. Run database migrations (instructions to be added during development).
3. Start the backend server: `cd backend && npm run dev`
4. Start the frontend server: `cd frontend && npm run dev`
5. Open your browser and navigate to the local frontend URL (usually `http://localhost:5173`).

## 12. Testing
* **Backend:** Run unit and integration tests using `npm test` inside the backend directory.
* **Frontend:** Run component tests using `npm test` inside the frontend directory.
* **API Testing:** Use Postman or a similar tool to verify endpoint functionality.

## 13. Deployment
*(Deployment instructions will be finalized in Phase 9 of the roadmap. The application can be containerized with Docker and hosted on standard cloud providers).*

## 14. Limitations (MVP Scope)
* Single-user only (No Authentication initially)
* No automatic bank imports or AI categorization
* No advanced real-time synchronization
* Only core REST architecture (no microservices/Kubernetes yet)

## 15. Future Improvements
* Multi-user support with secure authentication (JWT)
* Advanced financial analytics, monthly budgets, and chart visualizations
* CSV Import/Export functionality
* Email or push notification reminders for recurring expenses

## 16. License
This project is licensed under the MIT License.
