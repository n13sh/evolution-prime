import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sendMessage, getConversation, markAsRead } from '@/lib/db/messages';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const partnerId = parseInt(req.nextUrl.searchParams.get('partnerId') || '0');
    if (!partnerId) return NextResponse.json({ error: 'Partner ID required' }, { status: 400 });

    const messages = await getConversation(session.userId, partnerId);
    await markAsRead(session.userId, partnerId);

    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { receiverId, content } = await req.json();
    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    const message = await sendMessage({
      senderId: session.userId,
      receiverId: parseInt(receiverId),
      content
    });

    return NextResponse.json({ message });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
