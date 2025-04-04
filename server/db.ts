import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Check if we have a database URL
let client;
let db;

if (process.env.DATABASE_URL) {
  // Create postgres client
  client = postgres(process.env.DATABASE_URL);
  
  // Create drizzle instance
  db = drizzle(client, { schema });
}

export { db, client };
