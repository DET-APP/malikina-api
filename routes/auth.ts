import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/config.js';
import { requireAuth, requireRole, signToken, AdminUser } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
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
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    await pool.query('UPDATE admin_users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    const payload: AdminUser = { id: user.id, email: user.email, full_name: user.full_name, role: user.role };
    res.json({ token: signToken(payload), user: payload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO admin_users (email, password_hash, full_name, role, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [email.toLowerCase().trim(), hash, full_name, role, req.admin!.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email déjà utilisé' });
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/auth/users/:id — SuperAdmin uniquement
router.patch('/users/:id', requireAuth, requireRole('SuperAdmin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, is_active, full_name } = req.body;
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
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
  try {
    const hash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [hash, id]);
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { router as authRoutes };
