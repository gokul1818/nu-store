import { useState } from "react";
import useCartStore from "../stores/useCartStore";
import useAuthStore from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const createOrder = useCartStore((s) => s.createOrder);
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = {
        items,
        shippingAddress: {
          // in production, capture form fields
          address: "Sample address",
          city: "City",
          pincode: "000000",
        },
        userId: user._id,
        paymentMethod: "online",
      };
      const res = await createOrder(order);
      // res should contain the order id and status
      navigate("/orders");
    } catch (err) {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded">
        <div className="mb-3">
          <label className="block">Name</label>
          <input defaultValue={user?.firstName || user?.name} className="border p-2 w-full rounded" />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <textarea className="border p-2 w-full rounded"></textarea>
        </div>

        <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Placing..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
