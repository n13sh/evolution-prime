import 'server-only';
import getDb from '@/database/db';
import type { Session } from '@/types/db';

export async function getSessionById(id: number): Promise<Session | undefined> {
  const sql = getDb();
  const rows = await sql<Session[]>`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`;
  return rows[0];
}

export async function getSessionsForTrainee(traineeId: number, limit = 20): Promise<Session[]> {
  const sql = getDb();
  return sql`SELECT * FROM sessions WHERE trainee_id = ${traineeId} ORDER BY started_at DESC LIMIT ${limit}`;
}

export async function getActiveSession(traineeId: number): Promise<Session | undefined> {
  const sql = getDb();
  const rows = await sql<Session[]>`
    SELECT * FROM sessions
    WHERE trainee_id = ${traineeId} AND status = 'in_progress'
    ORDER BY started_at DESC LIMIT 1
  `;
  return rows[0];
}

export async function createSession(data: {
  traineeId: number;
  planId?: number;
  dayIndex?: number;
}): Promise<Session> {
  const sql = getDb();
  const rows = await sql<Session[]>`
    INSERT INTO sessions (trainee_id, plan_id, day_index)
    VALUES (${data.traineeId}, ${data.planId ?? null}, ${data.dayIndex ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function updateSession(
  id: number,
  data: { status?: 'in_progress' | 'completed' | 'abandoned'; durationSec?: number; notes?: string }
): Promise<Session | undefined> {
  const sql = getDb();
  const now = Math.floor(Date.now() / 1000);

  if (data.status === 'completed' || data.status === 'abandoned') {
    await sql`
      UPDATE sessions
      SET status = ${data.status}, completed_at = ${now},
          duration_sec = ${data.durationSec ?? null}, notes = ${data.notes ?? null}
      WHERE id = ${id}
    `;
  } else if (data.status) {
    await sql`UPDATE sessions SET status = ${data.status} WHERE id = ${id}`;
  }
  return getSessionById(id);
}

export async function getRecentCompletedSessions(traineeId: number, days = 7) {
  const sql = getDb();
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  return sql`
    SELECT s.*, wp.title as plan_title
    FROM sessions s
    LEFT JOIN workout_plans wp ON wp.id = s.plan_id
    WHERE s.trainee_id = ${traineeId} AND s.status = 'completed' AND s.completed_at >= ${since}
    ORDER BY s.completed_at DESC
  `;
}
