import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const navigate = useNavigate();
  const liked = wishlist.products.some((item) => item._id === product._id);
  const requireLogin = (action) => user ? action() : navigate('/login');
  return <article className="card group overflow-hidden">
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <button onClick={() => requireLogin(() => toggleWishlist(product._id))} className="absolute right-3 top-3 rounded-full bg-white p-2 shadow" aria-label="Wishlist"><Heart size={18} className={liked ? 'fill-rose-500 text-rose-500' : ''}/></button>
    </div>
    <div className="p-4"><p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{product.category}</p><h3 className="mt-1 truncate font-semibold">{product.name}</h3><div className="mt-4 flex items-center justify-between"><div><p className="text-lg font-bold">₹{product.price.toLocaleString('en-IN')}</p><p className="text-xs text-slate-500">{product.stock ? `${product.stock} in stock` : 'Out of stock'}</p></div><button disabled={!product.stock} onClick={() => requireLogin(() => addToCart(product._id))} className="rounded-lg bg-brand-600 p-2.5 text-white hover:bg-brand-900 disabled:bg-slate-300" aria-label="Add to cart"><ShoppingCart size={19}/></button></div></div>
  </article>;
}

