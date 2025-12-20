import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../stores/useCartStore";
import { formatCurrency, formatCurrencyINR, safeParse } from "../utils/helpers";

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
          className="mt-4 bg-v-500 text-white py-2 px-4 rounded shadow-md hover:bg-v-600 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 relative">

      {/* Background dashed grid */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-30 -z-10">
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
        <div className="border-r border-dashed border-gray-300"></div>
      </div>

      <h2 className="text-4xl font-bold mb-12 text-center">Your Cart</h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Cart Items */}
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id + JSON.stringify(item.selectedOptions)}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex gap-5 border border-gray-200"
            >
              <Link to={`/product/${item.id}`}>
                <img
                  src={safeParse(item.images)[0] || "/placeholder.png"}
                  className="w-32 h-32 object-cover rounded-xl border"
                />
              </Link>

              <div className="flex-1 space-y-2">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-semibold text-xl text-gray-900">
                    {item.name}
                  </h3>
                </Link>

                <div className="text-v font-bold text-lg">
                  {formatCurrency(item.price)}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() =>
                      item.qty === 1
                        ? removeItem(item.id, item.selectedOptions)
                        : updateQty(item.id, item.qty - 1, item.selectedOptions)
                    }
                    className="w-9 h-9 flex items-center justify-center border rounded-lg hover:bg-gray-100 shadow-sm"
                  >
                    <FaMinus />
                  </button>

                  <span className="px-5 py-2 border rounded-lg bg-gray-50 shadow-sm">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item.id, item.qty + 1, item.selectedOptions)
                    }
                    className="w-9 h-9 flex items-center justify-center border rounded-lg hover:bg-gray-100 shadow-sm"
                  >
                    <FaPlus />
                  </button>

                  <button
                    onClick={() => removeItem(item.id, item.selectedOptions)}
                    className="ml-3"
                  >
                    <FaTrash className="w-5 h-5 text-red-600 hover:text-red-700" />
                  </button>
                </div>

                {/* Options */}
                {item.selectedOptions &&
                  Object.keys(item.selectedOptions).length > 0 && (
                    <p className="text-sm text-gray-500">
                      {Object.entries(item.selectedOptions)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(", ")}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit sticky top-6">
          <h3 className="font-semibold text-2xl text-gray-900">Order Summary</h3>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-gray-700 text-lg">
              <span>Subtotal</span>
              <span>{formatCurrencyINR(subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-lg">
              <span>Shipping</span>
              <span>{formatCurrencyINR(shipping)}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-lg">
              <span>Tax</span>
              <span>{formatCurrencyINR(tax)}</span>
            </div>

            <div className="flex justify-between font-bold text-2xl pt-4 border-t">
              <span>Total</span>
              <span className="text-v">{formatCurrencyINR(total)}</span>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 bg-v text-white py-3 rounded-xl font-semibold shadow hover:bg-v/90 transition"
              >
                Checkout
              </button>

              <button
                onClick={clearCart}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold shadow hover:bg-gray-200 transition"
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
