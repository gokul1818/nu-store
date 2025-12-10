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

  // Load order
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

  // Auto-update function (status, tracking number, tracking url)
  const updateInstant = async (patch) => {
    setUpdating(true);
    try {
      await AdminAPI.updateOrderStatus(order.id, patch);
      await loadOrder(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
    setUpdating(false);
  };

  const handleStatusChange = async (value) => {
    await updateInstant({
      status: value,
      tracking_number: order.tracking_number,
      tracking_url: order.tracking_url,
    });
  };

  const handleTrackingNumberChange = async (value) => {
    await updateInstant({
      status: order.status,
      tracking_number: value,
      tracking_url: order.tracking_url,
    });
  };

  const handleTrackingUrlChange = async (value) => {
    await updateInstant({
      status: order.status,
      tracking_number: order.tracking_number,
      tracking_url: value,
    });
  };

  // Parse shipping address JSON safely
  let addr = {};
  try {
    addr = JSON.parse(order.shipping_address || "{}");
  } catch (err) {
    console.log("Address parse error", err);
  }

  return (
    <div className="container mx-auto p-6">

      {/* Back button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">

        {/* ORDER HEADER */}
        <h2 className="text-2xl font-bold mb-2">Order #{order.id}</h2>

        {/* CUSTOMER INFO */}
        <p className="mb-2 text-gray-700">
          <strong>Customer:</strong> {order.user.first_name}{" "}
          {order.user.last_name || ""}
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Email:</strong> {order.user.email}
        </p>

        {/* SHIPPING ADDRESS FROM JSON */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-1">Shipping Address</h3>

          <div className="text-gray-700 leading-relaxed">
            <p>
              {addr.doorNo}, {addr.street}, <br />
              {addr.city}, {addr.state} - {addr.zipcode} <br />
              {addr.country}
            </p>

            <p className="mt-2">
              <strong>Phone:</strong> {addr.phone || "N/A"}
            </p>
          </div>
        </div>

        {/* STATUS DROPDOWN */}
        <div className="mt-6">
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
            defaultValue={order.tracking_number}
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
            defaultValue={order.tracking_url}
            placeholder="https://tracking..."
            onBlur={(e) => handleTrackingUrlChange(e.target.value)}
            disabled={updating}
            className="ml-2 px-3 py-1 rounded border w-full max-w-md"
          />
        </div>

        {/* ORDER ITEMS */}
        <h3 className="text-xl font-semibold mt-6 mb-2">Items</h3>

        <div className="space-y-2">
          {JSON.parse(order.items).map((item) => {
            let imgs = [];
            try {
              imgs = JSON.parse(item.images);
            } catch {}

            return (
              <div
                key={item.productId}
                className="flex justify-between items-center border p-3 rounded gap-4"
              >
                {/* LEFT SIDE - image + title */}
                <div className="flex items-center gap-3">
                  <img
                    src={imgs[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded border"
                  />

                  <div>
                    <p className="font-medium text-gray-700">{item.title}</p>

                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        {item.variant.color} • {item.variant.size}
                      </p>
                    )}

                    <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                  </div>
                </div>

                {/* RIGHT SIDE - price */}
                <div className="font-semibold text-gray-800 whitespace-nowrap">
                  ₹{item.price * item.qty}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 font-bold text-lg">
          Total: ₹{order.total_amount}
        </p>

      </div>
    </div>
  );
}
