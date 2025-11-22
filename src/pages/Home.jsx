import { motion } from "framer-motion";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect, useState, useRef } from "react";
import AppLoader from "../components/AppLoader";
import { BannerAPI, CategoryAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

// ICONS
import { FaMale, FaFemale, FaChild } from "react-icons/fa";
import SpinLoader from "../components/SpinLoader";
import BannerCarousel from "../components/BannerCarousel";
import CategoryCard from "../components/CategoryCard";

export default function Home() {
  const {
    products,
    fetchProducts,
    resetProducts, resetFilters,
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

  /** LOAD BANNERS */
  const loadBanners = async () => {
    try {
      const res = await BannerAPI.getAll();
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /** INITIAL DATA */
  async function loadData() {
    resetProducts();
    setInitialLoading(true);

    try {
      await fetchProducts();

      const res = await CategoryAPI.getAll();
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load products or categories", err);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    resetProducts()
    resetFilters()
    loadData();
    loadBanners();
  }, []);

  /** INFINITE SCROLL */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < pages) {
          loadMoreProducts();
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loading, page, pages]);

  if (initialLoading) return <AppLoader />;

  return (
    <>
      <BannerCarousel banners={banners} />

      <div className="mx-auto w-full container px-4 py-6">

        {/* MAIN CATEGORIES */}
        <p className="text-center my-10 text-2xl font-semibold">
          Explore Everything
        </p>
        <div className="flex gap-6 w-full overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
          {categories.map((cat) => (
            <div key={cat._id} className="snap-start">
              <CategoryCard
                category={cat}
                onClick={() => navigate(`/products?category=${cat._id}`)}
              />
            </div>
          ))}
        </div>


        <p className="text-center  my-10 text-2xl font-semibold">
          New Arrivals
        </p>
        {/* PRODUCT GRID */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="
            w-full 
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-4
            gap-6
          "
        >
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addItem} />
          ))}
        </motion.div>

        <Link
          to={`/products`}
          className="my-5 bg-secondary text-white mx-auto block w-52 text-center px-4 py-2 text-sm font-semibold 
             rounded-md border border-gray-300 
             hover:bg-orange-400 hover:text-white transition-all"
        >
          View All Products
        </Link>

        {/* INFINITE SCROLL TRIGGER */}
        <div ref={loaderRef} className="h-16 flex justify-center items-center">
          {loading && <SpinLoader />}
        </div>
      </div>
    </>
  );
}
