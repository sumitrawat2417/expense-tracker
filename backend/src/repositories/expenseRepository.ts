import pool from '../db/database.js';

/**
 * The Repository is the ONLY layer allowed to communicate with the database.
 * It does not care about HTTP requests or business logic, it only runs SQL queries.
 */
export const expenseRepository = {
  
  // 1. Fetch all expenses (with optional filtering)
  getAllExpenses: async (category?: string, search?: string) => {
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const values: string[] = [];

    // If a category was provided, add it to the SQL query
    if (category) {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }

    // If a search term was provided, add a fuzzy search (ILIKE) to the SQL query
    if (search) {
      values.push(`%${search}%`); // The % signs mean "match anything before or after"
      query += ` AND description ILIKE $${values.length}`;
    }

    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, values);
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
  },

  // 4. Get total spending summary
  getTotalSpending: async () => {
    const result = await pool.query('SELECT SUM(amount) AS total FROM expenses;');
    // COALESCE handles the case where there are no rows yet
    return result.rows[0].total || 0;
  },

  // 5. Update an expense
  updateExpense: async (id: string, amount: number, category: string, description: string, expense_date: string) => {
    const updateQuery = `
      UPDATE expenses 
      SET amount = $1, category = $2, description = $3, expense_date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const values = [amount, category, description, expense_date, id];
    const result = await pool.query(updateQuery, values);
    
    if (result.rowCount === 0) {
      return null; // Return null if nothing was updated
    }
    
    return result.rows[0];
  },

  // 6. Get spending breakdown by category
  getCategoryBreakdown: async () => {
    const query = `
      SELECT category, SUM(amount) as total 
      FROM expenses 
      GROUP BY category 
      ORDER BY total DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
};
