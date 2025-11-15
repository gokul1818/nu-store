import useCartStore from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {items.length === 0 ? (
        <div>
          <p>Cart is empty.</p>
          <Link to="/products" className="text-blue-600">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {items.map((it) => (
              <div key={it._id + JSON.stringify(it.selectedOptions)} className="bg-white p-4 rounded mb-3 flex gap-4">
                <img src={it.thumbnail || it.image || "/placeholder.png"} className="w-28 h-28 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{it.name}</h3>
                  <div className="mt-2">Price: {formatCurrency(it.price)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" value={it.qty} onChange={(e) => updateQty(it._id, Math.max(1, Number(e.target.value)), it.selectedOptions)} className="w-20 border p-1 rounded" />
                    <button onClick={() => removeItem(it._id, it.selectedOptions)} className="text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="mt-3">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between mt-2"><span>Shipping</span><span>{formatCurrency(shipping)}</span></div>
              <div className="flex justify-between mt-2"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between mt-4 font-bold"><span>Total</span><span>{formatCurrency(total)}</span></div>
              <button onClick={() => navigate("/checkout")} className="mt-4 w-full bg-black text-white py-2 rounded">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
