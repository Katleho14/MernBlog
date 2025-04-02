import Post from '../models/post.model.js'
import { errorHandler } from '../utils/error.js';
import { Op } from 'sequelize';

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');

  try {
    const newPost = await Post.create({
      ...req.body,
      slug,
      userId: req.user.id,
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';

    const whereCondition = {};
    if (req.query.userId) whereCondition.userId = req.query.userId;
    if (req.query.category) whereCondition.category = req.query.category;
    if (req.query.slug) whereCondition.slug = req.query.slug;
    if (req.query.postId) whereCondition.id = req.query.postId;
    if (req.query.searchTerm) {
      whereCondition[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.searchTerm}%` } },
        { content: { [Op.iLike]: `%${req.query.searchTerm}%` } },
      ];
    }

    const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
      where: whereCondition,
      order: [['updatedAt', order]],
      offset: startIndex,
      limit,
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthPosts = await Post.count({
      where: { createdAt: { [Op.gte]: oneMonthAgo } },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.destroy({ where: { id: req.params.postId } });
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
      { where: { id: req.params.postId } }
    );
    const updatedPost = await Post.findByPk(req.params.postId);
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    console.log('Incoming request to getPosts:', req.query);

    const whereCondition = {};
    if (req.query.slug) whereCondition.slug = req.query.slug;
    if (req.query.category) whereCondition.category = req.query.category;

    const posts = await Post.findAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
    });

    if (!posts.length) {
      console.log('No posts found for query:', whereCondition);
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error('Error in getPosts:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
