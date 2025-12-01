import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import SpinLoader from "../components/SpinLoader";
import { generateTrackingSteps } from "../utils/helpers";
import { AdminAPI, ProductAPI } from "../services/api";
import { showError, showSuccess } from "../components/AppToast";

export default function UserOrderDetails() {
  const { id } = useParams(); // order id from URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({}); // store rating & comment per product
  const [submitting, setSubmitting] = useState({}); // track loading per product

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
        showError("Failed to load order details");
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

  const steps = generateTrackingSteps(order.status, order.created_at);

  const handleReviewChange = (id, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmitReview = async (item) => {
    const data = reviewData[item.id];
    if (!data?.rating || !data?.comment) {
      return showError("Please add rating & comment");
    }

    setSubmitting((prev) => ({ ...prev, [item.id]: true }));
    try {
      await ProductAPI.addReview(item.product.id, {
        rating: data.rating,
        comment: data.comment,
      });

      showSuccess("Review submitted successfully!");

      // Update order locally to reflect new review
      setOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === item.id
            ? {
              ...i,
              product: {
                ...i.product,
                reviews: [
                  ...i.product.reviews,
                  {
                    rating: data.rating,
                    comment: data.comment,
                    user: order.user.id,
                    id: Date.now().toString(), // temporary id
                  },
                ],
              },
            }
            : i
        ),
      }));

      setReviewData((prev) => ({
        ...prev,
        [item.id]: { rating: 0, comment: "" },
      }));
    } catch (err) {
      console.error(err);
      showError("Failed to submit review");
    } finally {
      setSubmitting((prev) => ({ ...prev, [item.id]: false }));
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
        <h2 className="text-2xl font-bold mb-2">Order #{order.id}</h2>
        <p className="text-gray-600 mb-1">
          <strong>Status:</strong> {order.status}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Placed On:</strong>{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>

        {order.tracking_number && order.tracking_url && (
          <p className="text-gray-600 mb-2">
            <strong>Tracking:</strong>{" "}
            <a
              href={order.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              {order.tracking_number}
            </a>
          </p>
        )}

        {/* Items */}
        <h3 className="text-xl font-semibold mt-4 mb-2">Items</h3>
        <div className="space-y-4">
          {order.items.map((item) => {
            // Check if current user already reviewed this product
            const hasReviewed = item.product.reviews.some(
              (r) => r.user === order.user.id
            );

            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-start border p-3 rounded gap-4"
              >
                {/* Product info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item?.images?.[0] || "/placeholder.png"}
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

                {/* Price */}
                <div className="font-semibold text-gray-800 whitespace-nowrap">
                  ₹{item.price * item.qty}
                </div>

                {/* Add Review Form */}
                {!hasReviewed && (
                  <div className="mt-2 md:mt-0 w-full md:w-1/3">
                    <h4 className="font-medium text-gray-700 mb-1">
                      Add Review
                    </h4>

                    {/* Star Rating */}
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          className="cursor-pointer transition-colors"
                          color={
                            (reviewData[item.id]?.rating || 0) >= star
                              ? "#FFA500"
                              : "#ddd"
                          }
                          onClick={() =>
                            handleReviewChange(item.id, "rating", star)
                          }
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <textarea
                      value={reviewData[item.id]?.comment || ""}
                      onChange={(e) =>
                        handleReviewChange(item.id, "comment", e.target.value)
                      }
                      rows={2}
                      className="border px-2 py-1 rounded w-full mb-1"
                      placeholder="Write your comment"
                    />

                    <button
                      onClick={() => handleSubmitReview(item)}
                      disabled={submitting[item.id]}
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300 w-full"
                    >
                      {submitting[item.id] ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 font-bold text-lg">Total: ₹{order.total_amount}</p>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Tracking Timeline</h3>
        <div className="relative ml-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start relative mb-6">
              {idx < steps.length - 1 && (
                <span
                  className={`absolute left-2.5 top-6 w-0.5 h-full ${steps[idx + 1].completed ? "bg-orange-500" : "bg-gray-300"
                    }`}
                />
              )}
              <div
                className={`w-5 h-5 rounded-full flex-shrink-0 mt-1 ${step.completed
                  ? "bg-orange-500"
                  : "bg-gray-200 border border-gray-300"
                  }`}
              />
              <div className="ml-4 text-sm">
                <div
                  className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"
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
