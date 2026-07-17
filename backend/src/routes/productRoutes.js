import { Router } from 'express';
import { categories, createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../controllers/productController.js';
import { allowRoles, protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = Router();
router.get('/', listProducts);
router.get('/categories', categories);
router.get('/:id', getProduct);
router.post('/', protect, allowRoles('admin', 'sales'), upload.single('image'), createProduct);
router.put('/:id', protect, allowRoles('admin', 'sales'), upload.single('image'), updateProduct);
router.delete('/:id', protect, allowRoles('admin', 'sales'), deleteProduct);
export default router;

