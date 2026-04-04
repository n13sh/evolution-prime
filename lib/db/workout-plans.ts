import 'server-only';
import getDb from '@/database/db';
import type { WorkoutPlan } from '@/types/db';

export async function getWorkoutPlanById(id: number): Promise<WorkoutPlan | undefined> {
  const sql = getDb();
  const rows = await sql<WorkoutPlan[]>`SELECT * FROM workout_plans WHERE id = ${id} LIMIT 1`;
  return rows[0];
}

export async function getPlansForTrainee(traineeId: number): Promise<WorkoutPlan[]> {
  const sql = getDb();
  return sql`SELECT * FROM workout_plans WHERE assigned_to = ${traineeId} AND is_active = 1 ORDER BY created_at DESC`;
}

export async function getPlansForCoach(coachId: number): Promise<WorkoutPlan[]> {
  const sql = getDb();
  return sql`SELECT * FROM workout_plans WHERE created_by = ${coachId} ORDER BY created_at DESC`;
}

export async function createWorkoutPlan(data: {
  title: string;
  description?: string;
  createdBy: number;
  assignedTo?: number;
  goal?: string;
  difficulty?: string;
  durationWeeks: number;
  daysPerWeek: number;
  structure: string;
  isAiGenerated?: number;
}): Promise<WorkoutPlan> {
  const sql = getDb();
  const rows = await sql<WorkoutPlan[]>`
    INSERT INTO workout_plans
      (title, description, created_by, assigned_to, goal, difficulty, duration_weeks, days_per_week, structure, is_ai_generated)
    VALUES
      (${data.title}, ${data.description ?? null}, ${data.createdBy}, ${data.assignedTo ?? null},
       ${data.goal ?? null}, ${data.difficulty ?? null}, ${data.durationWeeks}, ${data.daysPerWeek},
       ${data.structure}, ${data.isAiGenerated ?? 0})
    RETURNING *
  `;
  return rows[0];
}

export async function assignPlanToTrainee(planId: number, traineeId: number): Promise<void> {
  const sql = getDb();
  const now = Math.floor(Date.now() / 1000);
  await sql`UPDATE workout_plans SET assigned_to = ${traineeId}, updated_at = ${now} WHERE id = ${planId}`;
}
