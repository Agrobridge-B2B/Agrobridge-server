import { Router } from 'express';
import authRouter from './auth.routes';

const routes = Router();

// test check route
routes.get('/test', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

routes.get('/', (req, res) => {
  res.send('Welcome to the Agrobridge API');
});

routes.use('/auth', authRouter);

export default routes;
