import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";
import useCartStore from "../stores/useCartStore";
import { useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  whileHover: { scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" },
};

export default function ProductCard({ product, onAdd = () => { } }) {
  const addItem = useCartStore((s) => s.addItem);

  // ➤ Hover State to swap image
  const [hover, setHover] = useState(false);

  const productImage1 = product.images?.[0] || "/placeholder.png";
  const productImage2 = product.images?.[1] || productImage1; // fallback to first

  const shownImage = hover ? productImage2 : productImage1;

  const hasDiscount = Number(product.discount) > 0;
  const discountedPrice = hasDiscount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  // Calculate total stock from variants
  const totalStock = product.variants?.reduce(
    (sum, v) => sum + (v.stock || 0),
    0
  );

  // Label logic
  let stockLabel = "";
  let stockClass = "";

  if (totalStock === 0) {
    stockLabel = "Out of Stock";
    stockClass = "text-red-500 ";
  } else if (totalStock < 10) {
    stockLabel = `Limited Stock (${totalStock} left)`;
    stockClass = "text-orange-500 ";
  } else {
    stockLabel = `In Stock (${totalStock})`;
    stockClass = "text-green-500 ";
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="whileHover"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-white w-full rounded-lg shadow p-3 flex flex-col cursor-pointer transition-all relative"
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* DISCOUNT TAG */}
        {product?.discount > 0 && (
          <div className="text-sm text-white bg-red-500 font-medium absolute right-0 z-30 top-0 px-2">
            {product.discount}% OFF
          </div>
        )}

        <div className="relative h-40 sm:h-40 md:h-48 lg:h-56 xl:h-64 w-full overflow-hidden rounded-lg">

          <AnimatePresence mode="sync">
            <motion.img
              key={shownImage}
              src={shownImage}
              alt={product.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

        </div>

        <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        <p className={`mt-1 text-xs font-medium px-2 py-1 rounded w-fit ${stockClass}`}>
          {stockLabel}
        </p>
        {/* VARIANTS */}
        {product.variants?.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {product.variants.map((v, index) => (
              <div
                key={index}
                title={v.color}
                className="w-5 h-5 rounded-full border shadow-sm"
                style={{ backgroundColor: v.color }}
              ></div>
            ))}
          </div>
        )}

        {/* PRICE + ADD BUTTON */}
        <div className="mt-auto">
          <div className="flex items-end justify-between mt-3">
            <div>
              {hasDiscount ? (
                <>
                  <div className="text-sm line-through text-gray-500">
                    {formatCurrency(product.mrp)}
                  </div>
                  <div className="text-lg font-bold text-black">
                    {formatCurrency(product.price)}
                  </div>
                </>
              ) : (
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                onAdd({
                  ...product,
                  qty: 1,
                  selectedOptions:
                    product.variants?.[0] || { color: "Default", size: "M" },
                })
              }
              className="px-3 py-1 bg-primary text-white rounded shadow hover:bg-gray-800 transition-all"
            >
              Add
            </motion.button>
          </div>
        </div>
      </Link>

    </motion.div>
  );
}
