import express from 'express';
import { register, login, forgotPassword, resetPassword, verifyEmail } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected route example
router.get('/admin/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

export default router;