import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { assignPlanToTrainee } from '@/lib/db/workout-plans';

export async function POST(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  try {
    await requireRole(['coach', 'admin']);
    const { planId } = await params;
    const { traineeId } = await req.json();
    await assignPlanToTrainee(parseInt(planId), traineeId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
