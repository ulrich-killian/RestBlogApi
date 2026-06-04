import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;


const sslConfig = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1')
  ? false
  : {

      rejectUnauthorized: process.env.DB_SSL_ALLOW_INSECURE !== 'true',

      ca: process.env.DB_SSL_CA ? process.env.DB_SSL_CA : undefined
    };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

async function connectDb() {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

export { pool, connectDb };