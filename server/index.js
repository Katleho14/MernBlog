import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Import CORS
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error', err));

const app = express();

// ✅ Enable CORS for frontend requests
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend to access backend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// ✅ Use Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

// ✅ Global Error Handling Middleware (Fix `err` not defined issue)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ 
        success: false,
        statusCode,
        message,
    });
});


