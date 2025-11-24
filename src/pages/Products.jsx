import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useLocation, useParams } from "react-router-dom";
import Empty from "../assets/empty.png";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import AppSelect from "../components/AppSelect";
import ProductCard from "../components/ProductCard";
import SpinLoader from "../components/SpinLoader";
import { CategoryAPI } from "../services/api";
import useCartStore from "../stores/useCartStore";
import useProductStore from "../stores/useProductStore";

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
  const categoryNameQuery = searchParams.get("categoryName") || "";

  const activeCategory = paramCategory || categoryQuery;
  const categoryHeader = categoryNameQuery || activeCategory;
  const activeSearch = searchQuery;

  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState(activeSearch);
  const [debouncedQ, setDebouncedQ] = useState(activeSearch);

  const [filters, setFilters] = useState({
    category: activeCategory || "",
    gender: "",
    size: "",
    color: "",
    priceRange: [0, 5000],
    sort: "newest", // priceAsc, priceDesc, newest, popularity
  });

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const loaderRef = useRef(null);

  /** Load Categories */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await CategoryAPI.getAll();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  /** Debounce Search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 500);
    return () => clearTimeout(t);
  }, [q]);

  /** Apply Filters - search & category */
  useEffect(() => {
    setFilter("searchText", debouncedQ || activeSearch);
    setFilter("category", filters.category || activeCategory);
    setFilter("gender", filters.gender);
    setFilter("size", filters.size);
    setFilter("color", filters.color);
    setFilter("priceRange", filters.priceRange);
    setFilter("sort", filters.sort);

    resetProducts();
    fetchProducts();
  }, [debouncedQ, filters, activeCategory, activeSearch]);

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

  /** Handle Filter Change */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  /** Reset Filters */
  const handleReset = () => {
    resetFilters();
    resetProducts();
    fetchProducts();
    setFilters({
      category: "",
      gender: "",
      size: "",
      color: "",
      priceRange: [0, 5000],
      sort: "newest",
    });
    setQ("");
  };

  return (
    <div className="container mx-auto px-4 py-6 relative">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold hidden md:block">
          {categoryHeader ? categoryHeader.toUpperCase() : "All Products"}
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="border px-3 py-2 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={() => setShowFilterPanel(true)}
            className="p-2 border rounded hover:bg-gray-100 transition"
          >
            <FiFilter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.length > 0 ? (
          <>
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAdd={(product) =>
                  addItem({
                    ...product,
                    qty: 1,
                    selectedOptions: product.variants?.[0] || {
                      color: "Default",
                      size: "M",
                    },
                  })
                }
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
      {!products?.length && (
        <div class=" h-[100%] w-screen flex justify-center items-center">
          <img
            src={Empty}
            alt="No Products Found"
            class="max-w-52 max-h-52 object-contain self-center"
          />
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={loaderRef} className="h-16 flex justify-center items-center">
        {loading && <SpinLoader />}
      </div>

      {/* Filter Panel */}
      {/* Filter Panel */}
      {showFilterPanel && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowFilterPanel(false)}
          ></div>

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-lg p-6 overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">Filters</h3>

            {/* Category */}
            <div className="mb-3">
              <AppSelect
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </AppSelect>
            </div>

            {/* Gender */}
            <div className="mb-3">
              <AppSelect
                label="Gender"
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
              >
                <option value="">All</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </AppSelect>
            </div>

            {/* Size */}
            <div className="mb-3">
              <AppSelect
                label="Size"
                value={filters.size}
                onChange={(e) => handleFilterChange("size", e.target.value)}
              >
                <option value="">All Sizes</option>
                {["S", "M", "L", "XL", "XXL", "XXXL"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </AppSelect>
            </div>

            {/* Color */}
            <div className="mb-3">
              <AppSelect
                label="Color"
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
              >
                <option value="">All Colors</option>
                {[
                  ...new Set(
                    products.flatMap((p) => p.variants.map((v) => v.color))
                  ),
                ].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </AppSelect>
            </div>

            {/* Price */}
            <div className="mb-3">
              <AppInput
                label={`Max Price: ₹${filters.priceRange[1]}`}
                type="range"
                min={0}
                max={5000}
                step={10}
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [0, Number(e.target.value)])
                }
              />
            </div>

            {/* Sorting */}
            <div className="mb-3">
              <AppSelect
                label="Sort By"
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </AppSelect>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <AppButton className="flex-1 border" onClick={handleReset}>
                Reset
              </AppButton>
              <AppButton
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => setShowFilterPanel(false)}
              >
                Apply
              </AppButton>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
