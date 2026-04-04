import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createSession, getSessionsForTrainee } from '@/lib/db/sessions';

export async function GET() {
  try {
    const session = await requireSession();
    if (session.role !== 'trainee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const sessions = await getSessionsForTrainee(session.userId);
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'trainee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { planId, dayIndex } = await req.json();
    const newSession = await createSession({ traineeId: session.userId, planId, dayIndex });
    return NextResponse.json({ session: newSession });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
