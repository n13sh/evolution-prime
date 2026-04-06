import 'server-only';
import getDb from '@/database/db';

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: number;
  created_at: number;
}

export async function sendMessage(data: {
  senderId: number;
  receiverId: number;
  content: string;
}): Promise<Message> {
  const sql = getDb();
  const rows = await sql<Message[]>`
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (${data.senderId}, ${data.receiverId}, ${data.content})
    RETURNING *
  `;
  return rows[0];
}

export async function getConversation(userId1: number, userId2: number): Promise<Message[]> {
  const sql = getDb();
  return sql<Message[]>`
    SELECT * FROM messages 
    WHERE (sender_id = ${userId1} AND receiver_id = ${userId2})
       OR (sender_id = ${userId2} AND receiver_id = ${userId1})
    ORDER BY created_at ASC
  `;
}

export async function getUnreadCount(userId: number): Promise<number> {
  const sql = getDb();
  const rows = await sql<[{ count: string }]>`SELECT COUNT(*) as count FROM messages WHERE receiver_id = ${userId} AND is_read = 0`;
  return parseInt(rows[0].count);
}

export async function markAsRead(userId: number, senderId: number): Promise<void> {
  const sql = getDb();
  await sql`UPDATE messages SET is_read = 1 WHERE receiver_id = ${userId} AND sender_id = ${senderId}`;
}

export async function getRecentConversations(userId: number): Promise<any[]> {
  const sql = getDb();
  return sql`
    SELECT DISTINCT ON (partner_id)
      partner_id,
      u.display_name,
      u.avatar_url,
      m.content,
      m.created_at
    FROM (
      SELECT sender_id as partner_id, content, created_at FROM messages WHERE receiver_id = ${userId}
      UNION
      SELECT receiver_id as partner_id, content, created_at FROM messages WHERE sender_id = ${userId}
    ) m
    JOIN users u ON u.id = m.partner_id
    ORDER BY partner_id, m.created_at DESC
  `;
}
