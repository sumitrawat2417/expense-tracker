import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load our secret variables from the .env file
dotenv.config();

// Create a connection pool to our PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection immediately
pool.connect()
  .then(() => console.log('✅ Successfully connected to the local PostgreSQL database!'))
  .catch((err) => console.error('❌ Database connection error:', err.message));

export default pool;