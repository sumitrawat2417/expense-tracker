import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expenseRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';

// Load variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
// cors() allows our React frontend to communicate with this backend securely
app.use(cors());
// express.json() allows us to read JSON data sent from the frontend (like a new expense)
app.use(express.json());

// --- ROUTES ---
// Auth Routes (Public)
app.use('/api/auth', authRoutes);

// Expense Routes (Protected by our new Bouncer!)
app.use('/api/expenses', authenticateToken, expenseRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running and listening on http://localhost:${PORT}`);
});
