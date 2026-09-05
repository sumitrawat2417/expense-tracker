import pool from './database.js';

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS expenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      amount NUMERIC(12, 2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      expense_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

async function initializeDatabase() {
  try {
    console.log('⏳ Creating expenses table...');
    
    // Execute our SQL query against the connected database
    await pool.query(createTableQuery);
    
    console.log('✅ Table created successfully!');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    // Close the connection so the script finishes
    await pool.end();
  }
}

initializeDatabase();
