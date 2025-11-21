import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import SpinLoader from "../components/SpinLoader";
import useProductStore from "../stores/useProductStore";

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
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold hidden md:block">All Products</h2>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="border px-2 py-4 rounded w-full md:w-auto mt-2 md:mt-0"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* Infinite scroll loader */}
      <div ref={loaderRef} className="h-16 flex justify-center items-center">
        {loading && <SpinLoader />}
      </div>
    </div>
  );
}
