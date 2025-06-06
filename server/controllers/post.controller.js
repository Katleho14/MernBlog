import {
  createPost as createPostModel,
  getAllPosts as getAllPostsModel,
  getPostBySlug as getPostBySlugModel,
  updatePost as updatePostModel,
  deletePost as deletePostModel,
  countPosts as countPostsModel,
  countPostsCreatedSince as countPostsCreatedSinceModel
} from '../models/post.model.js';

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const newPost = await createPostModel(req.body);
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    next(error);
  }
};

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsModel(req.query); // supports filters/sorting if added
    res.status(200).json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

// Get a single post by slug
export const getPostBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug || req.query.slug;
    const post = await getPostBySlugModel(slug);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// Update a post
export const updatePost = async (req, res, next) => {
  try {
    const updatedPost = await updatePostModel(req.params.id, req.body);
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const deleted = await deletePostModel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Count all posts
export const countPosts = async (req, res, next) => {
  try {
    const count = await countPostsModel();
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};

// Count posts created since a specific date
export const countPostsCreatedSince = async (req, res, next) => {
  try {
    const date = req.params.date;
    const count = await countPostsCreatedSinceModel(date);
    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};
