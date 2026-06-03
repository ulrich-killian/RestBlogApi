import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { pool, connectDb } from '../config/db.config.js'

export const register  = async ({ username, password, email }) => {
      const existing = await pool.query(
         'SELECT id FROM users WHERE email = $1 OR username = $2',
         [email, username]
      );

      if (existing.rows.length > 0) {
         throw new Error('Email or username already exist');
      }
}