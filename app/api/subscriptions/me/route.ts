import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSubscriptionByUserId } from '@/lib/db/subscriptions';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subscription = await getSubscriptionByUserId(session.userId);
    return NextResponse.json({ 
      subscription: subscription || { status: 'none', plan_type: 'free' },
      role: session.role
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
