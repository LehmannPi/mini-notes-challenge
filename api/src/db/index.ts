import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema.js';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
export const db = drizzle(sql, { schema });

if (process.env.MIGRATE_ON_STARTUP === 'true') {
  migrate(db, { migrationsFolder: './drizzle' }).catch(console.error);
}
