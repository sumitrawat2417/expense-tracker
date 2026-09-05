import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// We must extend the Express Request interface so TypeScript knows about req.user!
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get the token from the "Authorization: Bearer <token>" header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access Denied. No token provided.' });
    return;
  }

  try {
    // Verify the VIP Wristband
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the decoded payload (id, email) to the request object!
    req.user = decoded;
    // Tell Express to move on to the Controller
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
    return;
  }
};
