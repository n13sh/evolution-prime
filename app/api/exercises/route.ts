import { NextRequest, NextResponse } from 'next/server';
import { getAllExercises } from '@/lib/db/exercises';
import { getSession } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const exercises = await getAllExercises({
    muscleGroup: searchParams.get('muscleGroup') || undefined,
    equipment: searchParams.get('equipment') || undefined,
    type: searchParams.get('type') || undefined,
    search: searchParams.get('search') || undefined,
  });
  return NextResponse.json({ exercises });
}
