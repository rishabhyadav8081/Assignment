import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then((r) => setProduct(r.data));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData(e.currentTarget);

      await (
        id
          ? api.put(`/products/${id}`, data)
          : api.post('/products', data)
      );

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
      setLoading(false);
    }
  };

  return (
    <main className="container-page py-10">
      <form
        key={product?._id || 'new'}
        onSubmit={submit}
        className="card mx-auto max-w-2xl p-7"
      >
        <h1 className="text-2xl font-bold">
          {id ? 'Edit product' : 'Add a product'}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          The image will be stored in Cloudinary.
        </p>

        {error && (
          <p className="mt-4 rounded bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">
            Product name
            <input
              name="name"
              defaultValue={product?.name}
              required
              className="field mt-1"
            />
          </label>

          <label className="text-sm font-medium">
            Price
            <input
              name="price"
              defaultValue={product?.price}
              required
              type="number"
              min="0"
              step="0.01"
              className="field mt-1"
            />
          </label>

          <label className="text-sm font-medium">
            Stock
            <input
              name="stock"
              defaultValue={product?.stock}
              required
              type="number"
              min="0"
              className="field mt-1"
            />
          </label>

          <label className="text-sm font-medium sm:col-span-2">
            Category
            <input
              name="category"
              defaultValue={product?.category}
              required
              className="field mt-1"
              placeholder="Electronics, Clothing..."
            />
          </label>

          <label className="text-sm font-medium sm:col-span-2">
            Description
            <textarea
              name="description"
              defaultValue={product?.description}
              required
              rows="4"
              className="field mt-1"
            />
          </label>

          <label className="text-sm font-medium sm:col-span-2">
            Product image
            <input
              name="image"
              required={!id}
              accept="image/*"
              type="file"
              className="field mt-1"
            />
          </label>
        </div>

        <button disabled={loading} className="btn-primary mt-6">
          {loading ? 'Uploading...' : 'Save product'}
        </button>
      </form>
    </main>
  );
}