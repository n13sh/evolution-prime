export type Role = 'admin' | 'coach' | 'trainee';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
  display_name: string;
  avatar_url: string | null;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export interface Coach {
  id: number;
  bio: string | null;
  specializations: string | null; // JSON array string
  is_approved: number;
  max_trainees: number;
}

export interface Trainee {
  id: number;
  coach_id: number | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness' | null;
  fitness_level: 'beginner' | 'intermediate' | 'advanced' | null;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
  secondary_muscles: string | null;
  equipment: string;
  exercise_type: 'compound' | 'isolation' | 'cardio';
  instructions: string | null;
  video_url: string | null;
  created_by: number | null;
}

export interface WorkoutPlan {
  id: number;
  title: string;
  description: string | null;
  created_by: number;
  assigned_to: number | null;
  goal: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  duration_weeks: number;
  days_per_week: number;
  structure: string; // JSON
  is_ai_generated: number;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export interface Session {
  id: number;
  trainee_id: number;
  plan_id: number | null;
  day_index: number | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: number;
  completed_at: number | null;
  duration_sec: number | null;
  notes: string | null;
}

export interface WorkoutLog {
  id: number;
  session_id: number;
  trainee_id: number;
  exercise_id: number;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_sec: number | null;
  distance_m: number | null;
  rir: number | null;
  is_pr: number;
  logged_at: number;
}

export interface DietPlan {
  id: number;
  title: string;
  created_by: number;
  assigned_to: number | null;
  calorie_target: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  structure: string | null;
  is_ai_generated: number;
  is_active: number;
  created_at: number;
}

export interface BodyMetric {
  id: number;
  trainee_id: number;
  weight_kg: number | null;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  bicep_cm: number | null;
  thigh_cm: number | null;
  measured_at: number;
  notes: string | null;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string | null;
  is_read: number;
  created_at: number;
}

// Extended types with joins
export interface UserWithProfile extends User {
  coach?: Coach;
  trainee?: Trainee;
}

export interface TraineeWithUser extends Trainee {
  user: User;
  coachName?: string;
}

export interface WorkoutLogWithExercise extends WorkoutLog {
  exercise_name: string;
  muscle_group: string;
}

// Plan structure types
export interface PlanExercise {
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: string; // e.g. "8-12" or "10"
  restSec: number;
  notes?: string;
}

export interface PlanDay {
  dayName: string;
  focus: string;
  exercises: PlanExercise[];
}

export interface PlanStructure {
  days: PlanDay[];
}
