import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/database.js';

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

// 1. GET ALL EXPENSES
app.get('/api/expenses', async (req, res) => {
  try {
    // Ask the database for all expenses, newest first
    const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    
    // Send the database rows back to the frontend as JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running and listening on http://localhost:${PORT}`);
});
