import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [data, setData] = useState({ products: [], count: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', category: '', minPrice: '', maxPrice: '' });
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/products/categories').then((r) => setCategories(r.data)); }, []);
  useEffect(() => { const timer = setTimeout(() => { setLoading(true); api.get('/products', { params: filters }).then((r) => setData(r.data)).finally(() => setLoading(false)); }, 300); return () => clearTimeout(timer); }, [filters]);
  const change = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  return <>
    <section className="bg-brand-900 py-16 text-white"><div className="container-page"><p className="font-medium text-emerald-300">Simple finds. Honest prices.</p><h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Everything you need, in one friendly store.</h1><p className="mt-4 max-w-xl text-emerald-50/80">Browse products from independent sellers and check out securely.</p></div></section>
    <main className="container-page py-10">
      <div className="card -mt-16 mb-8 grid gap-3 p-4 md:grid-cols-5"><label className="relative md:col-span-2"><Search className="absolute left-3 top-3 text-slate-400" size={19}/><input name="keyword" value={filters.keyword} onChange={change} className="field pl-10" placeholder="Search products" /></label><select name="category" value={filters.category} onChange={change} className="field"><option value="">All categories</option>{categories.map((x) => <option key={x}>{x}</option>)}</select><input name="minPrice" type="number" value={filters.minPrice} onChange={change} className="field" placeholder="Min price"/><input name="maxPrice" type="number" value={filters.maxPrice} onChange={change} className="field" placeholder="Max price"/></div>
      <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Products</h2><span className="flex items-center gap-2 text-sm text-slate-500"><SlidersHorizontal size={16}/>{data.count} results</span></div>
      {loading ? <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-200"/>)}</div> : data.products.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">{data.products.map((product) => <ProductCard key={product._id} product={product}/>)}</div> : <EmptyState title="No products found" text="Try changing the search or filters."/>}
    </main>
  </>;
}

