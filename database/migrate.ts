import getDb from './db';

async function migrate() {
  const sql = getDb();
  console.log('--- STARTING EVOLUTION PRIME MIGRATION ---');

  try {
    // 1. Pre-verify all existing users
    console.log('Updating user verification status...');
    await sql`UPDATE users SET is_verified = 1 WHERE is_verified = 0`;

    // 2. Grant 30 days of Free access to any trainee without a subscription record
    console.log('Ensuring trainees have baseline subscription records...');
    const now = Math.floor(Date.now() / 1000);
    const expires = now + (30 * 24 * 60 * 60);

    // Get trainees without subscriptions
    const trainees = await sql`
      SELECT id FROM users 
      WHERE role = 'trainee' 
      AND id NOT IN (SELECT user_id FROM subscriptions)
    `;

    for (const t of trainees) {
      await sql`
        INSERT INTO subscriptions (user_id, plan_type, status, amount, currency, started_at, expires_at)
        VALUES (${t.id}, 'free', 'active', 0, 'INR', ${now}, ${expires})
      `;
    }

    console.log(`Migration complete. Updated ${trainees.length} trainees.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
