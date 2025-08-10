import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL || 'postgresql://user:password@localhost:5432/db',
  },
  verbose: true,
  strict: true,
} satisfies Config;