import type { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { userRepository } from '../repositories/userRepository.js';

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
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      // The auth middleware sets req.user
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const user = await userRepository.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { name } = req.body;
      const updatedUser = await userRepository.updateProfile(userId, name);
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
};
