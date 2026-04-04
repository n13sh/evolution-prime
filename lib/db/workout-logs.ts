import 'server-only';
import getDb from '@/database/db';
import type { WorkoutLog } from '@/types/db';

export async function createWorkoutLog(data: {
  sessionId: number;
  traineeId: number;
  exerciseId: number;
  setNumber: number;
  reps?: number;
  weightKg?: number;
  durationSec?: number;
  distanceM?: number;
  rir?: number;
}): Promise<WorkoutLog & { isPR: boolean }> {
  const sql = getDb();

  let isPR = false;
  if (data.weightKg && data.reps) {
    const best = await sql<[{ max_weight: number | null }]>`
      SELECT MAX(weight_kg) as max_weight FROM workout_logs
      WHERE trainee_id = ${data.traineeId} AND exercise_id = ${data.exerciseId} AND reps >= ${data.reps}
    `;
    isPR = !best[0].max_weight || data.weightKg > best[0].max_weight;
  }

  const rows = await sql<WorkoutLog[]>`
    INSERT INTO workout_logs
      (session_id, trainee_id, exercise_id, set_number, reps, weight_kg, duration_sec, distance_m, rir, is_pr)
    VALUES
      (${data.sessionId}, ${data.traineeId}, ${data.exerciseId}, ${data.setNumber},
       ${data.reps ?? null}, ${data.weightKg ?? null}, ${data.durationSec ?? null},
       ${data.distanceM ?? null}, ${data.rir ?? null}, ${isPR ? 1 : 0})
    RETURNING *
  `;
  return { ...rows[0], isPR };
}

export async function getLogsForSession(sessionId: number) {
  const sql = getDb();
  return sql`
    SELECT wl.*, e.name as exercise_name, e.muscle_group
    FROM workout_logs wl JOIN exercises e ON e.id = wl.exercise_id
    WHERE wl.session_id = ${sessionId}
    ORDER BY wl.logged_at
  `;
}

export async function getPersonalRecords(traineeId: number) {
  const sql = getDb();
  return sql`
    SELECT e.name as exercise_name, e.muscle_group,
           MAX(wl.weight_kg) as max_weight, wl.reps, MAX(wl.logged_at) as logged_at
    FROM workout_logs wl JOIN exercises e ON e.id = wl.exercise_id
    WHERE wl.trainee_id = ${traineeId} AND wl.is_pr = 1 AND wl.weight_kg IS NOT NULL
    GROUP BY wl.exercise_id, e.name, e.muscle_group, wl.reps
    ORDER BY e.name
  `;
}

export async function getVolumeByMuscle(traineeId: number, days = 30) {
  const sql = getDb();
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  return sql`
    SELECT e.muscle_group, SUM(wl.reps * wl.weight_kg) as volume, COUNT(*) as sets
    FROM workout_logs wl JOIN exercises e ON e.id = wl.exercise_id
    WHERE wl.trainee_id = ${traineeId} AND wl.logged_at >= ${since} AND wl.weight_kg IS NOT NULL
    GROUP BY e.muscle_group
    ORDER BY volume DESC
  `;
}

export async function getWeeklyVolume(traineeId: number, weeks = 8) {
  const sql = getDb();
  const since = Math.floor(Date.now() / 1000) - weeks * 7 * 86400;
  return sql`
    SELECT TO_CHAR(TO_TIMESTAMP(wl.logged_at), 'IYYY-IW') as week,
           SUM(wl.reps * wl.weight_kg) as volume,
           COUNT(DISTINCT wl.session_id) as sessions
    FROM workout_logs wl
    WHERE wl.trainee_id = ${traineeId} AND wl.logged_at >= ${since}
    GROUP BY week
    ORDER BY week
  `;
}
