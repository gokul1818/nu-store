import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect } from "react";

export default function   Home() {
  const { products, fetchProducts } = useProductStore();
  console.log('items: ', products);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((p) => <ProductCard key={p._id} product={p} onAdd={(prod) => addItem(prod)} />)}
      </div>
    </div>
  );
}
