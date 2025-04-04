import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import mssql from "mssql";
import * as schema from "@shared/schema";

// Database clients
let pgClient;
let mssqlClient: mssql.ConnectionPool | null = null;
let mssqlPool: mssql.ConnectionPool | null = null;
let db: any;

const useMSSQL = process.env.MSSQL_SERVER && 
                  process.env.MSSQL_DATABASE && 
                  process.env.MSSQL_USER && 
                  process.env.MSSQL_PASSWORD;

// Try MSSQL Server connection first
if (useMSSQL) {
  console.log("Attempting to connect to Microsoft SQL Server...");
  console.log(`Server: ${process.env.MSSQL_SERVER}`);
  console.log(`Database: ${process.env.MSSQL_DATABASE}`);
  console.log(`User: ${process.env.MSSQL_USER}`);
  console.log(`Password: ${'*'.repeat(process.env.MSSQL_PASSWORD?.length || 0)}`);
  
  // MSSQL connection config
  const config: mssql.config = {
    server: process.env.MSSQL_SERVER as string,
    database: process.env.MSSQL_DATABASE as string,
    user: process.env.MSSQL_USER as string,
    password: process.env.MSSQL_PASSWORD as string,
    options: {
      encrypt: true,
      trustServerCertificate: true,
      enableArithAbort: true,
    },
    connectionTimeout: 30000 // 30 seconds timeout
  };

  // Create connection pool
  mssqlPool = new mssql.ConnectionPool(config);
  
  // Connect to pool
  mssqlPool.connect()
    .then(pool => {
      console.log("Connected to SQL Server successfully!");
      mssqlClient = pool;
      
      // Test query to verify connection
      return pool.request().query('SELECT 1 as test');
    })
    .then(result => {
      if (result) {
        console.log("Test query successful:", result.recordset);
      }
      // For SQL Server, we're using raw queries for now
      // In a future update, we can implement proper Drizzle SQL Server support
    })
    .catch(err => {
      console.error("Error connecting to SQL Server:", err);
      // Log full connection details for debugging
      console.error("Connection details:", {
        server: process.env.MSSQL_SERVER,
        database: process.env.MSSQL_DATABASE,
        user: process.env.MSSQL_USER,
        passwordLength: process.env.MSSQL_PASSWORD?.length
      });
      // Fallback to Postgres if available
      connectToPostgres();
    });
} else {
  // Fallback to Postgres
  connectToPostgres();
}

// Helper function to connect to Postgres
function connectToPostgres() {
  if (process.env.DATABASE_URL) {
    console.log("Using PostgreSQL connection...");
    // Create postgres client
    pgClient = postgres(process.env.DATABASE_URL);
    
    // Create drizzle instance
    db = drizzle(pgClient, { schema });
  } else {
    console.warn("No database configuration found. Using in-memory storage.");
  }
}

export { db, pgClient, mssqlClient, useMSSQL };
