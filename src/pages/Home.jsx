import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect, useState } from "react";
import AppLoader from "../components/AppLoader";

export default function Home() {
  const { products, fetchProducts } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading) return <AppLoader />;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAdd={(prod) => addItem(prod)}
          />
        ))}
      </div>
    </div>
  );
}
