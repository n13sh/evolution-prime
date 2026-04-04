import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { addBodyMetric, getMetricsHistory } from '@/lib/db/body-metrics';

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { searchParams } = req.nextUrl;
    const traineeId = session.role === 'trainee' ? session.userId : parseInt(searchParams.get('traineeId') || '0');
    if (!traineeId) return NextResponse.json({ error: 'traineeId required' }, { status: 400 });
    const from = searchParams.get('from') ? parseInt(searchParams.get('from')!) : undefined;
    const to = searchParams.get('to') ? parseInt(searchParams.get('to')!) : undefined;
    const metrics = await getMetricsHistory(traineeId, from, to);
    return NextResponse.json({ metrics });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'trainee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const data = await req.json();
    const metric = await addBodyMetric(session.userId, data);
    return NextResponse.json({ metric });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
