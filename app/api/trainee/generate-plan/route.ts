import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createWorkoutPlan } from '@/lib/db/workout-plans';
import { createDietPlan } from '@/lib/db/diet-plans';
import { createBodyMetric } from '@/lib/db/body-metrics';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'trainee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { weight, height, goal, fitnessLevel, daysPerWeek, dietaryInfo } = data;

    // 1. Log Initial Metrics
    await createBodyMetric(session.userId, {
      weight_kg: parseFloat(weight),
      notes: 'Initial metric for AI Architect generation'
    });

    // 2. AI Logic for Workout Plan
    const workoutPlan = generateWorkoutPlan(goal, fitnessLevel, parseInt(daysPerWeek));
    const savedWorkout = await createWorkoutPlan({
      title: `AI ${goal.replace('_', ' ')} Path`,
      description: `Customized for ${fitnessLevel} level, ${daysPerWeek} days/week.`,
      createdBy: 1, // System/Admin ID
      assignedTo: session.userId,
      goal,
      difficulty: fitnessLevel,
      durationWeeks: 4,
      daysPerWeek: parseInt(daysPerWeek),
      structure: JSON.stringify(workoutPlan),
      isAiGenerated: 1
    });

    // 3. AI Logic for Diet Plan
    const bmr = 10 * weight + 6.25 * height - 5 * 25 + 5; // Simplified Mifflin-St Jeor
    const activityFactor = 1.2 + (daysPerWeek * 0.1);
    const tdee = Math.round(bmr * activityFactor);
    const calorieTarget = goal === 'muscle_gain' ? tdee + 300 : goal === 'weight_loss' ? tdee - 500 : tdee;

    const dietPlan = await createDietPlan({
      title: `AI ${goal.replace('_', ' ')} Diet`,
      createdBy: 1,
      assignedTo: session.userId,
      calorieTarget,
      proteinG: Math.round(weight * 2), // 2g per kg
      carbsG: Math.round((calorieTarget * 0.45) / 4),
      fatG: Math.round((calorieTarget * 0.25) / 9),
      structure: JSON.stringify({ notes: dietaryInfo || 'Balanced nutrition' }),
      isAiGenerated: 1
    });

    return NextResponse.json({ success: true, workoutPlan: savedWorkout, dietPlan });
  } catch (err) {
    console.error('Plan generation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateWorkoutPlan(goal: string, level: string, days: number) {
  // Simplified logic for MVP
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const exercises = {
    muscle_gain: [
      { exerciseId: 1, exerciseName: 'Barbell Squat', sets: 4, reps: '8-10', restSec: 90 },
      { exerciseId: 2, exerciseName: 'Bench Press', sets: 4, reps: '8-10', restSec: 90 },
      { exerciseId: 3, exerciseName: 'Deadlift', sets: 3, reps: '5', restSec: 180 },
    ],
    weight_loss: [
      { exerciseId: 4, exerciseName: 'Burpees', sets: 3, reps: '15', restSec: 30 },
      { exerciseId: 5, exerciseName: 'Kettlebell Swings', sets: 4, reps: '20', restSec: 45 },
      { exerciseId: 6, exerciseName: 'Tide Run', sets: 1, reps: '20 min', restSec: 0 },
    ],
    default: [
      { exerciseId: 1, exerciseName: 'Pushups', sets: 3, reps: '12', restSec: 60 },
      { exerciseId: 2, exerciseName: 'Lunges', sets: 3, reps: '12', restSec: 60 },
      { exerciseId: 3, exerciseName: 'Plank', sets: 3, reps: '45s', restSec: 60 },
    ]
  };

  const selectedExercises = exercises[goal as keyof typeof exercises] || exercises.default;
  
  return {
    days: Array.from({ length: days }).map((_, i) => ({
      dayName: dayNames[i],
      focus: goal.replace('_', ' ').toUpperCase(),
      exercises: selectedExercises
    }))
  };
}
