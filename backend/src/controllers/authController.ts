import { Request, Response } from 'express';
import { authService } from '../services/authService.js';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }
      
      const result = await authService.registerUser(email, password);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email is already registered.') {
        res.status(409).json({ error: error.message });
      } else {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const result = await authService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Invalid email or password.') {
        res.status(401).json({ error: error.message });
      } else {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  }
};
