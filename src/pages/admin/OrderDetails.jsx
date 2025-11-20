import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const dummyOrders = Array.from({ length: 45 }, (_, i) => ({
  _id: `order${i + 1}`,
  user: { email: `user${i + 1}@example.com` },
  status: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"][i % 5],
  trackingNumber: "",
  items: [
    { productId: `p${i + 1}-1`, title: `Product ${i + 1}-1`, qty: 1, price: 100 },
    { productId: `p${i + 1}-2`, title: `Product ${i + 1}-2`, qty: 2, price: 200 },
  ],
}));

const statusColors = {
  Processing: "bg-yellow-200 text-yellow-800",
  Packed: "bg-blue-200 text-blue-800",
  Shipped: "bg-indigo-200 text-indigo-800",
  Delivered: "bg-green-200 text-green-800",
  Cancelled: "bg-red-200 text-red-800",
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const found = dummyOrders.find((o) => o._id === id);
    if (found) {
      setOrder(found);
      setStatus(found.status);
      setTrackingNumber(found.trackingNumber || "");
    }
  }, [id]);

  if (!order) return <div className="p-6 text-center text-gray-500">Order not found</div>;

  const totalAmount = order.items.reduce((acc, i) => acc + i.qty * i.price, 0);

  const updateOrder = () => {
    // Update locally (dummy data)
    order.status = status;
    order.trackingNumber = trackingNumber;
    alert("Order updated successfully!");
    setOrder({ ...order });
  };

  return (
    <div className="container mx-auto p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Order #{order._id}</h2>
        <p className="mb-2"><strong>Customer:</strong> {order.user.email}</p>

        <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-4">
          <div>
            <strong>Status:</strong>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`ml-2 px-3 py-1 rounded border focus:outline-none focus:ring-1 focus:ring-orange-300 ${statusColors[status]}`}
            >
              {Object.keys(statusColors).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mt-2 md:mt-0">
            <strong>Tracking Number:</strong>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="ml-2 px-3 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-orange-300"
            />
          </div>

          <button
            onClick={updateOrder}
            className="mt-2 md:mt-0 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Save
          </button>
        </div>

        <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between border p-3 rounded hover:shadow-sm transition">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500 text-sm">Quantity: {item.qty}</p>
              </div>
              <div className="font-semibold">${item.price * item.qty}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 font-bold text-lg">Total: ${totalAmount}</p>
      </div>
    </div>
  );
}
