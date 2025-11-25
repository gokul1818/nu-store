import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpinLoader from "../components/SpinLoader";
import { generateTrackingSteps } from "../utils/helpers";
import { AdminAPI } from "../services/api";

export default function UserOrderDetails() {
  const { id } = useParams(); // order id from URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Load order by ID
  // ---------------------------
  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const res = await AdminAPI.getOrderById(id); 
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOrder();
  }, [id]);

  if (loading) return <SpinLoader />;

  if (!order)
    return (
      <div className="p-6 text-center text-gray-600">
        Order not found.
      </div>
    );

  const steps = generateTrackingSteps(order.status, order.createdAt);

  return (
    <div className="container mx-auto p-6 space-y-6">

      {/* Back button */}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Order Header */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Order #{order._id}</h2>
        <p className="text-gray-600 mb-1">
          <strong>Status:</strong> {order.status}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>

        {order.trackingNumber && order.trackingUrl && (
          <p className="text-gray-600 mb-2">
            <strong>Tracking:</strong>{" "}
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {order.trackingNumber}
            </a>
          </p>
        )}

        {/* Items */}
        <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center border p-3 rounded gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item?.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded border"
                />
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
              <div className="font-semibold text-gray-800 whitespace-nowrap">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 font-bold text-lg">Total: ₹{order.totalAmount}</p>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Tracking Timeline</h3>
        <div className="relative ml-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start relative mb-6">
              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <span
                  className={`absolute left-2.5 top-6 w-0.5 h-full ${
                    steps[idx + 1].completed ? "bg-orange-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Dot */}
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 mt-1 ${
                  step.completed ? "bg-orange-500" : "bg-gray-200 border border-gray-300"
                }`}
              />

              <div className="ml-4 text-sm">
                <div
                  className={`font-medium ${
                    step.completed ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-gray-400 text-xs">
                  {step.completed
                    ? idx === 0
                      ? new Date(step.date).toLocaleDateString()
                      : "Done"
                    : "Pending"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
