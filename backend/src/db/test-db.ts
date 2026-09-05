import pool from './database.js';

async function testDatabase() {
    try {
        console.log('⏳ Inserting a test expense...');

        // 1. Create a dummy expense record
        const insertQuery = `
      INSERT INTO expenses (amount, category, description, expense_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        // We use an array of values to protect against SQL Injection hackers!
        const values = [45.50, 'Food', 'Dinner with a friend', '2023-10-15'];

        const insertResult = await pool.query(insertQuery, values);
        console.log('✅ Expense Inserted:', insertResult.rows[0]);

        console.log('\n⏳ Reading from the database...');

        // 2. Read the record back out
        const selectQuery = 'SELECT * FROM expenses ORDER BY created_at DESC LIMIT 1;';
        const selectResult = await pool.query(selectQuery);

        console.log('✅ Latest Expense in Database:');
        console.table(selectResult.rows);

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        await pool.end(); // Always close the connection!
    }
}

testDatabase();
