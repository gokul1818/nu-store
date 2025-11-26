import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "../components/AppToast";
import SpinLoader from "../components/SpinLoader";
import { AdminAPI, ProductAPI } from "../services/api";
import { generateTrackingSteps } from "../utils/helpers";

export default function UserOrderDetails() {
  const { id } = useParams(); // order id from URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({}); // store rating & comment per item
  const [submitting, setSubmitting] = useState({}); // track loading per item

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
      <div className="p-6 text-center text-gray-600">Order not found.</div>
    );

  const steps = generateTrackingSteps(order.status, order.createdAt);

  const handleReviewChange = (_id, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [_id]: { ...prev[_id], [field]: value },
    }));
  };

  const handleSubmitReview = async (item) => {
    const data = reviewData[item._id];
    if (!data?.rating || !data?.comment) {
      return showError("Please add rating & comment"); // using toast instead of alert
    }

    setSubmitting((prev) => ({ ...prev, [item._id]: true }));
    try {
      // Submit review to the correct product ID
      await ProductAPI.addReview(item.product._id, {
        rating: data.rating,
        comment: data.comment,
      });

      showSuccess("Review submitted successfully!"); // toast

      // Update local state to show the new review immediately
      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i._id === item._id
            ? {
                ...i,
                product: {
                  ...i.product,
                  reviews: [
                    ...i.product.reviews,
                    {
                      rating: data.rating,
                      comment: data.comment,
                      _id: Date.now().toString(), // temporary id
                    },
                  ],
                },
              }
            : i
        ),
      }));

      setReviewData((prev) => ({
        ...prev,
        [item._id]: { rating: 0, comment: "" },
      }));
    } catch (err) {
      console.error(err);
      showError("Failed to submit review"); // toast
    } finally {
      setSubmitting((prev) => ({ ...prev, [item._id]: false }));
    }
  };

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
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start border p-3 rounded gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item?.product?.images?.[0] || "/placeholder.png"}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded border"
                />
                <div>
                  <p className="font-medium text-gray-700">
                    {item.product.title}
                  </p>
                  {item.variant && (
                    <p className="text-sm text-gray-500">
                      {item.variant.color} • {item.variant.size}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                </div>
              </div>
              <div className="font-semibold text-gray-800 whitespace-nowrap">
                ₹{item.price * item.qty}
              </div>

              {/* Add Review Form */}
              <div className="mt-2 md:mt-0 w-full md:w-1/3">
                <h4 className="font-medium text-gray-700 mb-1">Add Review</h4>
                <select
                  value={reviewData[item._id]?.rating || 0}
                  onChange={(e) =>
                    handleReviewChange(
                      item._id,
                      "rating",
                      Number(e.target.value)
                    )
                  }
                  className="border px-2 py-1 rounded w-full mb-1"
                >
                  <option value={0}>Select Rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <textarea
                  value={reviewData[item._id]?.comment || ""}
                  onChange={(e) =>
                    handleReviewChange(item._id, "comment", e.target.value)
                  }
                  rows={2}
                  className="border px-2 py-1 rounded w-full mb-1"
                  placeholder="Write your comment"
                />
                <button
                  onClick={() => handleSubmitReview(item)}
                  disabled={submitting[item._id]}
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300 w-full"
                >
                  {submitting[item._id] ? "Submitting..." : "Submit"}
                </button>
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
              {idx < steps.length - 1 && (
                <span
                  className={`absolute left-2.5 top-6 w-0.5 h-full ${
                    steps[idx + 1].completed ? "bg-orange-500" : "bg-gray-300"
                  }`}
                />
              )}
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 mt-1 ${
                  step.completed
                    ? "bg-orange-500"
                    : "bg-gray-200 border border-gray-300"
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
