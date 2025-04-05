// Simple script to add admin user to the database
import bcrypt from 'bcrypt';
import pg from 'pg';
const { Client } = pg;

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function addAdminUser() {
  // Create PostgreSQL client
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Needed for some PostgreSQL providers like Heroku
    }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Check if admin user already exists
    const checkResult = await client.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );

    if (checkResult.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword('admin123');

    // Insert admin user
    const result = await client.query(
      `INSERT INTO users (
        username, password, email, role, bio, created_at
      ) VALUES (
        'admin', $1, 'admin@ecodatacic.org', 'admin', 'System administrator', NOW()
      ) RETURNING id`,
      [hashedPassword]
    );

    console.log(`Admin user created with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL database');
  }
}

// Run the function
addAdminUser().catch(console.error);