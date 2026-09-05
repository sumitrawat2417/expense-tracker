import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authService = {
  registerUser: async (email: string, passwordPlain: string) => {
    // 1. Check if user already exists
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    // 2. Hash the password for security
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);

    // 3. Save to database
    const newUser = await userRepository.createUser(email, passwordHash);
    
    // 4. Generate VIP Wristband (JWT)
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    
    return { user: newUser, token };
  },

  loginUser: async (email: string, passwordPlain: string) => {
    // 1. Find user by email
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // 2. Compare the hashed passwords
    const isValidPassword = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password.');
    }

    // 3. Generate VIP Wristband (JWT)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    // Remove password hash from the object before returning to frontend
    const { password_hash, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }
};
