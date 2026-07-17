import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

import api from '../api/client';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [data, setData] = useState({
    products: [],
    count: 0,
  });

  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products/categories')
      .then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);

      api
        .get('/products', {
          params: filters,
        })
        .then((r) => setData(r.data))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const change = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
     <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900 text-white">
  {/* Background decoration */}
  <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
  <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

  <div className="container-page relative py-16 md:py-24">
    <div className="max-w-3xl">
      <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-emerald-200 backdrop-blur">
        🛍️ Trusted Marketplace
      </span>

      <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
        Everything you need,
        <br />
        <span className="text-emerald-300">
          in one friendly store.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-200">
        Discover quality products from trusted sellers. Search,
        compare and shop securely with fast delivery.
      </p>
    </div>
  </div>
</section>

<main className="container-page relative -mt-10 pb-12">

  {/* Filters */}
  <div className="rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

      <label className="relative lg:col-span-2">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          name="keyword"
          value={filters.keyword}
          onChange={change}
          placeholder="Search products..."
          className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <select
        name="category"
        value={filters.category}
        onChange={change}
        className="h-12 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>

      <input
        name="minPrice"
        type="number"
        value={filters.minPrice}
        onChange={change}
        placeholder="Min ₹"
        className="h-12 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />

      <input
        name="maxPrice"
        type="number"
        value={filters.maxPrice}
        onChange={change}
        placeholder="Max ₹"
        className="h-12 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </div>

  </div>

  {/* Heading */}

  <div className="mt-10 mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h2 className="text-3xl font-bold text-slate-900">
        Featured Products
      </h2>

      <p className="mt-1 text-slate-500">
        Find the best deals from our marketplace.
      </p>
    </div>

    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
      <SlidersHorizontal size={16} />
      {data.count} Products
    </div>

  </div>

  {/* Products */}

  {loading ? (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="h-80 animate-pulse rounded-2xl bg-slate-200"
        />
      ))}
    </div>
  ) : data.products.length ? (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {data.products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  ) : (
    <div className="py-20">
      <EmptyState
        title="No products found"
        text="Try changing your search or filters."
      />
    </div>
  )}

</main>
    </>
  );
}