import { motion } from "framer-motion";
import useProductStore from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import useCartStore from "../stores/useCartStore";
import { useEffect, useState } from "react";
import AppLoader from "../components/AppLoader";
import { BannerAPI, CategoryAPI, ProductAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

import BannerCarousel from "../components/BannerCarousel";
import CategoryCard from "../components/CategoryCard";
import Services from "./Services";
import { buildProductQuery } from "../utils/helpers";
import GoogleReviews from "./GoogleReviews";

export default function Home() {
  const { products, fetchProducts, resetProducts, resetFilters, loading } =
    useProductStore();

  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  console.log('categories: ', categories);
  const [banners, setBanners] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadBanners = async () => {
    try {
      const res = await BannerAPI.getAll();
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  async function loadData() {
    resetProducts();
    resetFilters();
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

  async function loadPopularData() {
    setInitialLoading(true);
    const query = buildProductQuery({ page: 1, sort: "popular" });

    try {
      const res = await ProductAPI.getAll(query);
      setPopularData(res.data.products);
    } catch (err) {
      console.error("Failed to load popular products", err);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    loadPopularData();
    loadBanners();
  }, []);

  if (initialLoading) return <AppLoader />;

  const latestProducts = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 4);

  const popularProducts = popularData.slice(0, 4);

  return (
    <>
      <BannerCarousel banners={banners} />

      {/* ====================== Category Section ====================== */}
      <div className="mx-auto container px-4 py-20 relative">


        <h1 className="text-4xl font-bold text-center mb-12 relative z-10">
          Explore Everything
        </h1>

        <div className="flex gap-6 w-full overflow-x-auto pb-10 no-scrollbar relative z-10">
          {categories.map((cat) => (
            <div key={cat.id}>
              <CategoryCard
                category={cat}
                onClick={() =>
                  navigate(
                    `/products?category=${cat.id}&categoryName=${encodeURIComponent(
                      cat.name
                    )}`
                  )
                }
              />
            </div>
          ))}
        </div>

        {/* ====================== New Arrivals Section ====================== */}
        <h1 className="text-4xl font-bold text-center mt-28 mb-12 relative z-10">
          New Arrivals
        </h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {latestProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addItem} />
          ))}
        </motion.div>

        {/* ====================== Popular Products ====================== */}
        <h1 className="text-4xl font-bold text-center mt-28 mb-12 relative z-10">
          Popular Products
        </h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="relative z-10 w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addItem} />
          ))}
        </motion.div>

        {/* View All Button */}
        <Link
          to={`/products`}
          className="mt-16 mb-20 bg-v text-white mx-auto block w-56 text-center px-4 py-3 text-base font-semibold 
          rounded-md hover:bg-v/90 transition-all relative z-10"
        >
          View All Products
        </Link>

        {/* Google Reviews Section */}
        {/* <GoogleReviews /> */}

        {/* Services Section */}
        <Services />
      </div>
    </>
  );
}
