import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Use environment variable for database connection
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create SQL connection
const sql = neon(databaseUrl);

// Create Drizzle ORM instance
export const db = drizzle(sql, { schema });