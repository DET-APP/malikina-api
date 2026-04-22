import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AdminRole = 'SuperAdmin' | 'Admin' | 'GerantAudio' | 'GerantXassida' | 'Moderateur';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'malikina-jwt-secret-change-in-production';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminUser;
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) return res.status(401).json({ error: 'Non authentifié' });
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ error: `Rôle requis: ${roles.join(' ou ')}` });
    }
    next();
  };
}

export function signToken(user: AdminUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}
