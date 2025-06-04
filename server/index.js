import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import querystring from 'querystring';
import { EventEmitter } from 'events';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

import db from './database.js'; // your DB connection (make sure it's exported using `export default`)

dotenv.config(); // Load environment variables

// Increase max listeners for event emitters
EventEmitter.defaultMaxListeners = 15;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running and connected to MySQL");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});





