import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const loadRazorpay = () => new Promise((resolve) => { if (window.Razorpay) return resolve(true); const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script); });

export default function Cart() {
  const { cart, addToCart, removeFromCart, refresh } = useShop(); const { user } = useAuth(); const navigate = useNavigate();
  const [checkout, setCheckout] = useState(false); const [error, setError] = useState('');
  const [address, setAddress] = useState({ name: user.name, phone: '', address: '', city: '', postalCode: '' });
  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pay = async (e) => { e.preventDefault(); setError(''); setCheckout(true); try {
    if (!(await loadRazorpay())) throw new Error('Payment window could not load');
    const payment = (await api.post('/orders/payment/create')).data;
    new window.Razorpay({ key: payment.key, amount: payment.amount, currency: payment.currency, order_id: payment.id, name: 'CartNest', description: 'Order payment', prefill: { name: user.name, email: user.email, contact: address.phone }, theme: { color: '#0d8756' }, handler: async (result) => { try { await api.post('/orders/payment/verify', { ...result, shippingAddress: address }); await refresh(); navigate('/orders'); } catch (err) { setError(err.response?.data?.message || 'Verification failed'); } finally { setCheckout(false); } }, modal: { ondismiss: () => setCheckout(false) } }).open();
  } catch (err) { setError(err.response?.data?.message || err.message); setCheckout(false); } };
  if (!cart.items.length) return <main className="container-page py-12"><EmptyState title="Your cart is empty" text="Add something you like from the shop."/></main>;
  return <main className="container-page py-10"><h1 className="text-3xl font-bold">Your cart</h1>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}<div className="mt-7 grid gap-7 lg:grid-cols-[1fr_380px]"><div className="space-y-3">{cart.items.map(({ product, quantity }) => <div className="card flex gap-4 p-4" key={product._id}><img className="h-24 w-24 rounded-lg object-cover" src={product.image} alt={product.name}/><div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{product.name}</h2><p className="text-sm text-slate-500">₹{product.price.toLocaleString('en-IN')} each</p><div className="mt-3 flex items-center gap-2"><button disabled={quantity === 1} onClick={() => addToCart(product._id, quantity - 1)} className="rounded border p-1"><Minus size={15}/></button><span className="w-6 text-center">{quantity}</span><button disabled={quantity >= product.stock} onClick={() => addToCart(product._id, quantity + 1)} className="rounded border p-1"><Plus size={15}/></button></div></div><div className="text-right"><b>₹{(product.price * quantity).toLocaleString('en-IN')}</b><button onClick={() => removeFromCart(product._id)} className="mt-8 block text-rose-500"><Trash2 size={18}/></button></div></div>)}</div><form onSubmit={pay} className="card h-fit p-5"><h2 className="text-lg font-bold">Delivery details</h2><div className="mt-4 grid gap-3">{Object.keys(address).map((key) => <input key={key} required className="field" placeholder={key === 'postalCode' ? 'Postal code' : key[0].toUpperCase()+key.slice(1)} value={address[key]} onChange={(e) => setAddress({...address, [key]:e.target.value})}/>)}</div><div className="my-5 flex justify-between border-t pt-4 text-lg"><span>Total</span><b>₹{total.toLocaleString('en-IN')}</b></div><button disabled={checkout} className="btn-primary w-full">{checkout ? 'Opening payment...' : 'Pay securely'}</button><p className="mt-3 text-center text-xs text-slate-500">Razorpay test mode • No real payment</p></form></div></main>;
}

