import express from 'express';
import { register, login, getUser, uploadProfile } from '../controllers/auth.controller.js';
import { protectedEntry } from '../middleware/auth.middleware.js';
import { valideRegister, validateLogin, checkValidation } from '../validation/auth.validation.js';
import { authLimiter } from '../middleware/ratelimit.js';
import { upload } from '../middleware/upload.js';


const router = express.Router();

router.post('/register', authLimiter, valideRegister, checkValidation, register);
router.post('/login', authLimiter, validateLogin, checkValidation, login);
router.get('/user', protectedEntry, getUser);
router.post('/profile_upload', protectedEntry, upload.single('profile_picture'), uploadProfile);

export default router;