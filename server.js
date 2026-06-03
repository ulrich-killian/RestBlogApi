import express from 'express'
import 'dotenv/config'
import { connectDb } from './src/config/db.config.js'
import { createTables } from './src/models/schema.js'
import authRoutes from './src/routes/auth.route.js';


const app = express()

const port = process.env.PORT

app.use('/auth', authRoutes);

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