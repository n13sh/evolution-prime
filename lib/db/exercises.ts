import 'server-only';
import getDb from '@/database/db';
import type { Exercise } from '@/types/db';

export async function getAllExercises(opts?: {
  muscleGroup?: string;
  equipment?: string;
  type?: string;
  search?: string;
}): Promise<Exercise[]> {
  const sql = getDb();

  if (opts?.muscleGroup && opts?.search) {
    return sql`SELECT * FROM exercises WHERE muscle_group = ${opts.muscleGroup} AND LOWER(name) LIKE LOWER(${'%' + opts.search + '%'}) ORDER BY name`;
  }
  if (opts?.muscleGroup) {
    return sql`SELECT * FROM exercises WHERE muscle_group = ${opts.muscleGroup} ORDER BY name`;
  }
  if (opts?.equipment) {
    return sql`SELECT * FROM exercises WHERE equipment = ${opts.equipment} ORDER BY name`;
  }
  if (opts?.type) {
    return sql`SELECT * FROM exercises WHERE exercise_type = ${opts.type} ORDER BY name`;
  }
  if (opts?.search) {
    return sql`SELECT * FROM exercises WHERE LOWER(name) LIKE LOWER(${'%' + opts.search + '%'}) ORDER BY name`;
  }
  return sql`SELECT * FROM exercises ORDER BY name`;
}

export async function getExerciseById(id: number): Promise<Exercise | undefined> {
  const sql = getDb();
  const rows = await sql<Exercise[]>`SELECT * FROM exercises WHERE id = ${id} LIMIT 1`;
  return rows[0];
}

export async function seedExercises(): Promise<void> {
  const sql = getDb();
  const rows = await sql<[{ c: string }]>`SELECT COUNT(*) as c FROM exercises`;
  if (parseInt(rows[0].c) > 0) return;

  const exercises = [
    { name: 'Barbell Squat', muscle_group: 'legs', secondary: '["glutes","core"]', equipment: 'barbell', type: 'compound', instructions: 'Stand with feet shoulder-width apart, bar on upper traps. Squat until thighs parallel.' },
    { name: 'Deadlift', muscle_group: 'back', secondary: '["legs","glutes","core"]', equipment: 'barbell', type: 'compound', instructions: 'Grip bar just outside legs. Drive hips forward to stand.' },
    { name: 'Bench Press', muscle_group: 'chest', secondary: '["triceps","shoulders"]', equipment: 'barbell', type: 'compound', instructions: 'Lie on bench, lower bar to chest, press explosively.' },
    { name: 'Pull-Up', muscle_group: 'back', secondary: '["biceps","core"]', equipment: 'bodyweight', type: 'compound', instructions: 'Hang from bar, pull chest to bar, lower controlled.' },
    { name: 'Overhead Press', muscle_group: 'shoulders', secondary: '["triceps","core"]', equipment: 'barbell', type: 'compound', instructions: 'Press bar from shoulders overhead until arms locked.' },
    { name: 'Romanian Deadlift', muscle_group: 'legs', secondary: '["back","glutes"]', equipment: 'barbell', type: 'compound', instructions: 'Hinge at hips, lower bar to mid-shin, drive hips forward.' },
    { name: 'Dumbbell Curl', muscle_group: 'arms', secondary: '[]', equipment: 'dumbbell', type: 'isolation', instructions: 'Curl dumbbells from hip to shoulder, squeeze at top.' },
    { name: 'Tricep Pushdown', muscle_group: 'arms', secondary: '[]', equipment: 'cable', type: 'isolation', instructions: 'Push cable attachment down until arms extended.' },
    { name: 'Lat Pulldown', muscle_group: 'back', secondary: '["biceps"]', equipment: 'cable', type: 'compound', instructions: 'Pull bar to upper chest, squeeze lats.' },
    { name: 'Leg Press', muscle_group: 'legs', secondary: '["glutes"]', equipment: 'machine', type: 'compound', instructions: 'Press platform until legs nearly straight.' },
    { name: 'Dumbbell Row', muscle_group: 'back', secondary: '["biceps"]', equipment: 'dumbbell', type: 'compound', instructions: 'Row dumbbell to hip, keep back flat.' },
    { name: 'Incline Dumbbell Press', muscle_group: 'chest', secondary: '["shoulders","triceps"]', equipment: 'dumbbell', type: 'compound', instructions: 'Press dumbbells at 30-45 degree incline.' },
    { name: 'Face Pull', muscle_group: 'shoulders', secondary: '["traps"]', equipment: 'cable', type: 'isolation', instructions: 'Pull rope to face level, externally rotate.' },
    { name: 'Plank', muscle_group: 'core', secondary: '["shoulders"]', equipment: 'bodyweight', type: 'isolation', instructions: 'Hold plank position with body straight.' },
    { name: 'Running', muscle_group: 'legs', secondary: '["core","cardio"]', equipment: 'bodyweight', type: 'cardio', instructions: 'Steady state or interval running.' },
    { name: 'Cable Fly', muscle_group: 'chest', secondary: '[]', equipment: 'cable', type: 'isolation', instructions: 'Bring cables together in arc motion.' },
    { name: 'Leg Curl', muscle_group: 'legs', secondary: '[]', equipment: 'machine', type: 'isolation', instructions: 'Curl legs against resistance.' },
    { name: 'Calf Raise', muscle_group: 'legs', secondary: '[]', equipment: 'machine', type: 'isolation', instructions: 'Rise onto toes against resistance.' },
    { name: 'Lateral Raise', muscle_group: 'shoulders', secondary: '[]', equipment: 'dumbbell', type: 'isolation', instructions: 'Raise dumbbells to shoulder height.' },
    { name: 'Hip Thrust', muscle_group: 'glutes', secondary: '["legs"]', equipment: 'barbell', type: 'compound', instructions: 'Drive hips upward with bar on hip crease.' },
  ];

  for (const ex of exercises) {
    await sql`
      INSERT INTO exercises (name, muscle_group, secondary_muscles, equipment, exercise_type, instructions)
      VALUES (${ex.name}, ${ex.muscle_group}, ${ex.secondary}, ${ex.equipment}, ${ex.type}, ${ex.instructions})
      ON CONFLICT (name) DO NOTHING
    `;
  }
}
