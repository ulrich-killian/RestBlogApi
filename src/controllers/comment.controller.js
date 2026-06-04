import * as commentService from '../services/comment.service.js';


export const getCommentsByPostId = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByPostId(req.params.id);
    res.status(200).json({ success: true, data: comments, count: comments.length });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }
    const comment = await commentService.createComment({
      content,
      post_id: req.params.id,
      author_id: req.user.userId
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.commentId, req.user.userId);
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
   next(error)
  }
};