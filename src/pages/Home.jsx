import { motion } from "framer-motion";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect, useState } from "react";
import AppLoader from "../components/AppLoader";
import { CategoryAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

// ICONS
import { FaMale, FaFemale, FaChild } from "react-icons/fa";

export default function Home() {
  const { products, fetchProducts } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeMainCat, setActiveMainCat] = useState(null);

  const defaultMain = [
    { slug: "men", label: "Men", icon: <FaMale size={22} /> },
    { slug: "women", label: "Women", icon: <FaFemale size={22} /> },
    { slug: "kids", label: "Kids", icon: <FaChild size={22} /> },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      await fetchProducts();

      try {
        const res = await CategoryAPI.getAll();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <AppLoader />;

  const findMainCategory = (slug) => {
    return categories.find((c) => c.parent === null && c.slug === slug) || null;
  };

  const getSubCategories = (mainSlug) => {
    const mainCat = findMainCategory(mainSlug);
    if (!mainCat) return [];
    return categories.filter(
      (c) => c.parent && c.parent._id === mainCat._id
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">

      <h2 className="text-xl font-bold mb-4">Shop by Category</h2>

      <div className="flex gap-4 mb-6">
        {defaultMain.map((main) => {
          const isActive = activeMainCat === main.slug;

          return (
            <div
              key={main.slug}
              onMouseEnter={() => setActiveMainCat(main.slug)}
              // onMouseLeave={() => setActiveMainCat(null)}
              onClick={() => setActiveMainCat(main.slug)}
              className={`
                cursor-pointer flex flex-row items-center justify-center
                bg-white shadow p-3 rounded-lg border min-w-[100px]
                transition capitalize text-center gap-1
                ${
                  isActive
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:bg-orange-50 hover:border-orange-400"
                }
              `}
            >
              <div className={`${isActive ? "text-orange-600" : "text-gray-700"}`}>
                {main.icon}
              </div>
              <p className="font-semibold text-medium">{main.label}</p>
            </div>
          );
        })}
      </div>

      {/* SUBCATEGORY DROPDOWN */}
      {activeMainCat && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow p-4 rounded-lg border mb-8 flex gap-3 flex-wrap"
          onMouseEnter={() => setActiveMainCat(activeMainCat)}
          onMouseLeave={() => setActiveMainCat(null)}
        >
          {getSubCategories(activeMainCat).length === 0 ? (
            <p className="text-base text-gray-500 italic">No subcategories available.</p>
          ) : (
            getSubCategories(activeMainCat).map((sub) => (
              <div
                key={sub._id}
                onClick={() => navigate(`/products?category=${sub.slug}`)}
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md shadow-sm"
              >
                {sub.name}
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* PRODUCTS */}
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onAdd={(prod) => addItem(prod)}
          />
        ))}
      </motion.div>
    </div>
  );
}
