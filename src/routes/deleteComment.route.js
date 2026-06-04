import express from 'express';
import { deleteComment } from '../controllers/comment.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     summary: Permanently delete a comment by its direct ID
 *     description: Drops a specific comment record from the database using its unique identifier. Restricted to the authenticated user who wrote the comment.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB hexadecimal Object ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment successfully deleted from the system database.
 *       401:
 *         description: Unauthorized - Access token is missing, malformed, or expired.
 *       403:
 *         description: Forbidden - You do not have permission to delete this comment (not the author).
 *       404:
 *         description: Not Found - No comment matches the provided identifier.
 */
router.delete('/:commentId', protectedEntry, deleteComment);

export default router;