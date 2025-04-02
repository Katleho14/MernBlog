import express from 'express';
import { create, getPosts, deletePost, updatePost, getPost } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getPosts', getPosts);
router.delete('/deletePost/:postId/:userId', verifyToken, deletePost);
router.put('/updatePost/:postId/:userId', verifyToken, updatePost);
router.get('/getPost', getPost); // Add this line

export default router;