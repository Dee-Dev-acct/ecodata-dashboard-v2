// Script to add contact@ecodatacic.com admin user to the database
import bcrypt from 'bcrypt';
import pkg from 'pg';
const { Client } = pkg;

// Use DATABASE_URL directly from environment
const DATABASE_URL = process.env.DATABASE_URL;

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function addContactAdminUser() {
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

    // Check if contact admin user already exists
    const checkResult = await client.query(
      "SELECT * FROM users WHERE email = 'contact@ecodatacic.com'"
    );

    if (checkResult.rows.length > 0) {
      console.log('Contact admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword('admin123');

    // Insert contact admin user
    const result = await client.query(
      `INSERT INTO users (
        username, password, email, role, first_name, last_name, bio, created_at
      ) VALUES (
        'contactadmin', $1, 'contact@ecodatacic.com', 'admin', 'Contact', 'Admin', 'ECODATA CIC Contact Administrator', NOW()
      ) RETURNING id`,
      [hashedPassword]
    );

    console.log(`Contact admin user created with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Error creating contact admin user:', error);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL database');
  }
}

// Run the function
addContactAdminUser().catch(console.error);