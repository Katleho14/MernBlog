import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error', err));

app.use(cors({
  origin: "http://localhost:5173", // frontend port
  methods: "GET, POST, PUT, DELETE",
  credentials: true
}));

app.use(express.json()); // ✅ Middleware to parse JSON

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

