import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: "Email already exists" }) // 409 Conflict
    }

    res.status(500).json({ message: error.message });
    next(error);
  }
};