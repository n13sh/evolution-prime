import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getSessionById, updateSession } from '@/lib/db/sessions';

export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const session = await requireSession();
    const { sessionId } = await params;
    const workout = await getSessionById(parseInt(sessionId));
    if (!workout) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (workout.trainee_id !== session.userId && session.role === 'trainee') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ session: workout });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    await requireSession();
    const { sessionId } = await params;
    const data = await req.json();
    const updated = await updateSession(parseInt(sessionId), data);
    return NextResponse.json({ session: updated });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
