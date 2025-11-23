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
  const [updating, setUpdating] = useState(false);

  // 🔥 Load order from backend
  const loadOrder = async () => {
    try {
      const res = await AdminAPI.getOrderById(id);
      setOrder(res.data);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order)
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        Loading order...
      </div>
    );

  // 🔥 Instant update function
  const updateInstant = async (patch) => {
    setUpdating(true);
    try {
      await AdminAPI.updateOrderStatus(order._id, patch);
      await loadOrder(); // refresh UI
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
    setUpdating(false);
  };

  // STATUS change → auto update
  const handleStatusChange = async (value) => {
    await updateInstant({
      status: value,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
    });
  };

  // TRACKING NUMBER change → auto update
  const handleTrackingNumberChange = async (value) => {
    await updateInstant({
      status: order.status,
      trackingNumber: value,
      trackingUrl: order.trackingUrl,
    });
  };

  // TRACKING URL change → auto update
  const handleTrackingUrlChange = async (value) => {
    await updateInstant({
      status: order.status,
      trackingNumber: order.trackingNumber,
      trackingUrl: value,
    });
  };

  return (
    <div className="container mx-auto p-6">

      {/* Back */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">

        {/* ORDER HEADER */}
        <h2 className="text-2xl font-bold mb-2">Order #{order._id}</h2>

        <p className="mb-2 text-gray-700">
          <strong>Customer:</strong> {order.user.firstName} {order.user.lastName}
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Email:</strong> {order.user.email}
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Phone:</strong> {order.user.phone}
        </p>

        {/* STATUS */}
        <div className="mt-4">
          <strong>Status:</strong>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className={`ml-2 px-3 py-1 rounded border ${statusColors[order.status]}`}
          >
            {Object.keys(statusColors).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* TRACKING NUMBER */}
        <div className="mt-4">
          <strong>Tracking Number:</strong>
          <input
            type="text"
            defaultValue={order.trackingNumber}
            placeholder="Enter tracking number"
            onBlur={(e) => handleTrackingNumberChange(e.target.value)}
            disabled={updating}
            className="ml-2 px-3 py-1 rounded border"
          />
        </div>

        {/* TRACKING URL */}
        <div className="mt-4">
          <strong>Tracking URL:</strong>
          <input
            type="text"
            defaultValue={order.trackingUrl}
            placeholder="https://tracking..."
            onBlur={(e) => handleTrackingUrlChange(e.target.value)}
            disabled={updating}
            className="ml-2 px-3 py-1 rounded border w-full max-w-md"
          />
        </div>

        {/* ITEMS */}
        <h3 className="text-xl font-semibold mt-6 mb-2">Items</h3>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border p-3 rounded gap-4"
            >
              {/* LEFT: IMAGE + TITLE + QTY */}
              <div className="flex items-center gap-3">
                {/* IMAGE */}
                <img
                  src={
                    item?.images?.[0] ||
                    item.thumbnail ||
                    item.selectedOptions?.image ||
                    "/placeholder.png"
                  }
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded border"
                />

                {/* TEXT */}
                <div>
                  <p className="font-medium text-gray-700">{item.title}</p>

                  {item.selectedOptions && (
                    <p className="text-sm text-gray-500">
                      {item.selectedOptions.color} • {item.selectedOptions.size}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                </div>
              </div>

              {/* RIGHT: PRICE */}
              <div className="font-semibold text-gray-800 whitespace-nowrap">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}

        </div>

        <p className="mt-4 font-bold text-lg">
          Total: ₹{order.totalAmount}
        </p>

      </div>
    </div>
  );
}
