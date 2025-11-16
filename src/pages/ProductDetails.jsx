import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProductStore from "../stores/useProductStore";
import useCartStore from "../stores/useCartStore";
import { formatCurrency } from "../utils/helpers";
import { useOrderStore } from "../stores/useOrderStore";

export default function ProductDetails() {
  const { id } = useParams();
  const { selectedProduct, fetchProductById } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const createOrder = useOrderStore((s) => s.createOrder);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) fetchProductById(id);
  }, [id]);

  if (!selectedProduct)
    return <div className="container mx-auto p-6">Loading...</div>;

  const handleAddToCart = () => {
    addItem({
      productId: selectedProduct._id,
      qty,
      variant: selectedProduct.variants?.[0] || { size: "M", color: "Default" }
    });
  };

  const handleBuyNow = async () => {
    
    await createOrder({
      items: [
        {
          productId: selectedProduct._id,
          qty,
          variant: selectedProduct.variants?.[0] || { size: "M", color: "Default" }
        }
      ],
      paymentMethod: "COD",
      shippingAddress: { street: "Default", city: "Default" }
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={selectedProduct.thumbnail || "/placeholder.png"}
          alt={selectedProduct.name}
          className="w-full h-96 object-cover rounded"
        />

        <div>
          <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
          <div className="text-xl mt-2">{formatCurrency(selectedProduct.price)}</div>
          <p className="mt-4 text-gray-700">{selectedProduct.description}</p>

          {/* Quantity */}
          <div className="mt-4">
            <label className="block mb-1">Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value || "1"))}
              className="border p-2 rounded w-24"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Add to cart
            </button>

            <button
              onClick={handleBuyNow}
              className="px-4 py-2 border rounded"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
