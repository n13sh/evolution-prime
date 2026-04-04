import 'server-only';
import getDb from '@/database/db';
import type { BodyMetric } from '@/types/db';

export async function getLatestMetrics(traineeId: number): Promise<BodyMetric | undefined> {
  const sql = getDb();
  const rows = await sql<BodyMetric[]>`
    SELECT * FROM body_metrics WHERE trainee_id = ${traineeId}
    ORDER BY measured_at DESC LIMIT 1
  `;
  return rows[0];
}

export async function getMetricsHistory(
  traineeId: number,
  from?: number,
  to?: number
): Promise<BodyMetric[]> {
  const sql = getDb();
  if (from && to) {
    return sql`SELECT * FROM body_metrics WHERE trainee_id = ${traineeId} AND measured_at >= ${from} AND measured_at <= ${to} ORDER BY measured_at ASC`;
  }
  if (from) {
    return sql`SELECT * FROM body_metrics WHERE trainee_id = ${traineeId} AND measured_at >= ${from} ORDER BY measured_at ASC`;
  }
  return sql`SELECT * FROM body_metrics WHERE trainee_id = ${traineeId} ORDER BY measured_at ASC`;
}

export async function addBodyMetric(
  traineeId: number,
  data: Partial<Omit<BodyMetric, 'id' | 'trainee_id' | 'measured_at'>>
): Promise<BodyMetric> {
  const sql = getDb();
  const rows = await sql<BodyMetric[]>`
    INSERT INTO body_metrics
      (trainee_id, weight_kg, body_fat_pct, muscle_mass_kg, chest_cm, waist_cm, hips_cm, bicep_cm, thigh_cm, notes)
    VALUES
      (${traineeId}, ${data.weight_kg ?? null}, ${data.body_fat_pct ?? null},
       ${data.muscle_mass_kg ?? null}, ${data.chest_cm ?? null}, ${data.waist_cm ?? null},
       ${data.hips_cm ?? null}, ${data.bicep_cm ?? null}, ${data.thigh_cm ?? null}, ${data.notes ?? null})
    RETURNING *
  `;
  return rows[0];
}
