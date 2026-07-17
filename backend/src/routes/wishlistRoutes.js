import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.get('/', getWishlist);
router.put('/:productId', toggleWishlist);
export default router;

