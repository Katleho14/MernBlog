// controllers/post.controller.js
import {
  createPost as createPostModel,
  getAllPosts as getAllPostsModel,
  getPostBySlug as getPostBySlugModel,
  updatePost as updatePostModel,
  deletePost as deletePostModel,
  countPosts as countPostsModel,
  countPostsCreatedSince as countPostsCreatedSinceModel
} from '../models/post.model.js';

export const createPost = async (req, res, next) => {
  try {
    const newPost = await createPostModel(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsModel();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await getPostBySlugModel(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const updatedPost = await updatePostModel(req.params.id, req.body);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const deleted = await deletePostModel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const countPosts = async (req, res, next) => {
  try {
    const count = await countPostsModel();
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

export const countPostsCreatedSince = async (req, res, next) => {
  try {
    const date = req.params.date;
    const count = await countPostsCreatedSinceModel(date);
    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};
