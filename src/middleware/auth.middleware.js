import jwt, { decode } from 'jsonwebtoken'

export const protectedEntry = async (req, res, next) => {
   let token = req.headers.authorization;
   if(!token || !token.startWith('Bearer')) {
      return res.status(401).json({ message: 'Unauthorized, missing token' })
   }

   token = token.split(' ')[1];
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(401).json({ message: 'Unauthorized, invalid token', err });
   }
};