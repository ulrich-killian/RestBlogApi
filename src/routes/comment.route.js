import express from 'express';
import {
  getCommentsByPostId,
  createComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', getCommentsByPostId);
router.post('/', protectedEntry, createComment);
router.delete('/:commentId', protectedEntry, deleteComment);

export default router;