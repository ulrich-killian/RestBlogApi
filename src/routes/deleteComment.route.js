import express from 'express';
import { deleteComment } from '../controllers/comment.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';

const router = express.Router();
router.delete('/:id', protectedEntry, deleteComment);

export default router;