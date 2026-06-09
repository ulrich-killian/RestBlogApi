import * as postService from '../services/post.service.js';


export const getAllPosts = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, q } = req.query;
    const result = await postService.getAllPosts({
      limit: parseInt(limit),
      offset: parseInt(offset),
      search: q
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = await postService.createPost({
      title,
      content,
      author_id: req.user.userId
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
   next(error)
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = await postService.updatePost(
      req.params.id,
      req.user.userId,
      { title, content }
    );
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error)
    }
};

export const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user.userId);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
   next(error)
 }
};