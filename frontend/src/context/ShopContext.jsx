import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState({ products: [] });
  const refresh = async () => {
    if (!user) return;
    const [cartResult, wishlistResult] = await Promise.all([api.get('/cart'), api.get('/wishlist')]);
    setCart(cartResult.data); setWishlist(wishlistResult.data);
  };
  useEffect(() => { if (user) refresh().catch(() => {}); else { setCart({ items: [] }); setWishlist({ products: [] }); } }, [user]);
  const addToCart = async (productId, quantity = 1) => setCart((await api.post('/cart', { productId, quantity })).data);
  const removeFromCart = async (productId) => setCart((await api.delete(`/cart/${productId}`)).data);
  const toggleWishlist = async (productId) => setWishlist((await api.put(`/wishlist/${productId}`)).data);
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return <ShopContext.Provider value={{ cart, wishlist, count, addToCart, removeFromCart, toggleWishlist, refresh }}>{children}</ShopContext.Provider>;
}

