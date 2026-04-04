import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { getUserById, updateUser } from '@/lib/db/users';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole('admin');
    const { id } = await params;
    const user = await getUserById(parseInt(id));
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { password_hash: _, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole('admin');
    const { id } = await params;
    const data = await req.json();
    const user = await updateUser(parseInt(id), data);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
