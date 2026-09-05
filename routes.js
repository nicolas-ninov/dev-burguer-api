import { Router } from 'express';
import multer from 'multer';
import ProductController from './src/app/controllers/ProductController.js';
import SessionController from './src/app/controllers/SessionController.js';
import UserController from './src/app/controllers/UserController.js';
import multerConfig from './src/config/multer.cjs';
import authMiddleware from './src/middlewares/auth.js';

const routes = new Router();

const upload = multer(multerConfig)

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);


export default routes;