import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";
import useCartStore from "../stores/useCartStore";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
  whileHover: { scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" },
};

export default function ProductCard({ product, onAdd = () => {} }) {
  const addItem = useCartStore((s) => s.addItem);

  // Calculate discounted price if a discount exists
  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="whileHover"
      className="bg-white rounded-lg shadow p-3 flex flex-col cursor-pointer transition-all duration-200"
    >
      <Link to={`/product/${product._id}`} className="block">
        <img
          // src={product.images[0] || "/placeholder.png"}
           src="https://m.media-amazon.com/images/I/81T1HMOZ0mL._SX679_.jpg"
          alt={product.name}
          className="h-56 w-full object-cover rounded-lg transition-transform duration-150 hover:scale-105"
        />
        <h3 className="mt-3 font-semibold text-gray-900">{product.title}</h3>
      </Link>
      {product.variants && product.variants.length > 0 && (
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

      <div className="mt-auto">
        <div className="flex items-end justify-between mt-3">
          <div>
            {hasDiscount ? (
              <>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(discountedPrice)}
                </div>
                <div className="text-sm line-through text-gray-500">
                  {formatCurrency(product.price)}
                </div>
                <div className="text-sm text-orange-600 font-medium">
                  {product.discount}% OFF
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
            onClick={() => addItem(product)}
            className="px-3 py-1 bg-primary text-white rounded shadow hover:bg-gray-800 transition-colors duration-150"
          >
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
