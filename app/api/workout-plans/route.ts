import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getPlansForCoach, getPlansForTrainee, createWorkoutPlan } from '@/lib/db/workout-plans';

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { searchParams } = req.nextUrl;

    if (session.role === 'trainee') {
      const plans = await getPlansForTrainee(session.userId);
      return NextResponse.json({ plans });
    }
    if (session.role === 'coach') {
      const traineeId = searchParams.get('traineeId');
      if (traineeId) {
        const plans = await getPlansForTrainee(parseInt(traineeId));
        return NextResponse.json({ plans });
      }
      const plans = await getPlansForCoach(session.userId);
      return NextResponse.json({ plans });
    }
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const plan = await createWorkoutPlan({ ...body, createdBy: session.userId });
    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
