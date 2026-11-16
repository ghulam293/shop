import express from 'express';
import { register, login, getMe, unblockUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/unblock', authenticate, unblockUser);
router.get('/me', authenticate, getMe);

export default router;
