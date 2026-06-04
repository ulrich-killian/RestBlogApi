import * as authService from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import { pool } from '../config/db.config.js';

export const register = async (req, res, next) => {
   try {
      const { username, email, password } = req.body;

      const result = await authService.register({ username, email, password });
      res.status(201).json({ success: true, ...result });
   } catch (error) {
     next(error);
   }
};

export const login = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json({ success: true, ...result });
   } catch (error) {
      next(error);
   }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await authService.getUser(req.user)
    res.status(200).json({ success: true, data: user });
  } catch (error) {
   next(error);
  }
};


export const uploadProfile = async (req, res, next) => {
   try {
     if (!req.file) {
       throw new AppError('No file uploaded', 400);
     }
 
     const fileUrl = `/uploads/${req.file.filename}`;
 
     await pool.query(
       'UPDATE users SET profile_picture = $1 WHERE id = $2',
       [fileUrl, req.user.id]
     );
 
     res.status(200).json({
       success: true,
       message: 'Profile picture uploaded successfully',
       profile_picture: fileUrl
     });
   } catch (error) {
     next(error);
   }
 };