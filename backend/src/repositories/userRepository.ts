import pool from '../db/database.js';

export const userRepository = {
  createUser: async (email: string, passwordHash: string) => {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at;
    `;
    const result = await pool.query(query, [email, passwordHash]);
    return result.rows[0];
  },

  getUserByEmail: async (email: string) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0]; // Returns undefined if no user is found
  }
};
