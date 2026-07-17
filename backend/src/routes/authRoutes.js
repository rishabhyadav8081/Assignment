import { Router } from 'express';
import { getProfile, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getProfile);
export default router;
