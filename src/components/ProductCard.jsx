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

export default function ProductCard({ product, onAdd = () => { } }) {
  const addItem = useCartStore((s) => s.addItem);

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
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          className="h-56 w-full object-cover rounded-lg transition-transform duration-150 hover:scale-105"
        />
        <h3 className="mt-3 font-semibold text-gray-900">{product.name}</h3>
      </Link>

      <div className="mt-auto">
        <div className="flex items-center justify-between mt-3">
          <div className="text-lg font-bold text-primary">
            {formatCurrency(product.price)}
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
