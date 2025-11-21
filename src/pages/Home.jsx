import { motion } from "framer-motion";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect, useState, useRef } from "react";
import AppLoader from "../components/AppLoader";
import { BannerAPI, CategoryAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

// ICONS
import { FaMale, FaFemale, FaChild } from "react-icons/fa";
import SpinLoader from "../components/SpinLoader";
import BannerCarousel from "../components/BannerCarousel";

export default function Home() {
  const {
    products,
    fetchProducts,
    resetProducts,
    loadMoreProducts,
    page,
    pages,
    loading,
    setFilter,
  } = useProductStore();

  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [activeMainCat, setActiveMainCat] = useState(null);
  const [banners, setBanners] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loaderRef = useRef(null);

  const defaultMain = [
    { slug: "men", label: "Men", icon: <FaMale size={22} /> },
    { slug: "women", label: "Women", icon: <FaFemale size={22} /> },
    { slug: "kids", label: "Kids", icon: <FaChild size={22} /> },
  ];

  /** INITIAL LOAD */

  const loadBanners = async () => {
    try {
      const res = await BannerAPI.getAll();
      setBanners(res.data);
    } catch (err) {
      console.error(err);

    }
  }

  async function loadData() {
    resetProducts();
    setInitialLoading(true);

    try {
      await fetchProducts(); // load page 1

      const res = await CategoryAPI.getAll();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load products or categories", err);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {

    loadData();
    loadBanners()
  }, []);

  /** INFINITE SCROLL OBSERVER */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < pages) {
          loadMoreProducts(); // load next page
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loading, page, pages]);

  /** CATEGORY CLICK (Men / Women / Kids) */
  const handleMainCategory = (slug) => {
    setActiveMainCat(slug);
    setFilter("gender", slug); // filter by gender
    resetProducts();
    fetchProducts();
  };

  /** GET SUBCATEGORIES */
  const getSubCategories = (mainSlug) =>
    categories.filter((c) => c.parent === mainSlug);

  // Show full-page loader during initial load
  if (initialLoading) return <AppLoader />;

  return (
    <>
      <BannerCarousel banners={banners} />
      <div className="container mx-auto px-4 py-6">
        {/* MAIN CATEGORIES */}
        <h2 className="text-xl font-bold mb-4">Shop by Category</h2>

        <div className="flex gap-4 mb-6">
          {defaultMain.map((main) => {
            const isActive = activeMainCat === main.slug;

            return (
              <div
                key={main.slug}
                onClick={() => handleMainCategory(main.slug)}
                onMouseEnter={() => setActiveMainCat(main.slug)}
                className={`
                cursor-pointer flex flex-row items-center justify-center
                bg-white shadow p-3 rounded-lg border min-w-[100px]
                transition capitalize text-center gap-1
                ${isActive
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:bg-orange-50 hover:border-orange-400"
                  }
              `}
              >
                <div
                  className={`${isActive ? "text-orange-600" : "text-gray-700"}`}
                >
                  {main.icon}
                </div>
                <p className="font-semibold">{main.label}</p>
              </div>
            );
          })}
        </div>

        {/* SUB CATEGORY POPUP */}
        {activeMainCat && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow p-4 rounded-lg border mb-8 flex gap-3 flex-wrap"
          >
            {getSubCategories(activeMainCat).length === 0 ? (
              <p className="text-base text-gray-500 italic">
                No subcategories available.
              </p>
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
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addItem} />
          ))}
        </motion.div>
        {/* INFINITE SCROLL TRIGGER */}
        <div ref={loaderRef} className="h-16 flex justify-center items-center">
          {loading && <SpinLoader />}
        </div>
      </div>

    
    </>
  );
}
