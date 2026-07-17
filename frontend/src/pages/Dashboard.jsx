import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth(); const [products, setProducts] = useState([]); const [orders, setOrders] = useState([]); const [users, setUsers] = useState([]); const [stats, setStats] = useState({});
  const load = async () => {
    const productRequest = api.get('/products', { params: { limit: 100, ...(user.role === 'sales' && { owner: user.id }) } });
    if (user.role === 'admin') { const [p, o, u, s] = await Promise.all([productRequest, api.get('/orders'), api.get('/users'), api.get('/orders/stats')]); setProducts(p.data.products); setOrders(o.data); setUsers(u.data.users); setStats(s.data); }
    else { const [p, o] = await Promise.all([productRequest, api.get('/orders/seller')]); setProducts(p.data.products); setOrders(o.data); }
  };
  useEffect(() => { load(); }, []);
  const remove = async (id) => { if (!window.confirm('Delete this product?')) return; await api.delete(`/products/${id}`); setProducts(products.filter((p) => p._id !== id)); };
  const role = async (id, value) => { await api.patch(`/users/${id}/role`, { role: value }); setUsers(users.map((u) => u._id === id ? {...u, role:value} : u)); };
  const status = async (id, value) => { await api.patch(`/orders/${id}/status`, { status:value }); setOrders(orders.map((o) => o._id === id ? {...o, status:value} : o)); };
  return <main className="container-page py-10"><div className="flex items-end justify-between"><div><p className="font-medium capitalize text-brand-600">{user.role} workspace</p><h1 className="text-3xl font-bold">Dashboard</h1></div><Link to="/products/new" className="btn-primary">Add product</Link></div>
    {user.role === 'admin' && <section className="mt-7 grid gap-4 sm:grid-cols-3"><Stat label="Total sales" value={`₹${Math.round(stats.totalSales || 0).toLocaleString('en-IN')}`}/><Stat label="Total orders" value={stats.totalOrders || 0}/><Stat label="Average order" value={`₹${Math.round(stats.averageOrder || 0).toLocaleString('en-IN')}`}/></section>}
    <section className="mt-9"><h2 className="text-xl font-bold">Products ({products.length})</h2><div className="card mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr></thead><tbody>{products.map((p) => <tr className="border-t" key={p._id}><td className="p-3"><div className="flex items-center gap-3"><img src={p.image} className="h-10 w-10 rounded object-cover"/>{p.name}</div></td><td className="p-3">₹{p.price}</td><td className="p-3">{p.stock}</td><td className="p-3"><div className="flex gap-2"><Link to={`/products/${p._id}/edit`} className="rounded border p-2"><Edit size={15}/></Link><button onClick={() => remove(p._id)} className="rounded border p-2 text-rose-600"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div></section>
    <section className="mt-9"><h2 className="text-xl font-bold">Relevant orders ({orders.length})</h2><div className="card mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead><tbody>{orders.map((o) => <tr className="border-t" key={o._id}><td className="p-3">#{o._id.slice(-8)}</td><td className="p-3">{o.user?.name || 'Customer'}</td><td className="p-3">₹{o.totalAmount}</td><td className="p-3">{user.role === 'admin' ? <select value={o.status} onChange={(e) => status(o._id,e.target.value)} className="rounded border p-2">{['paid','processing','shipped','delivered','cancelled'].map((x) => <option key={x}>{x}</option>)}</select> : <span className="capitalize">{o.status}</span>}</td></tr>)}</tbody></table></div></section>
    {user.role === 'admin' && <section className="mt-9"><h2 className="text-xl font-bold">Users ({users.length})</h2><div className="card mt-4 divide-y">{users.map((u) => <div className="flex flex-wrap items-center justify-between gap-3 p-4" key={u._id}><div><b>{u.name}</b><p className="text-sm text-slate-500">{u.email}</p></div><select value={u.role} disabled={u._id === user.id} onChange={(e) => role(u._id,e.target.value)} className="rounded border p-2"><option value="user">User</option><option value="sales">Sales Person</option><option value="admin">Admin</option></select></div>)}</div></section>}
  </main>;
}
function Stat({ label, value }) { return <div className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>; }
