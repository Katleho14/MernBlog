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

router.post('/create', verifyToken, createPost);
router.get('/getPosts', getAllPosts);
router.get('/getPost/:slug', getPostBySlug);
router.put('/updatePost/:id', verifyToken, updatePost);
router.delete('/deletePost/:id', verifyToken, deletePost);
router.get('/count', countPosts);
router.get('/count/:date', countPostsCreatedSince);

export default router;
