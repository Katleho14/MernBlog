
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database.js"); // Connect to MySQL
const querystring = require("querystring");

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





