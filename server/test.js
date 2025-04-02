// filepath: c:\Users\Katleho\MernBlog\server\test.js
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    process.exit(0); // Exit if successful
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Exit with an error code
  }
}

testConnection();