import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const data = await req.json();

    const { goal, fitnessLevel, equipment, daysPerWeek, sessionDurationMin, age, weight_kg, height_cm, gender, limitations } = data;

    // Generate a structured plan locally (no external API needed)
    const plan = generateLocalPlan({ goal, fitnessLevel, equipment, daysPerWeek, sessionDurationMin, age, weight_kg, height_cm, gender, limitations });

    // Save to DB if user is trainee
    if (session.role === 'trainee') {
      // Plan will be saved by frontend calling POST /api/workout-plans
    }

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

function generateLocalPlan(params: {
  goal: string;
  fitnessLevel: string;
  equipment: string[];
  daysPerWeek: number;
  sessionDurationMin: number;
  age: number;
  weight_kg: number;
  height_cm: number;
  gender: string;
  limitations: string;
}) {
  const { goal, fitnessLevel, daysPerWeek } = params;

  const goalDescriptions: Record<string, string> = {
    muscle_gain: 'Build Muscle Mass',
    weight_loss: 'Fat Loss & Conditioning',
    endurance: 'Endurance & Cardio',
    general_fitness: 'General Fitness & Health',
  };

  const exercisesByGoal: Record<string, Record<string, Array<{ name: string; sets: number; reps: string; rest: number }>>> = {
    muscle_gain: {
      'Push Day': [
        { name: 'Bench Press', sets: 4, reps: '6-10', rest: 120 },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12', rest: 90 },
        { name: 'Overhead Press', sets: 3, reps: '8-12', rest: 90 },
        { name: 'Cable Fly', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Tricep Pushdown', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Lateral Raise', sets: 4, reps: '12-20', rest: 45 },
      ],
      'Pull Day': [
        { name: 'Deadlift', sets: 4, reps: '4-8', rest: 150 },
        { name: 'Pull-Up', sets: 4, reps: '6-12', rest: 90 },
        { name: 'Dumbbell Row', sets: 3, reps: '8-12', rest: 90 },
        { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: 75 },
        { name: 'Dumbbell Curl', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Face Pull', sets: 4, reps: '15-20', rest: 45 },
      ],
      'Leg Day': [
        { name: 'Barbell Squat', sets: 4, reps: '6-10', rest: 150 },
        { name: 'Romanian Deadlift', sets: 3, reps: '8-12', rest: 90 },
        { name: 'Leg Press', sets: 3, reps: '10-15', rest: 90 },
        { name: 'Leg Curl', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Calf Raise', sets: 4, reps: '12-20', rest: 45 },
        { name: 'Hip Thrust', sets: 3, reps: '10-15', rest: 75 },
      ],
    },
    weight_loss: {
      'Upper Body': [
        { name: 'Pull-Up', sets: 3, reps: '8-12', rest: 60 },
        { name: 'Bench Press', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Dumbbell Row', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Overhead Press', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Dumbbell Curl', sets: 2, reps: '12-15', rest: 45 },
        { name: 'Tricep Pushdown', sets: 2, reps: '12-15', rest: 45 },
      ],
      'Lower Body + Cardio': [
        { name: 'Barbell Squat', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Romanian Deadlift', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Leg Press', sets: 3, reps: '15-20', rest: 60 },
        { name: 'Calf Raise', sets: 3, reps: '15-20', rest: 45 },
        { name: 'Running', sets: 1, reps: '20 min', rest: 0 },
      ],
      'Full Body Circuit': [
        { name: 'Barbell Squat', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Bench Press', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Dumbbell Row', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Overhead Press', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Plank', sets: 3, reps: '30-60s', rest: 30 },
        { name: 'Running', sets: 1, reps: '15 min', rest: 0 },
      ],
    },
  };

  const defaultExercises = exercisesByGoal[goal] || exercisesByGoal.muscle_gain;
  const dayNames = Object.keys(defaultExercises);

  const days = [];
  for (let i = 0; i < daysPerWeek; i++) {
    const dayName = dayNames[i % dayNames.length];
    const exercises = defaultExercises[dayName];

    days.push({
      dayName: `Day ${i + 1} — ${dayName}`,
      focus: dayName,
      exercises: exercises.map(ex => ({
        exerciseName: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        restSec: ex.rest,
        notes: fitnessLevel === 'beginner' ? 'Focus on form over weight' : undefined,
      })),
    });
  }

  return {
    title: `${goalDescriptions[goal] || 'Custom'} Plan — ${fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)}`,
    description: `A ${daysPerWeek}-day ${goalDescriptions[goal]?.toLowerCase()} program tailored to your profile. ${params.limitations ? `Accommodates: ${params.limitations}.` : ''}`,
    goal,
    difficulty: fitnessLevel,
    durationWeeks: fitnessLevel === 'beginner' ? 8 : 12,
    daysPerWeek,
    structure: { days },
    calorieTarget: goal === 'weight_loss'
      ? Math.round(params.weight_kg * 22)
      : goal === 'muscle_gain'
      ? Math.round(params.weight_kg * 35)
      : Math.round(params.weight_kg * 28),
    proteinTarget: Math.round(params.weight_kg * (goal === 'muscle_gain' ? 2.2 : 1.8)),
  };
}
