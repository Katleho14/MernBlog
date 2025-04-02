import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mern_blog',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql, // Use mysql2 as the dialect module
    logging: false, // Set to true to see SQL queries
  }
);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mern_blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default { sequelize, pool };
