import { Heart, LayoutDashboard, LogOut, Menu, PackagePlus, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useShop();
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-100'}`;
  const links = user ? <>
    <NavLink className={linkClass} to="/wishlist"><Heart size={17} /> Wishlist</NavLink>
    <NavLink className={linkClass} to="/orders"><ShoppingBag size={17} /> Orders</NavLink>
    {(user.role === 'admin' || user.role === 'sales') && <NavLink className={linkClass} to="/products/new"><PackagePlus size={17} /> Add Product</NavLink>}
    {(user.role === 'admin' || user.role === 'sales') && <NavLink className={linkClass} to="/dashboard"><LayoutDashboard size={17} /> Dashboard</NavLink>}
  </> : null;
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="container-page flex h-16 items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-900"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">C</span>CartNest</Link>
      <nav className="hidden items-center gap-1 lg:flex"><NavLink className={linkClass} to="/">Shop</NavLink>{links}</nav>
      <div className="flex items-center gap-2">
        {user && <Link to="/cart" className="relative rounded-lg p-2.5 hover:bg-slate-100"><ShoppingCart size={21} /><span className="absolute -right-1 -top-1 rounded-full bg-brand-600 px-1.5 text-xs text-white">{count}</span></Link>}
        {user ? <><span className="hidden text-sm sm:block">Hi, <b>{user.name.split(' ')[0]}</b></span><button onClick={logout} className="hidden rounded-lg p-2 hover:bg-slate-100 lg:block" aria-label="Logout"><LogOut size={20} /></button></> : <Link className="btn-primary py-2" to="/login">Login</Link>}
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 lg:hidden" aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    {open && <nav onClick={() => setOpen(false)} className="container-page grid gap-1 border-t py-3 lg:hidden"><NavLink className={linkClass} to="/">Shop</NavLink>{links}{user && <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-left text-sm"><LogOut size={17} /> Logout</button>}</nav>}
  </header>;
}

