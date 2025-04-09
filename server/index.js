import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import db from './config/database.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

const { sequelize, pool } = db;

dotenv.config();

const app = express();

// ✅ Use a safe port (not 3306)
const PORT = process.env.PORT && process.env.PORT !== '3306' ? process.env.PORT : 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://mernblog-q4t5.onrender.com'],
    credentials: true,
  })
);

// Test MySQL Connection (Pool)
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Connected Successfully (Pool)');
    connection.release();
  })
  .catch((err) => console.error('❌ MySQL Connection Failed (Pool):', err));

// Connect to MySQL using Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ MySQL connected (Sequelize)');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Database synchronized');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MySQL connection error (Sequelize):', err);
  });

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve static files in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/dist', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});



