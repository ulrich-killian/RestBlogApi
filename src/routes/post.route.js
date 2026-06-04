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

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Retrieve a list of blog posts
 *     description: Fetches all blog posts from the database. Supports text search filtering and pagination query inputs.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword or phrase to match against post titles or content.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The maximum number of post items to return in the response array.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The starting index pointer offset for pagination skipping.
 *     responses:
 *       200:
 *         description: Successfully fetched collection array of post structures.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', getAllPosts);

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     summary: Get a single blog post by its ID
 *     description: Returns detailed data records for an individual post along with its comments.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique hexadecimal MongoDB Object ID of the post.
 *     responses:
 *       200:
 *         description: Found and returned target post object details.
 *       404:
 *         description: Post not found matching the provided path ID.
 */
router.get('/:id', getPostById);

/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Create a new blog post
 *     description: Publishes a new entry article to the blog platform feed indexes.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Building High-Performance REST APIs with Node.js
 *               content:
 *                 type: string
 *                 example: When writing production code, connection pools and indexing are essential concepts...
 *     responses:
 *       201:
 *         description: Post published and saved successfully.
 *       400:
 *         description: Validation failure - Title or body content properties are invalid or missing.
 *       401:
 *         description: Unauthorized - Bearer token is missing, invalid, or expired.
 */
router.post('/', protectedEntry, validatePost, checkValidation, createPost);

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     summary: Update an existing blog post
 *     description: Modifies text content values of an already published post record. Restricted to the original author.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identification string of the post target.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title for High-Performance REST APIs
 *               content:
 *                 type: string
 *                 example: Revised document details body text content goes right here...
 *     responses:
 *       200:
 *         description: Post records successfully modified and persisted.
 *       401:
 *         description: Unauthorized - Active bearer credential check verification failed.
 *       403:
 *         description: Forbidden - You do not have permission to modify this post (not your asset).
 *       404:
 *         description: Target post document matching identifier parameter was not found.
 */
router.put('/:id', protectedEntry, updatePost);

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Permanently wipes a post item and its underlying comments from system memory collection indexes. Restricted to the author.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique string identifier matching the target post entity.
 *     responses:
 *       200:
 *         description: Post resource permanently deleted from database clusters.
 *       401:
 *         description: Unauthorized identity token verification failure checkpoint.
 *       403:
 *         description: Forbidden action - Current user account is not the owner author of this post.
 *       404:
 *         description: Target data reference post could not be mapped to an existing document index.
 */
router.delete('/:id', protectedEntry, deletePost);

export default router;