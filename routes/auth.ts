import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/config.js';
import { requireAuth, requireRole, signToken, AdminUser } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Hiérarchie des rôles pour le RBAC (indice = niveau de privilège)
const ROLE_LEVEL: Record<string, number> = {
  SuperAdmin: 4,
  Admin: 3,
  GerantXassida: 2,
  GerantAudio: 2,
  Moderateur: 1
};

function getIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
}

function logAuth(event: string, email: string, ip: string, extra?: string) {
  const ts = new Date().toISOString();
  console.log(`[AUTH] ${ts} | ${event} | email=${email} | ip=${ip}${extra ? ' | ' + extra : ''}`);
}

// POST /api/auth/login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = getIp(req);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, password_hash, is_active FROM admin_users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    const user = result.rows[0];
    if (!user || !user.is_active) {
      logAuth('LOGIN_FAILED', email, ip, 'user_not_found_or_inactive');
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      logAuth('LOGIN_FAILED', email, ip, 'wrong_password');
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    await pool.query('UPDATE admin_users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    const payload: AdminUser = { id: user.id, email: user.email, full_name: user.full_name, role: user.role };
    logAuth('LOGIN_SUCCESS', email, ip, `role=${user.role}`);
    res.json({ token: signToken(payload), user: payload });
  } catch (err: any) {
    logAuth('LOGIN_ERROR', email, ip, err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.admin });
});

// POST /api/auth/users — SuperAdmin uniquement
router.post('/users', requireAuth, requireRole('SuperAdmin'), async (req: Request, res: Response) => {
  const { email, password, full_name, role } = req.body;
  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'email, password, full_name, role requis' });
  }
  const validRoles = ['SuperAdmin', 'Admin', 'GerantAudio', 'GerantXassida', 'Moderateur'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Rôle invalide. Valeurs: ${validRoles.join(', ')}` });
  }
  // Un SuperAdmin ne peut pas créer un autre SuperAdmin (sauf s'il est lui-même le seul)
  const requesterLevel = ROLE_LEVEL[req.admin!.role] ?? 0;
  const targetLevel = ROLE_LEVEL[role] ?? 0;
  if (targetLevel >= requesterLevel && req.admin!.role !== 'SuperAdmin') {
    return res.status(403).json({ error: 'Impossible de créer un utilisateur de niveau supérieur ou égal au vôtre' });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO admin_users (email, password_hash, full_name, role, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [email.toLowerCase().trim(), hash, full_name, role, req.admin!.id]
    );
    const ip = getIp(req);
    logAuth('USER_CREATED', email, ip, `by=${req.admin!.email} role=${role}`);
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email déjà utilisé' });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/auth/users — SuperAdmin uniquement
router.get('/users', requireAuth, requireRole('SuperAdmin'), async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, email, full_name, role, is_active, last_login_at, created_at
       FROM admin_users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/auth/users/:id — SuperAdmin uniquement
router.patch('/users/:id', requireAuth, requireRole('SuperAdmin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, is_active, full_name } = req.body;

  // Empêcher la modification d'un compte de même niveau ou supérieur (hors soi-même)
  if (req.admin!.id !== id) {
    try {
      const targetResult = await pool.query('SELECT role FROM admin_users WHERE id = $1', [id]);
      const target = targetResult.rows[0];
      if (!target) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      const requesterLevel = ROLE_LEVEL[req.admin!.role] ?? 0;
      const targetLevel = ROLE_LEVEL[target.role] ?? 0;
      if (targetLevel >= requesterLevel) {
        return res.status(403).json({ error: 'Impossible de modifier un utilisateur de niveau supérieur ou égal au vôtre' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // Valider le nouveau rôle si fourni
  if (role !== undefined) {
    const validRoles = ['SuperAdmin', 'Admin', 'GerantAudio', 'GerantXassida', 'Moderateur'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Rôle invalide. Valeurs: ${validRoles.join(', ')}` });
    }
    const requesterLevel = ROLE_LEVEL[req.admin!.role] ?? 0;
    const newTargetLevel = ROLE_LEVEL[role] ?? 0;
    if (newTargetLevel >= requesterLevel) {
      return res.status(403).json({ error: 'Impossible d\'attribuer un rôle de niveau supérieur ou égal au vôtre' });
    }
  }

  try {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (role !== undefined) { fields.push(`role = $${idx++}`); values.push(role); }
    if (is_active !== undefined) { fields.push(`is_active = $${idx++}`); values.push(is_active); }
    if (full_name !== undefined) { fields.push(`full_name = $${idx++}`); values.push(full_name); }
    if (!fields.length) return res.status(400).json({ error: 'Aucun champ à modifier' });
    values.push(id);
    const result = await pool.query(
      `UPDATE admin_users SET ${fields.join(', ')} WHERE id = $${idx}
       RETURNING id, email, full_name, role, is_active`,
      values
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const ip = getIp(req);
    logAuth('USER_UPDATED', result.rows[0].email, ip, `by=${req.admin!.email}`);
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/auth/users/:id/password — SuperAdmin ou soi-même
router.patch('/users/:id/password', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Mot de passe minimum 8 caractères' });
  }
  if (req.admin!.role !== 'SuperAdmin' && req.admin!.id !== id) {
    return res.status(403).json({ error: 'Non autorisé' });
  }
  // SuperAdmin ne peut pas changer le mot de passe d'un autre SuperAdmin
  if (req.admin!.id !== id) {
    try {
      const targetResult = await pool.query('SELECT role FROM admin_users WHERE id = $1', [id]);
      const target = targetResult.rows[0];
      if (!target) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      const requesterLevel = ROLE_LEVEL[req.admin!.role] ?? 0;
      const targetLevel = ROLE_LEVEL[target.role] ?? 0;
      if (targetLevel >= requesterLevel) {
        return res.status(403).json({ error: 'Impossible de modifier le mot de passe d\'un utilisateur de niveau supérieur ou égal' });
      }
    } catch (err: any) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hash, id]);
    const ip = getIp(req);
    logAuth('PASSWORD_CHANGED', req.admin!.email, ip, `target_id=${id}`);
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/auth/users/:id — SuperAdmin uniquement, pas soi-même
router.delete('/users/:id', requireAuth, requireRole('SuperAdmin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.admin!.id === id) {
    return res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
  }
  // Empêcher la suppression d'un utilisateur de même niveau ou supérieur
  try {
    const targetResult = await pool.query('SELECT role, email FROM admin_users WHERE id = $1', [id]);
    const target = targetResult.rows[0];
    if (!target) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const requesterLevel = ROLE_LEVEL[req.admin!.role] ?? 0;
    const targetLevel = ROLE_LEVEL[target.role] ?? 0;
    if (targetLevel >= requesterLevel) {
      return res.status(403).json({ error: 'Impossible de supprimer un utilisateur de niveau supérieur ou égal au vôtre' });
    }
    const result = await pool.query(
      'DELETE FROM admin_users WHERE id = $1 RETURNING id, email, full_name',
      [id]
    );
    const ip = getIp(req);
    logAuth('USER_DELETED', target.email, ip, `by=${req.admin!.email}`);
    res.json({ message: 'Utilisateur supprimé', user: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export { router as authRoutes };
