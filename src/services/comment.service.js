import * as commentRepo from '../repositories/comment.repo.js'
import { findPostById } from '../repositories/post.repo.js';
import AppError from '../utils/appError.js'

export const getCommentsByPostId = async (postId) => {
  const post = await findPostById(postId);
  if (!post)
  throw new AppError('POST_NOT_FOUND', 404);
  return await commentRepo.findCommentsByPostId(postId);
};

export const createComment = async ({ content, post_id, author_id }) => {
  const post = await findPostById(post_id);
  if (!post)
  throw new AppError('POST_NOT_FOUND', 404);
  return await commentRepo.createComment({ content, post_id, author_id });
};

export const deleteComment = async (id, userId) => {
  const comment = await commentRepo.findCommentById(id);
  if (!comment)
  throw new AppError('COMMENT_NOT_FOUND', 404);
  if (comment.author_id !== userId)
  throw new AppError('UNAUTHORIZED', 404);
  return await commentRepo.deleteComment(id);
};