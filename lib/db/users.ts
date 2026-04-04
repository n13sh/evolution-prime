import 'server-only';
import getDb from '@/database/db';
import type { User } from '@/types/db';

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const sql = getDb();
  const rows = await sql<User[]>`SELECT * FROM users WHERE LOWER(email) = LOWER(${email}) LIMIT 1`;
  return rows[0];
}

export async function getUserById(id: number): Promise<User | undefined> {
  const sql = getDb();
  const rows = await sql<User[]>`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0];
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  role: string;
  displayName: string;
}): Promise<User> {
  const sql = getDb();
  const rows = await sql<User[]>`
    INSERT INTO users (email, password_hash, role, display_name)
    VALUES (${data.email}, ${data.passwordHash}, ${data.role}, ${data.displayName})
    RETURNING *
  `;
  return rows[0];
}

export async function getAllUsers(opts?: {
  role?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Omit<User, 'password_hash'>[]> {
  const sql = getDb();
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;

  if (opts?.role && opts?.search) {
    return sql`
      SELECT id, email, role, display_name, avatar_url, is_active, created_at
      FROM users
      WHERE role = ${opts.role}
        AND (LOWER(email) LIKE LOWER(${'%' + opts.search + '%'})
          OR LOWER(display_name) LIKE LOWER(${'%' + opts.search + '%'}))
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  if (opts?.role) {
    return sql`
      SELECT id, email, role, display_name, avatar_url, is_active, created_at
      FROM users WHERE role = ${opts.role}
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  if (opts?.search) {
    return sql`
      SELECT id, email, role, display_name, avatar_url, is_active, created_at
      FROM users
      WHERE LOWER(email) LIKE LOWER(${'%' + opts.search + '%'})
         OR LOWER(display_name) LIKE LOWER(${'%' + opts.search + '%'})
      ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
    `;
  }
  return sql`
    SELECT id, email, role, display_name, avatar_url, is_active, created_at
    FROM users ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function countUsers(opts?: { role?: string }): Promise<number> {
  const sql = getDb();
  const rows = opts?.role
    ? await sql<[{ count: string }]>`SELECT COUNT(*) as count FROM users WHERE role = ${opts.role}`
    : await sql<[{ count: string }]>`SELECT COUNT(*) as count FROM users`;
  return parseInt(rows[0].count);
}

export async function updateUser(
  id: number,
  data: Partial<{ is_active: number; display_name: string; avatar_url: string }>
): Promise<User | undefined> {
  const sql = getDb();
  const now = Math.floor(Date.now() / 1000);

  if ('is_active' in data && data.is_active !== undefined) {
    await sql`UPDATE users SET is_active = ${data.is_active}, updated_at = ${now} WHERE id = ${id}`;
  }
  if ('display_name' in data && data.display_name !== undefined) {
    await sql`UPDATE users SET display_name = ${data.display_name}, updated_at = ${now} WHERE id = ${id}`;
  }
  if ('avatar_url' in data && data.avatar_url !== undefined) {
    await sql`UPDATE users SET avatar_url = ${data.avatar_url}, updated_at = ${now} WHERE id = ${id}`;
  }
  return getUserById(id);
}
