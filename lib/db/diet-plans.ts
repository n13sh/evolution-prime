import 'server-only';
import getDb from '@/database/db';
import type { DietPlan } from '@/types/db';

export async function getDietPlansForTrainee(traineeId: number): Promise<DietPlan[]> {
  const sql = getDb();
  return sql<DietPlan[]>`SELECT * FROM diet_plans WHERE assigned_to = ${traineeId} AND is_active = 1 ORDER BY created_at DESC`;
}

export async function createDietPlan(data: {
  title: string;
  createdBy: number;
  assignedTo?: number;
  calorieTarget?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  structure?: string;
  isAiGenerated?: number;
}): Promise<DietPlan> {
  const sql = getDb();
  const rows = await sql<DietPlan[]>`
    INSERT INTO diet_plans (title, created_by, assigned_to, calorie_target, protein_g, carbs_g, fat_g, structure, is_ai_generated)
    VALUES (${data.title}, ${data.createdBy}, ${data.assignedTo ?? null}, ${data.calorieTarget ?? null}, 
            ${data.proteinG ?? null}, ${data.carbsG ?? null}, ${data.fatG ?? null}, ${data.structure ?? null}, ${data.isAiGenerated ?? 0})
    RETURNING *
  `;
  return rows[0];
}
