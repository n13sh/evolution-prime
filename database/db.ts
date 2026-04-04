import 'server-only';
import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

function createConnection() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // port 6543 = Supabase transaction pooler (needs prepare:false)
  // port 5432 = direct connection (supports prepared statements)
  const isPooler = connectionString.includes(':6543');

  return postgres(connectionString, {
    prepare: isPooler ? false : true,
    ssl: 'require',
    max: 2,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export function getDb() {
  if (!global.__sql) {
    global.__sql = createConnection();
  }
  return global.__sql;
}

export default getDb;
