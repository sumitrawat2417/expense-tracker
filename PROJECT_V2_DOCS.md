# 💸 Expense Tracker - Project Documentation v2

## 1. The Journey: From Starter Project to SaaS

This document chronicles the evolution of the **Expense Tracker**. What began as a foundational Software Development Engineering (SDE) exercise to learn full-stack architecture has evolved into a production-ready, multi-tenant Software as a Service (SaaS). 

### Phase 1: The Minimum Viable Product (MVP)
* **Goal:** Understand the "Request → Controller → Database → Response" lifecycle.
* **What we did:** Built a single-column React frontend and an Express.js backend.
* **Database:** Created a single `expenses` table in a serverless Neon PostgreSQL database.
* **Limitations:** The app was a "public whiteboard." Anyone who accessed the URL shared the exact same database. There was no concept of privacy or user identity.

### Phase 2: The UI/UX Overhaul
* **Goal:** Elevate the application from a "developer tool" to a "consumer product."
* **What we did:** 
  * Replaced default fonts with the premium **Poppins** typeface.
  * Implemented a modern **Glassmorphism** design system with frosted glass panels, deep box shadows, and subtle micro-animations on hover.
  * Re-architected the UI into a responsive **2-Column Grid** for desktop, separating the data-entry form from the data visualization dashboard.
  * Fixed clipping bugs and layout thrashing to ensure a buttery-smooth scrolling experience.

### Phase 3: Search, Filtering, and Full CRUD
* **Goal:** Allow users to manipulate and navigate their data efficiently.
* **What we did:** 
  * **Update (The 'U' in CRUD):** Added the ability to seamlessly edit an existing expense without deleting and recreating it.
  * **Dynamic SQL Queries:** Updated the backend repository to build SQL statements dynamically, supporting optional `category` filters and fuzzy `ILIKE` searches directly against the PostgreSQL database.

### Phase 4: Real-World Architecture (Multi-Tenancy)
* **Goal:** Secure the application for real-world deployment, supporting thousands of isolated users.
* **What we did:** 
  * **Database Redesign:** Dropped the public table, created a new `users` table, and linked every expense to a specific user using a `user_id` Foreign Key.
  * **Encryption:** Integrated `bcryptjs` to mathematically hash all user passwords. 
  * **JWT Authentication:** Implemented JSON Web Tokens (JWT) to manage user sessions.
  * **The Auth Bouncer:** Built custom Express middleware to intercept all API requests and validate the JWT Bearer token before allowing access to the database.
  * **Data Isolation:** Refactored every single database query to include `WHERE user_id = $1`, guaranteeing total data privacy.

---

## 2. Current Architecture (v2)

### The Frontend (React)
The frontend is a Single Page Application (SPA) built with React and Vite. It heavily relies on React Hooks (`useState`, `useEffect`) to manage state and fetch data. 

**Authentication Flow:**
1. The app checks `localStorage` for a JWT token on load.
2. If no token exists, the user is locked out and presented with a Glassmorphism Login/Signup form.
3. Upon successful login, the token is saved, and the React state re-renders to show the protected dashboard.
4. Every subsequent `fetch()` request automatically attaches the token in the HTTP Headers: `Authorization: Bearer <token>`.

### The Backend (Node/Express)
The backend is strictly typed with TypeScript and separated by architectural layers:
* **Routes:** The "Receptionist". Directs incoming HTTP traffic (e.g., `/api/auth`, `/api/expenses`).
* **Middleware:** The "Bouncer". Validates JWT tokens and attaches the `user_id` to the request object.
* **Controllers:** The "Waiters". Extract data from the HTTP Request body/params and pass it to the Services.
* **Services:** The "Managers". Handle business logic (e.g., checking if an email is already registered, hashing passwords).
* **Repositories:** The "Chefs". The *only* files allowed to speak SQL. They execute parameterized queries against the Neon Postgres database.

---

## 3. What We Learned

1. **Security is Built-In, Not Bolted On:** Implementing Authentication required us to touch almost every file in the backend. It fundamentally changes how you query a database.
2. **The Power of Parameterized Queries:** By using `$1`, `$2` in our `pg` queries, we protected the application from SQL Injection attacks.
3. **Stateless Authentication:** Using JWTs means our server doesn't need to remember who is logged in. The token itself mathematically proves the user's identity, allowing the server to scale infinitely.
4. **CSS is Powerful:** We didn't need heavy UI libraries to create a stunning application. By mastering Flexbox, CSS Grid, and backdrop-filters, we built a bespoke premium experience.

---
*Document prepared on September 5, 2026. Expense Tracker v2.0.*
