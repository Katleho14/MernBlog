import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

function connectToDatabase() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  connection.connect((error) => {
    if (error) {
      console.error('❌ Error connecting to MySQL database:', error);
    } else {
      console.log('✅ Connected to MySQL database!');
    }
  });

  return connection;
}

const connection = connectToDatabase();
export default connection;



