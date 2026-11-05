import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '../../.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined.');
}

const pool = new Pool({ connectionString: databaseUrl });

export const db = drizzle(pool, { schema });
