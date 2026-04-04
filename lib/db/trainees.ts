import 'server-only';
import getDb from '@/database/db';
import type { Trainee } from '@/types/db';

export async function getTraineeById(id: number): Promise<Trainee | undefined> {
  const sql = getDb();
  const rows = await sql<Trainee[]>`SELECT * FROM trainees WHERE id = ${id} LIMIT 1`;
  return rows[0];
}

export async function createTraineeProfile(id: number): Promise<Trainee> {
  const sql = getDb();
  await sql`INSERT INTO trainees (id) VALUES (${id}) ON CONFLICT (id) DO NOTHING`;
  return (await getTraineeById(id))!;
}

export async function updateTraineeProfile(
  id: number,
  data: Partial<Omit<Trainee, 'id'>>
): Promise<Trainee | undefined> {
  const sql = getDb();
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return getTraineeById(id);

  for (const [key, value] of entries) {
    await sql`UPDATE trainees SET ${sql(key)} = ${value as string} WHERE id = ${id}`;
  }
  return getTraineeById(id);
}

export async function getTraineeWithUser(id: number) {
  const sql = getDb();
  const rows = await sql`
    SELECT u.id, u.email, u.display_name, u.avatar_url, u.created_at,
           t.coach_id, t.date_of_birth, t.gender, t.height_cm, t.goal, t.fitness_level
    FROM users u JOIN trainees t ON t.id = u.id
    WHERE u.id = ${id} LIMIT 1
  `;
  return rows[0];
}

export async function getAllTrainees(coachId?: number) {
  const sql = getDb();
  if (coachId !== undefined) {
    return sql`
      SELECT u.id, u.email, u.display_name, u.avatar_url,
             t.coach_id, t.goal, t.fitness_level,
             (SELECT MAX(s.completed_at) FROM sessions s
              WHERE s.trainee_id = t.id AND s.status = 'completed') as last_workout,
             (SELECT COUNT(*) FROM sessions s
              WHERE s.trainee_id = t.id AND s.status = 'completed') as total_workouts
      FROM trainees t JOIN users u ON u.id = t.id
      WHERE u.is_active = 1 AND t.coach_id = ${coachId}
      ORDER BY u.display_name
    `;
  }
  return sql`
    SELECT u.id, u.email, u.display_name, u.avatar_url,
           t.coach_id, t.goal, t.fitness_level,
           (SELECT MAX(s.completed_at) FROM sessions s
            WHERE s.trainee_id = t.id AND s.status = 'completed') as last_workout,
           (SELECT COUNT(*) FROM sessions s
            WHERE s.trainee_id = t.id AND s.status = 'completed') as total_workouts
    FROM trainees t JOIN users u ON u.id = t.id
    WHERE u.is_active = 1
    ORDER BY u.display_name
  `;
}
