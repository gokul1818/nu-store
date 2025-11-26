import { motion } from "framer-motion";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect, useState } from "react";
import AppLoader from "../components/AppLoader";
import { BannerAPI, CategoryAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

import BannerCarousel from "../components/BannerCarousel";
import CategoryCard from "../components/CategoryCard";
import Services from "./Services";

export default function Home() {
  const { products, fetchProducts, resetProducts, resetFilters, loading } =
    useProductStore();

  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

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
    resetFilters();
    setInitialLoading(true);

    try {
      await fetchProducts(); // load all products
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
    loadBanners();
  }, []);

  if (initialLoading) return <AppLoader />;

  /** NEW ARRIVALS → Sort by created date */
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  /** POPULAR PRODUCTS → Sort by salesCount or views */
  const popularProducts = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 4);

  return (
    <>
      <BannerCarousel banners={banners} />

      <div className="mx-auto w-full container px-4 py-6">
        <h1 className="text-3xl font-bold text-center my-10">
          Explore Everything
        </h1>

        <div className="flex gap-6 w-full overflow-x-auto pb-10 no-scrollbar snap-x snap-mandatory">
          {categories.map((cat) => (
            <div key={cat._id} className="snap-start">
              <CategoryCard
                category={cat}
                onClick={() =>
                  navigate(
                    `/products?category=${cat._id}&categoryName=${encodeURIComponent(
                      cat.name
                    )}`
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* ---------------- New Arrivals ---------------- */}
        <h1 className="text-3xl font-bold text-center my-10 mt-20">
          New Arrivals
        </h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        >
          {latestProducts.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addItem} />
          ))}
        </motion.div>

        {/* ---------------- Popular Products ---------------- */}
        <h1 className="text-3xl font-bold text-center my-10 mt-20">
          Popular Products
        </h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        >
          {popularProducts.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addItem} />
          ))}
        </motion.div>

        <Link
          to={`/products`}
          className="my-10 bg-secondary text-white mx-auto block w-52 text-center px-4 py-2 text-sm font-semibold 
          rounded-md border border-gray-300 
          hover:bg-orange-400 hover:text-white transition-all"
        >
          View All Products
        </Link>

        <Services />
      </div>
    </>
  );
}
