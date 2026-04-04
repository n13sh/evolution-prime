import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createWorkoutLog, getLogsForSession } from '@/lib/db/workout-logs';

export async function GET(req: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = req.nextUrl;
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    const logs = await getLogsForSession(parseInt(sessionId));
    return NextResponse.json({ logs });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'trainee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const log = await createWorkoutLog({ ...body, traineeId: session.userId });
    return NextResponse.json({ log, isPR: log.isPR });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
