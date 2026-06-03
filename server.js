import express from 'express'
import 'dotenv/config'
import { connectDb } from './src/config/db.config.js'
import { createTables } from './src/models/schema.js'
import authRoutes from './src/routes/auth.route.js';
import { generalLimiter } from './src/middleware/ratelimit.js';
import postRoutes from './src/routes/post.route.js';
import { getAllPosts } from './src/controllers/post.controller.js';
import commentRoutes from './src/routes/comment.route.js';
import deleteCommentRoute from './src/routes/deleteComment.route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

const port = process.env.PORT

app.use(generalLimiter);


app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.get('/search', getAllPosts);
app.use('/posts/:id/comments', commentRoutes);
app.use('/comments', deleteCommentRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
   res.send('newly created server')
})

const startServer = async () => {
   try {
      await connectDb();
      await createTables();
      app.listen(port, () => {
         console.log(`server is running http://localhost:${port}`)
      })
   } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
   }
}
startServer();