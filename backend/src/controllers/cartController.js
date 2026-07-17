import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';
import asyncHandler from '../utils/asyncHandler.js';

const populatedCart = (user) => Cart.findOne({ user }).populate('items.product');

export const getCart = asyncHandler(async (req, res) => res.json((await populatedCart(req.user._id)) || { items: [] }));
export const addCartItem = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const quantity = Math.max(1, Number(req.body.quantity) || 1);
  if (quantity > product.stock) return res.status(400).json({ message: 'Quantity exceeds available stock' });
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });
  const item = cart.items.find((entry) => entry.product.toString() === product._id.toString());
  if (item) item.quantity = quantity; else cart.items.push({ product: product._id, quantity });
  await cart.save();
  res.json(await populatedCart(req.user._id));
});
export const removeCartItem = asyncHandler(async (req, res) => {
  await Cart.updateOne({ user: req.user._id }, { $pull: { items: { product: req.params.productId } } });
  res.json((await populatedCart(req.user._id)) || { items: [] });
});
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } });
  res.json({ items: [] });
});

export const getWishlist = asyncHandler(async (req, res) => res.json((await Wishlist.findOne({ user: req.user._id }).populate('products')) || { products: [] }));
export const toggleWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate({ user: req.user._id }, { $setOnInsert: { user: req.user._id } }, { upsert: true, new: true });
  const exists = wishlist.products.some((id) => id.toString() === req.params.productId);
  if (exists) wishlist.products.pull(req.params.productId); else wishlist.products.push(req.params.productId);
  await wishlist.save();
  res.json(await wishlist.populate('products'));
});

