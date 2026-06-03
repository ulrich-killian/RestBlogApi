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

      const salt = bcrypt.genSalt(12)
      const hash_password = await bcrypt.hash(password, salt)
      const result = await pool.query(
         'INSERT INTO users (username, email, hash_password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
         [username, email, hash_password]
      );


      const user = result.rows[0];
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '12h'});
      return {user, token}
};

export const login = async ({ email, password }) => {
   const result = pool.query('SELECT * FROM users WHERE email = $1', [email]);
   if(result.rows.length === 0){
   throw new Error('Invalid Credentails')
   }

   const user = (await result).rows[0];
   const valid = await bcrypt.compare(password, user.hash_password)
   if(!valid){
      throw new Error("Invalid Credentails");
   }

   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '12h'});
   return {
      user: {id: user.id, username: user.username, email: user.email },
      token
   };
};

export const getUser = async ({ userId }) => {
   const result = await pool.query(
      'SELECT id, username, email, profile_picture, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) throw new Error('USER_NOT_FOUND');
  return result.rows[0];
}