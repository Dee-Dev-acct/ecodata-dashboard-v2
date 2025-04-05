import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define custom user interface for the request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        role: string;
      };
    }
  }
}
import { storage } from './storage';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(userId: number, username: string, role: string): string {
  return jwt.sign(
    { userId, username, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Middleware to verify token
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// Middleware to check for admin role
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin permission required' });
  }
  
  next();
}

// Authentication functions
export async function login(username: string, password: string): Promise<{ token: string; user: { id: number; username: string; email: string; role: string; } } | null> {
  console.log(`Attempting login for username: ${username}`);
  
  const user = await storage.getUserByUsername(username);
  
  if (!user) {
    console.log(`User not found: ${username}`);
    return null;
  }
  
  console.log(`User found. Comparing passwords...`);
  console.log(`Stored password hash length: ${user.password.length}`);
  
  try {
    const isMatch = await comparePassword(password, user.password);
    console.log(`Password match result: ${isMatch}`);
    
    if (!isMatch) return null;
    
    // Generate token
    const token = generateToken(user.id, user.username, user.role);
    console.log(`Login successful for user: ${username} with role: ${user.role}`);
    
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } catch (error: any) {
    console.error(`Error during password comparison:`, error);
    return null;
  }
}
