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
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerSpec from './src/config/swagger.js';
import { globalErrorHandler }  from './src/middleware/error.middleware.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

const port = process.env.PORT || 5500;

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-standalone-preset.min.js'
  ]
}));


app.get('/api-docs-json', (req, res) => {
  res.json(swaggerSpec);
});

app.use(generalLimiter);
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.get('/search', getAllPosts);
app.use('/posts/:id/comments', commentRoutes);
app.use('/comments', deleteCommentRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
   res.send('welcome to restfulblog api')
})

app.use(globalErrorHandler);

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