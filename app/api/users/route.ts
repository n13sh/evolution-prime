import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { getAllUsers, countUsers } from '@/lib/db/users';

export async function GET(req: NextRequest) {
  try {
    await requireRole('admin');
    const { searchParams } = req.nextUrl;
    const users = await getAllUsers({
      role: searchParams.get('role') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
    });
    const total = await countUsers({ role: searchParams.get('role') || undefined });
    return NextResponse.json({ users, total });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
