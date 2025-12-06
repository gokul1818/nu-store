import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore";
import { formatCurrency, formatCurrencyINR } from "../utils/helpers";

export default function Cart() {
  const navigate = useNavigate();

  const cart = useCartStore((s) => s.cart);
  console.log('cart: ', cart);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-orange-500 text-white py-2 px-4 rounded shadow-md hover:bg-orange-600 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id + JSON.stringify(item.selectedOptions)}
              className="bg-white p-4 rounded-lg flex gap-4 shadow-md hover:shadow-lg transition-all"
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={JSON.parse(item.images)[0] || "/placeholder.png"}
                  className="w-28 h-28 object-cover rounded shadow"
                />
              </Link>

              <div className="flex-1">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                </Link>

                <div className="mt-2 text-gray-700">
                  {formatCurrency(item.price)}
                </div>

                {/* Quantity Controls */}
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() =>
                      item.qty === 1
                        ? removeItem(item.id, item.selectedOptions)
                        : updateQty(
                          item.id,
                          item.qty - 1,
                          item.selectedOptions
                        )
                    }
                    className="px-2 py-1 border rounded shadow-sm hover:bg-gray-100"
                  >
                    <FaMinus />
                  </button>

                  <span className="px-4 py-1 border rounded bg-gray-50">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item.id, item.qty + 1, item.selectedOptions)
                    }
                    className="px-2 py-1 border rounded shadow-sm hover:bg-gray-100"
                  >
                    <FaPlus />
                  </button>

                  <button
                    onClick={() => removeItem(item.id, item.selectedOptions)}
                    className="ml-3"
                  >
                    <FaTrash className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Selected Options */}
                {item.selectedOptions &&
                  Object.keys(item.selectedOptions).length > 0 && (
                    <div className="mt-1 text-sm text-gray-500">
                      {Object.entries(item.selectedOptions)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(", ")}
                    </div>
                  )}
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

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded shadow-md hover:bg-orange-600 transition"
              >
                Checkout
              </button>

              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded shadow-md hover:bg-gray-300 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
