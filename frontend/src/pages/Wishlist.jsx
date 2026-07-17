import { useShop } from '../context/ShopContext';

import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useShop();

  return (
    <main className="container-page py-10">
      <h1 className="mb-7 text-3xl font-bold">
        Wishlist
      </h1>

      {wishlist.products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing saved yet"
          text="Tap the heart on a product to save it here."
        />
      )}
    </main>
  );
}