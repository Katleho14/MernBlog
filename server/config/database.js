import { Sequelize } from 'sequelize';
import * as mysql from 'mysql2'; // ✅ fix here
import mysqlPromise from 'mysql2/promise'; // optional: for raw pool usage
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mern_blog',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql,
    logging: false,
  }
);

// Optional: use this for raw queries if needed
const pool = mysqlPromise.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mern_blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default { sequelize, pool };
