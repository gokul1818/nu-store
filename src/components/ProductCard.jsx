import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";
import useCartStore from "../stores/useCartStore";

export default function ProductCard({ product, onAdd = () => {} }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-white rounded-lg shadow p-3 flex flex-col">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.thumbnail || product.image || "/placeholder.png"}
          alt={product.name}
          className="h-56 w-full object-cover rounded"
        />
        <h3 className="mt-3 font-semibold">{product.name}</h3>
      </Link>

      <div className="mt-auto">
        <div className="flex items-center justify-between mt-3">
          <div className="text-lg font-bold">
            {formatCurrency(product.price)}
          </div>
          <button
            onClick={() => addItem(product)}
            className="px-3 py-1 bg-black text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
