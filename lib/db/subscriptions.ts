import 'server-only';
import getDb from '@/database/db';
import type { User } from '@/types/db';

export interface Subscription {
  id: number;
  user_id: number;
  plan_type: 'free' | 'moderate' | 'pro';
  billing_cycle: 'monthly' | 'yearly';
  status: 'pending' | 'active' | 'expired';
  amount: number;
  currency: string;
  transaction_ref: string | null;
  started_at: number;
  expires_at: number | null;
  created_at: number;
}

export async function getSubscriptionByUserId(userId: number): Promise<Subscription | undefined> {
  const sql = getDb();
  const rows = await sql<Subscription[]>`SELECT * FROM subscriptions WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1`;
  return rows[0];
}

export async function createSubscription(data: {
  userId: number;
  amount: number;
  planType: 'moderate' | 'pro';
  billingCycle: 'monthly' | 'yearly';
  status?: 'pending' | 'active';
  transactionRef?: string;
}): Promise<Subscription> {
  const sql = getDb();
  const rows = await sql<Subscription[]>`
    INSERT INTO subscriptions (user_id, amount, plan_type, billing_cycle, status, transaction_ref)
    VALUES (${data.userId}, ${data.amount}, ${data.planType}, ${data.billingCycle}, ${data.status || 'pending'}, ${data.transactionRef || null})
    RETURNING *
  `;
  return rows[0];
}

export async function updateSubscriptionStatus(
  userId: number, 
  status: 'active' | 'expired',
  planType: 'moderate' | 'pro' = 'moderate',
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): Promise<void> {
  const sql = getDb();
  const now = Math.floor(Date.now() / 1000);
  const duration = billingCycle === 'yearly' ? 365 : 30;
  const expiresAt = status === 'active' ? now + (duration * 24 * 60 * 60) : null;
  
  await sql`
    UPDATE subscriptions 
    SET status = ${status}, plan_type = ${planType}, billing_cycle = ${billingCycle}, started_at = ${now}, expires_at = ${expiresAt} 
    WHERE user_id = ${userId}
  `;
}
