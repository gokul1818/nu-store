import { useEffect, useRef, useState } from "react";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const {
    products,
    fetchProducts,
    loadMoreProducts,
    resetProducts,
    page,
    pages,
    loading,
  } = useProductStore();

  const [q, setQ] = useState("");
  const loaderRef = useRef(null);

  // Reset + reload when search changes
  useEffect(() => {
    resetProducts();
    fetchProducts();
  }, [q]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < pages) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef.current, loading, page, pages]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* Infinite scroll loader */}
      <div ref={loaderRef} className="h-16 flex justify-center items-center">
        {loading && <p className="text-gray-500">Loading...</p>}
      </div>
    </div>
  );
}
