import 'server-only';
import getDb from '@/database/db';
import type { Coach } from '@/types/db';

export async function getCoachById(id: number): Promise<Coach | undefined> {
  const sql = getDb();
  const rows = await sql<Coach[]>`SELECT * FROM coaches WHERE id = ${id} LIMIT 1`;
  return rows[0];
}

export async function createCoachProfile(id: number): Promise<Coach> {
  const sql = getDb();
  const rows = await sql<Coach[]>`
    INSERT INTO coaches (id) VALUES (${id})
    ON CONFLICT (id) DO NOTHING
    RETURNING *
  `;
  return rows[0] ?? (await getCoachById(id))!;
}

export async function getAllCoaches() {
  const sql = getDb();
  return sql`
    SELECT u.id, u.email, u.display_name, u.avatar_url, u.is_active, u.created_at,
           c.bio, c.specializations, c.is_approved, c.max_trainees,
           COUNT(t.id) as trainee_count
    FROM users u
    JOIN coaches c ON c.id = u.id
    LEFT JOIN trainees t ON t.coach_id = u.id
    WHERE u.role = 'coach'
    GROUP BY u.id, u.email, u.display_name, u.avatar_url, u.is_active, u.created_at,
             c.bio, c.specializations, c.is_approved, c.max_trainees
    ORDER BY u.created_at DESC
  `;
}

export async function getCoachTrainees(coachId: number) {
  const sql = getDb();
  return sql`
    SELECT u.id, u.email, u.display_name, u.avatar_url,
           t.goal, t.fitness_level, t.height_cm,
           (SELECT MAX(s.completed_at) FROM sessions s
            WHERE s.trainee_id = t.id AND s.status = 'completed') as last_workout
    FROM trainees t
    JOIN users u ON u.id = t.id
    WHERE t.coach_id = ${coachId}
    ORDER BY u.display_name
  `;
}

export async function approveCoach(id: number): Promise<void> {
  const sql = getDb();
  await sql`UPDATE coaches SET is_approved = 1 WHERE id = ${id}`;
}
