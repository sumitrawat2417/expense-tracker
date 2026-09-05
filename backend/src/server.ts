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

// 2. CREATE A NEW EXPENSE
app.post('/api/expenses', async (req, res) => {
  try {
    // req.body contains the JSON data the customer sent us (amount, category, etc.)
    const { amount, category, description, expense_date } = req.body;

    // This is the exact same SQL we used in test-db.ts!
    const insertQuery = `
      INSERT INTO expenses (amount, category, description, expense_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [amount, category, description, expense_date];

    // Tell the database to run the query
    const result = await pool.query(insertQuery, values);

    // Send the newly created expense back to the customer with a 201 (Created) status
    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running and listening on http://localhost:${PORT}`);
});
