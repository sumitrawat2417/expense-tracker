import pool from '../db/database.js';

export const userRepository = {
  createUser: async (email: string, passwordHash: string) => {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, name, created_at;
    `;
    const result = await pool.query(query, [email, passwordHash]);
    return result.rows[0];
  },

  getUserByEmail: async (email: string) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0]; // Returns undefined if no user is found
  },

  updateProfile: async (id: string, name: string) => {
    const query = `
      UPDATE users 
      SET name = $1
      WHERE id = $2
      RETURNING id, email, name;
    `;
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  },

  getUserById: async (id: string) => {
    const query = `SELECT id, email, name FROM users WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};
