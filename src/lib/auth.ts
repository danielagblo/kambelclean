import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple user database - in production, use a real database
const users = [
  {
    id: 1,
    email: 'admin@bestland.com',
    password: 'admin123', // Simple password for development
    name: 'Admin User',
    role: 'admin'
  }
];

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.find(u => u.email === email);
  if (!user) return null;

  // Simple password check for development
  if (user.password !== password) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('Verifying token, decoded:', decoded);
    return {
      id: decoded.id,
      email: decoded.email,
      name: 'Admin User', // Static name since it's not in the token
      role: decoded.role
    };
  } catch (error) {
    console.log('Token verification failed:', error);
    return null;
  }
}
