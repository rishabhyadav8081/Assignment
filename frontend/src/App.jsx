import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Orders from './pages/Orders';
import ProductForm from './pages/ProductForm';
import Wishlist from './pages/Wishlist';

export default function App() { return <BrowserRouter><AuthProvider><ShopProvider><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth registerMode/>}/><Route element={<ProtectedRoute/>}><Route path="/cart" element={<Cart/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/orders" element={<Orders/>}/></Route><Route element={<ProtectedRoute roles={['admin','sales']}/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/products/new" element={<ProductForm/>}/><Route path="/products/:id/edit" element={<ProductForm/>}/></Route><Route path="*" element={<main className="container-page py-20 text-center"><h1 className="text-4xl font-bold">Page not found</h1></main>}/></Routes></ShopProvider></AuthProvider></BrowserRouter>; }

