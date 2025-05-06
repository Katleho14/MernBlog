import { Sequelize } from 'sequelize';
import mysql from 'mysql2'; // ✅ Corrected import for MySQL
import mysqlPromise from 'mysql2/promise'; // ✅ Corrected import for promise-based pool
import dotenv from 'dotenv';

dotenv.config();

// Get connection details from environment variables or Railway's provided URL
const dbUrl = process.env.DATABASE_URL; // Railway often provides a full URL like mysql://user:password@host:port/database
const parsedDbUrl = new URL(dbUrl);

// Extract credentials from the Railway URL
const DB_HOST = parsedDbUrl.hostname;
const DB_PORT = parsedDbUrl.port || 3306; // Default MySQL port
const DB_USER = parsedDbUrl.username;
const DB_PASSWORD = parsedDbUrl.password;
const DB_NAME = parsedDbUrl.pathname.split('/')[1]; // Database name is after the slash in the URL

// Sequelize instance (ORM)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectModule: mysql, // Use mysql2 module here for Sequelize
  logging: false,
});

// Optional: use this for raw queries if needed
const pool = mysqlPromise.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default { sequelize, pool };

