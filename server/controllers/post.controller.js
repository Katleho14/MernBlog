// controllers/postController.js
import {
  createPost,
  getAllPosts,
  getPostBySlug,
  getPostById, // New import for fetching by ID
  updatePost as updatePostModel,
  deletePost as deletePostModel,
  countPosts,
  countPostsCreatedSince
} from '../models/postModel.js'; // Adjust path as needed to your postModel.js

import { errorHandler } from '../utils/error.js'; // Adjust path as needed to your error utility

// Helper function to generate a slug from a title
const generateSlug = (title) => {
  return title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
};

/**
 * Handles the creation of a new post.
 * Requires admin privileges and checks for required fields.
 */
export const create = async (req, res, next) => {
  // Assuming req.user is populated by an authentication middleware
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields (title, content)'));
  }

  const slug = generateSlug(req.body.title);

  try {
    // Call the raw SQL function to create the post
    const newPost = await createPost({
      ...req.body,
      slug,
      userId: req.user.id, // Assign the user ID from the authenticated user
    });
    res.status(201).json(newPost);
  } catch (error) {
    // MySQL error code for duplicate entry (e.g., for unique title or slug)
    if (error.code === 'ER_DUP_ENTRY') {
      return next(errorHandler(409, 'A post with this title or slug already exists.'));
    }
    next(error); // Pass other errors to the general error handling middleware
  }
};

/**
 * Handles fetching multiple posts with filtering, pagination, and sorting.
 */
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    // Build filters object from query parameters
    const filters = {};
    if (req.query.userId) filters.userId = parseInt(req.query.userId);
    if (req.query.category) filters.category = req.query.category;
    if (req.query.slug) filters.slug = req.query.slug;
    if (req.query.postId) filters.id = parseInt(req.query.postId); // Renamed from postId to id for consistency with model
    if (req.query.searchTerm) filters.searchTerm = req.query.searchTerm;

    // Fetch posts using the raw SQL function with filters, pagination, and order
    const posts = await getAllPosts(filters, startIndex, limit, order);

    // Get total count of posts matching filters (without pagination)
    const totalPosts = await countPosts(filters);

    // Calculate posts created in the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const lastMonthPosts = await countPostsCreatedSince(oneMonthAgo);

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles deleting a post.
 * Requires admin privileges or the user to be the post's author.
 */
export const deletePost = async (req, res, next) => {
  // Ensure the user is an admin OR the authenticated user's ID matches the post's author ID
  // It's safer to fetch the post first to verify userId, but for this example,
  // we're assuming req.params.userId is the author's ID provided in the route.
  if (!req.user || (!req.user.isAdmin && req.user.id !== req.params.userId)) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }

  try {
    // Call the raw SQL function to delete the post by its ID
    const isDeleted = await deletePostModel(req.params.postId);

    if (isDeleted) {
      res.status(200).json('The post has been deleted successfully.');
    } else {
      // If no rows were affected, the post was not found
      next(errorHandler(404, 'Post not found or could not be deleted.'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Handles updating an existing post.
 * Requires admin privileges or the user to be the post's author.
 */
export const updatePost = async (req, res, next) => {
  // Ensure the user is an admin OR the authenticated user's ID matches the post's author ID
  if (!req.user || (!req.user.isAdmin && req.user.id !== req.params.userId)) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  // If the title is being updated, regenerate the slug
  if (req.body.title) {
    req.body.slug = generateSlug(req.body.title);
  }

  try {
    // Call the raw SQL function to update the post by its ID
    const updatedPost = await updatePostModel(req.params.postId, req.body);

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      // If no post was found or no changes were made
      next(errorHandler(404, 'Post not found or no changes were provided.'));
    }
  } catch (error) {
    // Handle duplicate entry error for title/slug during update
    if (error.code === 'ER_DUP_ENTRY') {
      return next(errorHandler(409, 'Another post with this title or slug already exists.'));
    }
    next(error);
  }
};

/**
 * Handles fetching a single post, primarily by slug or category.
 * This function is distinct from `getPosts` which handles multiple posts.
 */
export const getPost = async (req, res, next) => {
  try {
    console.log('Incoming request to getPost:', req.query);

    const filters = {};
    if (req.query.slug) filters.slug = req.query.slug;
    if (req.query.category) filters.category = req.query.category;

    let postsResult = [];

    // If a slug is provided, prioritize fetching that specific post
    if (filters.slug) {
      const post = await getPostBySlug(filters.slug);
      if (post) {
        postsResult.push(post);
      }
    } else if (filters.category) {
      // If only category is provided, fetch posts by category (can return multiple)
      // We use getAllPosts for this, potentially with a higher limit if this route is for "related posts"
      postsResult = await getAllPosts({ category: filters.category }, 0, 100, 'DESC'); // Fetch up to 100 posts for a category
    }

    // If neither slug nor category is provided, or if you want to fetch by ID for a single post
    // (e.g., /api/post?postId=123)
    if (!filters.slug && !filters.category && req.query.postId) {
      const post = await getPostById(parseInt(req.query.postId));
      if (post) {
        postsResult.push(post);
      }
    }

    if (postsResult.length === 0) {
      console.log('No posts found for query:', filters);
      return res.status(404).json({ success: false, message: 'No posts found' });
    }

    res.status(200).json({ success: true, posts: postsResult });
  } catch (error) {
    console.error('Error in getPost:', error);
    next(error); // Pass error to general error handling middleware
  }
};