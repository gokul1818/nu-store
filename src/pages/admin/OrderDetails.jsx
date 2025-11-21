import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminAPI } from "../../services/api";

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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ================================
  // 🚀 Load Order from Backend
  // ================================
  const loadOrder = async () => {
    try {
      const res = await AdminAPI.getOrderById(id);
      const data = res.data;

      setOrder(data);
      setStatus(data.status);
      setTrackingNumber(data.trackingNumber || "");
    } catch (err) {
      console.log("ERROR:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        Loading order...
      </div>
    );

  if (!order)
    return (
      <div className="p-6 text-center text-gray-500">Order not found</div>
    );

  // ================================
  // 🔄 Update Order
  // ================================
  const updateOrder = async () => {
    setUpdating(true);
    try {
      await AdminAPI.updateOrder(order._id, {
        status,
        trackingNumber,
      });

      alert("Order updated successfully!");
      loadOrder();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
    setUpdating(false);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-2">Order #{order._id}</h2>
        <p className="mb-2 text-gray-700">
          <strong>Customer ID:</strong> {order.user.uniqId}
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Customer Name:</strong> {order.user.firstName} {order.user.lastName} ({order.user.email})
        </p>
        <p className="mb-2 text-gray-700">
          <strong>Phone Number:</strong> {order.user.phone}
        </p>
        <p className="mb-2 text-gray-700">
          <strong>Payment:</strong> {order.paymentMethod}
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
        </p>

        <p className="mb-4 text-gray-700">
          <strong>Shipping:</strong> {order.shippingAddress.street},{" "}
          {order.shippingAddress.city}
        </p>

        {/* STATUS + TRACKING */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-4">
          <div>
            <strong>Status:</strong>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`ml-2 px-3 py-1 rounded border focus:outline-none focus:ring-1 focus:ring-orange-300 ${statusColors[status]}`}
            >
              {Object.keys(statusColors).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking Number */}
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
            disabled={updating}
            className={`mt-2 md:mt-0 px-4 py-2 rounded text-white transition ${updating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {updating ? "Saving..." : "Save"}
          </button>
        </div>

        {/* ITEMS LIST */}
        <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between border p-3 rounded hover:shadow-sm transition"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500 text-sm">Quantity: {item.qty}</p>
                <p className="text-gray-500 text-sm">
                  ₹{item.price} each
                </p>
              </div>
              <div className="font-semibold">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <p className="mt-4 font-bold text-lg">
          Total: ₹{order.totalAmount}
        </p>
      </div>
    </div>
  );
}
