import { useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency, formatCurrencyINR } from "../utils/helpers";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([
    {
      _id: "p1",
      name: "Oversized Street Tee",
      price: 1999,
      qty: 2,
      thumbnail: "/placeholder.png",
      selectedOptions: { color: "Black", size: "M" },
    },
    {
      _id: "p2",
      name: "Casual Hoodie",
      price: 2499,
      qty: 1,
      thumbnail: "/placeholder.png",
      selectedOptions: { color: "Red", size: "L" },
    },
  ]);

  const updateQty = (id, qty, selectedOptions) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, qty }
          : item
      )
    );
  };

  const removeItem = (id, selectedOptions) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === id &&
            JSON.stringify(item.selectedOptions) ===
              JSON.stringify(selectedOptions)
          )
      )
    );
  };

  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {cart.map((it) => (
            <div
              key={it._id + JSON.stringify(it.selectedOptions)}
              className="bg-white p-4 rounded-lg flex gap-4 shadow-md hover:shadow-lg transition-all"
            >
              <Link to={`/product/${it._id}`}>
                <img
                  src={it.thumbnail || "/placeholder.png"}
                  className="w-28 h-28 object-cover rounded shadow"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${it._id}`}>
                  <h3 className="font-semibold text-lg">{it.name}</h3>
                </Link>

                <div className="mt-2 text-gray-700">
                  {formatCurrency(it.price)}
                </div>

                {/* Quantity Controls */}
                <div className="mt-3 flex items-center gap-3">
                  {/* Decrease / Remove */}
                  <button
                    onClick={() => {
                      if (it.qty === 1) {
                        removeItem(it._id, it.selectedOptions);
                      } else {
                        updateQty(it._id, it.qty - 1, it.selectedOptions);
                      }
                    }}
                    className="px-2 py-1 border rounded shadow-sm hover:bg-gray-100"
                  >
                    <FaMinus />
                  </button>

                  {/* Quantity Display */}
                  <span className="px-4 py-1 border rounded bg-gray-50">{it.qty}</span>

                  {/* Increase */}
                  <button
                    onClick={() => updateQty(it._id, it.qty + 1, it.selectedOptions)}
                    className="px-2 py-1 border rounded shadow-sm hover:bg-gray-100"
                  >
                    <FaPlus />
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(it._id, it.selectedOptions)}
                    className="ml-3"
                  >
                    <FaTrash className="w-4 h-4 text-error" />
                  </button>
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  Color: {it.selectedOptions.color}, Size: {it.selectedOptions.size}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-5 rounded-lg shadow-lg self-start sticky top-6">
          <h3 className="font-semibold text-xl">Order Summary</h3>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrencyINR(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrencyINR(shipping)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrencyINR(tax)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrencyINR(total)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 bg-primary text-white py-2 px-4 rounded shadow-md hover:shadow-lg transition w-3/6"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
