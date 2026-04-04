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

  return postgres(connectionString, {
    prepare: false,       // required for Supabase transaction pooler
    ssl: 'require',
    max: 1,               // serverless: one connection per function instance
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
