import pool from '../db/database.js';

/**
 * The Repository is the ONLY layer allowed to communicate with the database.
 * It does not care about HTTP requests or business logic, it only runs SQL queries.
 */
export const expenseRepository = {
  
  // 1. Fetch all expenses
  getAllExpenses: async () => {
    const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    return result.rows;
  },

  // 2. Add a new expense
  createExpense: async (amount: number, category: string, description: string, expense_date: string) => {
    const insertQuery = `
      INSERT INTO expenses (amount, category, description, expense_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [amount, category, description, expense_date];
    const result = await pool.query(insertQuery, values);
    return result.rows[0];
  },

  // 3. Delete an expense
  deleteExpense: async (id: string) => {
    const deleteQuery = 'DELETE FROM expenses WHERE id = $1 RETURNING *;';
    const result = await pool.query(deleteQuery, [id]);
    
    if (result.rowCount === 0) {
      return null; // Return null if nothing was deleted
    }
    
    return result.rows[0];
  }
};
