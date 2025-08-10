import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

// Initialize Drizzle with Vercel Postgres
// This will work in production with Vercel Postgres, 
// and gracefully handle missing config in development
export const db = drizzle(sql, { schema });

export type DB = typeof db;