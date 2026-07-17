import { Router } from 'express';
import { allOrders, createPaymentOrder, myOrders, sellerOrders, stats, updateOrderStatus, verifyPayment } from '../controllers/orderController.js';
import { allowRoles, protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);
router.get('/mine', myOrders);
router.get('/seller', allowRoles('sales', 'admin'), sellerOrders);
router.get('/stats', allowRoles('admin'), stats);
router.get('/', allowRoles('admin'), allOrders);
router.patch('/:id/status', allowRoles('admin'), updateOrderStatus);
export default router;

