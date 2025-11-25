import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useLocation, useParams } from "react-router-dom";
import Empty from "../assets/empty.png";
import AppButton from "../components/AppButton";
import AppSelect from "../components/AppSelect";
import ProductCard from "../components/ProductCard";
import PriceRangeSlider from "../components/RangeSelector";
import SpinLoader from "../components/SpinLoader";
import { colorOptions } from "../constants/constant";
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

  const genderQuery = searchParams.get("gender") || "";
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
    gender: genderQuery || "",
    size: "",
    color: "",
    priceRange: [0, 5000],
    sort: "newest",
  });

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const loaderRef = useRef(null);

  /** Determine if we are on a gender page */
  const isGenderPage =
    paramCategory === "men" ||
    paramCategory === "women" ||
    genderQuery === "men" ||
    genderQuery === "women";

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

  /** Debounce Search Text */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 500);
    return () => clearTimeout(t);
  }, [q]);

  /** Update filters and fetch products when URL params change */
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: activeCategory || "",
      gender: isGenderPage ? paramCategory || genderQuery : "",
      size: "",
      color: "",
      priceRange: [0, 5000],
      sort: "newest",
    }));

    resetProducts();
    setFilter("category", activeCategory || "");
    setFilter("gender", isGenderPage ? paramCategory || genderQuery : "");
    fetchProducts();
  }, [paramCategory, genderQuery]);

  /** Trigger API when search text changes */
  useEffect(() => {
    setFilter("searchText", debouncedQ || activeSearch);
    resetProducts();
    fetchProducts();
  }, [debouncedQ]);

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

  /** Update filter local state */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilter("category", filters.category);
    if (!isGenderPage) setFilter("gender", filters.gender);
    setFilter("size", filters.size);
    setFilter("color", filters.color);

    // Send minPrice and maxPrice separately instead of priceRange
    setFilter("minPrice", filters.priceRange[0]);
    setFilter("maxPrice", filters.priceRange[1]);

    setFilter("sort", filters.sort);

    resetProducts();
    fetchProducts();
    setShowFilterPanel(false);
  };

  /** Reset filters */
  const handleReset = () => {
    resetFilters();
    setFilters({
      category: "",
      gender: isGenderPage ? paramCategory || genderQuery : "",
      size: "",
      color: "",
      priceRange: [0, 5000],
      sort: "newest",
    });
    setQ("");

    resetProducts();
    fetchProducts();
    setShowFilterPanel(false);
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
        {products?.length > 0
          ? products.map((p) => (
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
            ))
          : null}
      </div>

      {!loading && !products?.length && (
        <div className="h-[100%] w-screen flex justify-center items-center">
          <img
            src={Empty}
            alt="No Products Found"
            className="max-w-52 max-h-52 object-contain self-center"
          />
        </div>
      )}

      {/* Loader for infinite scroll */}
      <div ref={loaderRef} className="h-16 flex justify-center items-center">
        {loading && <SpinLoader />}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-lg p-6 overflow-y-auto flex flex-col gap-4"
        >
          <h3 className="text-xl font-bold">Filters</h3>

          {/* Category */}
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

          {/* Gender - hide if coming from Men/Women Loot */}
          {!isGenderPage && (
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
          )}

          {/* Size */}
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
          <div>
            <label className="block mb-1 font-semibold">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color._id}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    filters.color === color.value
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleFilterChange("color", color.value)}
                >
                  {/* Optionally indicate selection */}
                  {filters.color === color.value && (
                    <span className="block w-full h-full rounded-full bg-white bg-opacity-25"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <PriceRangeSlider
            value={filters.priceRange}
            min={0}
            max={10000}
            step={10}
            onChange={(val) => handleFilterChange("priceRange", val)}
          />

          {/* Sort */}
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

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            <AppButton className="flex-1 border" onClick={handleReset}>
              Reset
            </AppButton>

            <AppButton
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={applyFilters}
            >
              Apply
            </AppButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
