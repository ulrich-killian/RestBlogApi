import express from 'express';
import {
  getCommentsByPostId,
  createComment,
  deleteComment
} from '../controllers/comment.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });


/**
 * @openapi
 * /posts/{id}/comments:
 *   get:
 *     summary: Retrieve comments for a specific post
 *     description: Fetches a list of all user comments left under a single blog post resource.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB object hexadecimal ID of the target blog post.
 *     responses:
 *       200:
 *         description: A collection array of comments retrieved successfully.
 *       404:
 *         description: The parent post ID could not be found in the database system.
 */
router.get('/', getCommentsByPostId);

/**
 * @openapi
 * /posts/{id}/comments:
 *   post:
 *     summary: Add a new comment to a blog post
 *     description: Publishes a text feedback comment attached to a specified target post. Requires user authentication token session data.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB object hexadecimal ID of the blog post to comment on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This article explained nested routing beautifully! Thanks for sharing.
 *     responses:
 *       201:
 *         description: Comment published and linked to post successfully.
 *       400:
 *         description: Bad request - message comment text content parameter is missing or empty.
 *       401:
 *         description: Unauthorized signature - missing, invalid, or expired session JWT.
 *       404:
 *         description: Target post matching the path parameter ID does not exist.
 */
router.post('/', protectedEntry, createComment);

/**
 * @openapi
 * /posts/{id}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment from a post
 *     description: Permanently drops a specific comment entry resource from its corresponding parent post context. Restricted to authenticated author roles.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The hexadecimal identity string of the parent blog post.
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The precise unique database ID of the comment targeted for removal.
 *     responses:
 *       200:
 *         description: Comment dropped and removed from database indexes successfully.
 *       401:
 *         description: Unauthorized session token parameter validation checkpoint failure.
 *       403:
 *         description: Forbidden action - current logged-in user is not the author of this comment.
 *       404:
 *         description: Target resource parameters did not match any active database comment indexes.
 */
router.delete('/:commentId', protectedEntry, deleteComment);

export default router;