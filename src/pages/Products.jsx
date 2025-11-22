import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SpinLoader from "../components/SpinLoader";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";

export default function Products() {
  const {
    products,
    fetchProducts,
    loadMoreProducts,
    resetProducts,
    resetFilters,
    setFilter,
    page,
    pages,
    loading,
  } = useProductStore();

  const addItem = useCartStore((s) => s.addItem);

  const { category: paramCategory } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const categoryQuery = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const activeCategory = paramCategory || categoryQuery;
  const activeSearch = searchQuery;

  const [q, setQ] = useState(activeSearch);
  const [debouncedQ, setDebouncedQ] = useState(activeSearch);

  const loaderRef = useRef(null);

  /** Debounce Search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 500);
    return () => clearTimeout(t);
  }, [q]);

  /** Apply Filters - search & category */
  useEffect(() => {
    setFilter("searchText", debouncedQ || activeSearch);
    setFilter("category", activeCategory);
    resetProducts();
    fetchProducts();
  }, [debouncedQ, activeCategory, activeSearch]);

  /** Infinite Scroll Observer */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < pages) {
          loadMoreProducts();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, page, pages]);

  /** Reset Filter Button */
  const handleReset = () => {
    resetFilters();
    resetProducts();
    fetchProducts();
    setQ("");
  };

  return (
    <div className="container mx-auto px-4 py-6">

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold hidden md:block">
          {activeCategory ? activeCategory.toUpperCase() : "All Products"}
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="border px-3 py-2 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleReset}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAdd={(product) =>
              addItem({
                ...product,
                qty: 1,
                selectedOptions:
                  product.variants?.[0] || { color: "Default", size: "M" },
              })
            }
          />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={loaderRef} className="h-16 flex justify-center items-center">
        {loading && <SpinLoader />}
      </div>

    </div>
  );
}
