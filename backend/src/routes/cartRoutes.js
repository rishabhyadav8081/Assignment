import { Router } from 'express';
import { addCartItem, clearCart, getCart, removeCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.get('/', getCart);
router.post('/', addCartItem);
router.delete('/', clearCart);
router.delete('/:productId', removeCartItem);
export default router;

