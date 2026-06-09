import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restful Blog API',
      version: '1.0.0',
      description: 'A high-concurrency backend for Resful Blog Api',
    },
    servers: [
      { url: 'http://localhost:5500', description: 'Development' },
      { url: 'https://restfull-blog-api.onrender.com', description: 'Production' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

export default swaggerJsdoc(options);