import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we have a database URL
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn('No POSTGRES_URL found, database operations may fail');
}

// Create PostgreSQL connection only if we have a connection string
const sql = connectionString ? postgres(connectionString, {
  ssl: connectionString.includes('sslmode=require') ? 'require' : false,
  max: 1,
}) : null;

// Initialize Drizzle with PostgreSQL or a mock
export const db = sql ? drizzle(sql, { schema }) : null as any;

export type DB = typeof db;