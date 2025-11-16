import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";

export default function Cart() {
  const navigate = useNavigate();

  // Dummy cart data
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

  // Update quantity
  const updateQty = (id, qty, selectedOptions) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, qty }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id, selectedOptions) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item._id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      )
    );
  };

  // Order calculations
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <div>
          <p>Cart is empty.</p>
          <Link to="/products" className="text-blue-600">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cart Items */}
          <div>
            {cart.map((it) => (
              <div key={it._id + JSON.stringify(it.selectedOptions)} className="bg-white p-4 rounded mb-3 flex gap-4">
                <img src={it.thumbnail || "/placeholder.png"} className="w-28 h-28 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{it.name}</h3>
                  <div className="mt-2">Price: {formatCurrency(it.price)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={it.qty}
                      onChange={(e) => updateQty(it._id, Math.max(1, Number(e.target.value)), it.selectedOptions)}
                      className="w-20 border p-1 rounded"
                    />
                    <button
                      onClick={() => removeItem(it._id, it.selectedOptions)}
                      className="text-red-600"
                    >
                      Remove
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
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(shipping)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total)}</span></div>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 w-full bg-primary text-white py-2 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
