import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/post.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';
import { validatePost, checkValidation } from '../validation/post.validation.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', protectedEntry, validatePost, checkValidation, createPost);
router.put('/:id', protectedEntry, updatePost);
router.delete('/:id', protectedEntry, deletePost);

export default router;