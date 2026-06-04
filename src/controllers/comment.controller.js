import * as commentService from '../services/comment.service.js';

export const getCommentsByPostId = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId) || postId <= 0) {
      return res.status(400).json({ error: 'Invalid post_id' });
    }

    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json({ success: true, data: comments, count: comments.length });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId) || postId <= 0) {
      return res.status(400).json({ error: 'Invalid post_id' });
    }

    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await commentService.createComment({
      content,
      post_id: postId,
      author_id: req.user.userId
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {

    const commentId = parseInt(req.params.commentId, 10);
    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await commentService.deleteComment(commentId, req.user.userId);
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};