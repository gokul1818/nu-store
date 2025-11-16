import { useEffect, useState } from "react";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";

export default function Products() {
  const { products, fetchProducts } = useProductStore();
  const [q, setQ] = useState("");

  useEffect(() => { fetchProducts(q ? `search=${encodeURIComponent(q)}` : ""); }, [q]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="border p-2 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
