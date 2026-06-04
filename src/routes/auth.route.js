import express from 'express';
import { register, login, getUser, uploadProfile } from '../controllers/auth.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';
import { valideRegister, validateLogin, checkValidation } from '../validation/auth.validation.js';
import { authLimiter } from '../middleware/ratelimit.js';
import { upload } from '../middleware/upload.js';


const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new system user
 *     description: Creates a user account, hashes credentials, and provisions an access token. Protected by rate limiting.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: dev_user
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@blog.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepass123
 *     responses:
 *       201:
 *         description: User registered successfully. Returns user info and access token.
 *       400:
 *         description: Validation failure (invalid email format or short password).
 *       409:
 *         description: Conflict - Username or email already taken.
 *       429:
 *         description: Too many requests - Rate limit exceeded.
 */
router.post('/register', authLimiter, valideRegister, checkValidation, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate user and receive token
 *     description: Verifies user credentials and returns a secure JWT payload session access token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@blog.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepass123
 *     responses:
 *       200:
 *         description: Successful sign in. Returns access session token.
 *       401:
 *         description: Invalid credentials supplied.
 *       429:
 *         description: Too many login attempts detected.
 */

router.post('/login', authLimiter, validateLogin, checkValidation, login);

/**
 * @openapi
 * /auth/user:
 *   get:
 *     summary: Retrieve currently logged-in user profile
 *     description: Extracts token data from header authorization to search and return personal profile payload details.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched current active profile.
 *       401:
 *         description: Unauthorized - missing, malformed, or expired JWT bearer token.
 *       404:
 *         description: Bound user account data record no longer exists.
 */

router.get('/user', protectedEntry, getUser);
/**
 * @openapi
 * /auth/profile_upload:
 *   post:
 *     summary: Upload account avatar profile picture
 *     description: Uploads a binary image asset file up to 2MB. Updates target profile reference pointer links.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file payload asset (JPG/PNG format, max 2MB).
 *     responses:
 *       200:
 *         description: File processed and profile image pointer successfully updated.
 *       400:
 *         description: Upload failed due to incorrect form-data key or oversize file constraint.
 *       401:
 *         description: Authorized signature missing from request header parameters.
 */
router.post('/profile_upload', protectedEntry, upload.single('file'), uploadProfile);

export default router;