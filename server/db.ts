import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

// Check if we have a database URL
let client;
let db;

if (process.env.DATABASE_URL) {
  // Create serverless neon client
  client = neon(process.env.DATABASE_URL);
  
  // Create drizzle instance
  db = drizzle(client, { schema });
}

export { db, client };
