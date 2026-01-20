import { Router } from 'express';

const routes = Router();

// test check route
routes.get('/test', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

routes.get('/', (req, res) => {
  res.send('Welcome to the Agrobridge API');
});

export default routes;
