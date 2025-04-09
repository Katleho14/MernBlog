import { Sequelize } from 'sequelize';
import * as mysql from 'mysql2'; // ✅ Needed for Sequelize dialect
import mysqlPromise from 'mysql2/promise'; // ✅ Optional: raw pool usage
import dotenv from 'dotenv';

dotenv.config();

// ✅ Use IPv4 loopback address instead of 'localhost'
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_NAME = process.env.DB_NAME || 'mern_blog';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

// ✅ Sequelize ORM setup
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  dialectModule: mysql,
  logging: false,
});

// ✅ Optional connection test (safe to remove in production)
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected to MySQL successfully!'))
  .catch(err => console.error('❌ Sequelize connection error:', err));

// ✅ MySQL raw pool (for custom queries)
const pool = mysqlPromise.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default { sequelize, pool };

