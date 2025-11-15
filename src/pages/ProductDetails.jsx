import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import { formatCurrency } from "../utils/helpers";

export default function ProductDetails() {
  const { id } = useParams();
  const { selected, fetchProductById } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  useEffect(() => { if (id) fetchProductById(id); }, [id]);

  if (!selected) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={selected.image || selected.thumbnail || "/placeholder.png"} alt={selected.name} className="w-full h-96 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold">{selected.name}</h1>
          <div className="text-xl mt-2">{formatCurrency(selected.price)}</div>
          <p className="mt-4 text-gray-700">{selected.description}</p>

          {/* size/color selection simplified */}
          <div className="mt-4">
            <label className="block mb-1">Quantity</label>
            <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value || "1"))} className="border p-2 rounded w-24" />
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => addItem(selected, qty)} className="px-4 py-2 bg-black text-white rounded">Add to cart</button>
            <button className="px-4 py-2 border rounded">Buy now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
