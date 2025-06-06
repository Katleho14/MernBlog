import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  countPosts,
  countPostsCreatedSince
} from '../controllers/post.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a post (protected)
router.post('/create', verifyToken, createPost);

// Get all posts (with optional filters)
router.get('/getPosts', getAllPosts);

// ✅ Get single post by slug
router.get('/getPost/:slug', getPostBySlug);

// Update post (protected)
router.put('/updatePost/:id', verifyToken, updatePost);

// Delete post (protected)
router.delete('/deletePost/:id', verifyToken, deletePost);

// Get post count
router.get('/count', countPosts);
router.get('/count/:date', countPostsCreatedSince);

export default router;
