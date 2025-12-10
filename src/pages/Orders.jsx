import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import { Pagination } from "../components/Pagination";
import { useOrderStore } from "../stores/useOrderStore";
import { generateTrackingSteps } from "../utils/helpers";
import { ProductAPI } from "../services/api";

function OrdersList() {
  const { orders, page, totalPages, loading, loadMyOrders } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // review form state
  const [reviewData, setReviewData] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    loadMyOrders(1);
  }, []);

  const handlePageChange = (p) => {
    loadMyOrders(p);
  };

  if (!loading && orders.length === 0)
    return (
      <div className="text-center py-20 text-gray-600">
        No orders found. Start shopping!
      </div>
    );

  // -------------------------
  // UPDATE REVIEW DATA
  // -------------------------
  const handleReviewChange = (itemId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  // -------------------------
  // SUBMIT REVIEW
  // -------------------------
  const handleSubmitReview = async (item) => {
    const data = reviewData[item.productId];

    if (!data?.rating || !data?.comment) {
      return alert("Please provide rating & comment");
    }

    setSubmitting((p) => ({ ...p, [item.productId]: true }));

    try {
      await ProductAPI.addReview(item.productId, {
        rating: data.rating,
        comment: data.comment,
      });

      alert("Review submitted!");

      // clear form
      setReviewData((prev) => ({
        ...prev,
        [item.productId]: { rating: 0, comment: "" },
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmitting((p) => ({ ...p, [item.productId]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-3">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {loading && <div className="text-center py-10">Loading...</div>}

      <AnimatePresence>
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;

          // parse items JSON
          let parsedItems = [];
          try {
            parsedItems = JSON.parse(order.items || "[]");
          } catch { }

          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => {
                e.stopPropagation()
                setExpandedOrder(isExpanded ? null : order.id)
              }}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-800 text-lg">
                  Order #{order.id}
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Packed"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.status}
                </div>
              </div>

              {/* ITEM PREVIEW */}
              <div className="flex mt-3 overflow-x-auto w-full">
                {parsedItems.map((item, idx) => {
                  let imgs = [];
                  try {
                    imgs = JSON.parse(item.images || "[]");
                  } catch { }

                  return (
                    <div
                      key={idx}
                      className="flex flex-row gap-5 pr-4 items-center"
                    >
                      <img
                        src={imgs[0] || "/placeholder.png"}
                        className="w-20 h-20 rounded-lg border object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-600 font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          ₹ {order.total_amount}
                        </p>

                        {/* Tracking link */}
                        {order.tracking_number && order.tracking_url && (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 mt-2 block hover:underline text-sm"
                          >
                            {order.tracking_number}
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EXPANDED CONTENT */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 border-t border-gray-200 pt-4"
                  >
                    {/* ITEM LIST */}
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Order Items
                    </h3>

                    <div className="space-y-4">
                      {parsedItems.map((item, idx) => {
                        let imgs = [];
                        try {
                          imgs = JSON.parse(item.images || "[]");
                        } catch { }

                        return (
                          <div
                            key={idx}
                            className="flex justify-between items-start border p-3 rounded"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={imgs[0] || "/placeholder.png"}
                                className="w-16 h-16 rounded border object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-700">
                                  {item.title}
                                </p>
                                {item.variant && (
                                  <p className="text-sm text-gray-500">
                                    {item.variant.color} •{" "}
                                    {item.variant.size}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">
                                  Qty: {item.qty}
                                </p>
                              </div>
                            </div>

                            <div className="font-semibold text-gray-800">
                              ₹{item.price * item.qty}
                            </div>

                            {/* REVIEW SECTION - ONLY IF DELIVERED */}
                            {order.status === "Delivered" && (
                              <div className="w-1/3 ml-4">

                                <h4 className="font-medium text-gray-700 mb-1">
                                  Add Review
                                </h4>

                                {/* STAR RATING */}
                                <div className="flex gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className="cursor-pointer text-xl"
                                      style={{
                                        color:
                                          (reviewData[item.productId]
                                            ?.rating || 0) >= star
                                            ? "#FFA500"
                                            : "#ddd",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation()

                                        handleReviewChange(
                                          item.productId,
                                          "rating",
                                          star
                                        )
                                      }
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>

                                {/* COMMENT */}
                                <textarea
                                  className="border px-2 py-1 rounded w-full mb-2"
                                  rows={2}
                                  placeholder="Write your review..."
                                  value={
                                    reviewData[item.productId]?.comment ||
                                    ""
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation()
                                    handleReviewChange(
                                      item.productId,
                                      "comment",
                                      e.target.value
                                    )
                                  }
                                  }
                                />

                                {/* SUBMIT */}
                                <button
                                  disabled={submitting[item.productId]}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSubmitReview(item)
                                  }}
                                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 w-full disabled:bg-gray-300"
                                >
                                  {submitting[item.productId]
                                    ? "Submitting..."
                                    : "Submit Review"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* SHIPPING */}
                    <h3 className="font-semibold text-gray-700 mt-5 mb-2">
                      Shipping Address
                    </h3>

                    {(() => {
                      let addr = {};
                      try {
                        addr = JSON.parse(order.shipping_address || "{}");
                      } catch { }
                      return (
                        <div className="text-gray-600 text-sm leading-relaxed">
                          {addr.doorNo}, {addr.street}, {addr.city},{" "}
                          {addr.state} - {addr.zipcode} <br />
                          {addr.country} <br />
                          📞 {addr.phone}
                        </div>
                      );
                    })()}

                    {/* TOTAL */}
                    <p className="mt-4 text-lg font-bold">
                      Total: ₹{order.total_amount}
                    </p>

                    {/* TRACKING TIMELINE */}
                    <h3 className="font-semibold mt-4 mb-2">
                      Tracking Timeline
                    </h3>

                    <div className="relative ml-4">
                      {generateTrackingSteps(
                        order.status,
                        order.created_at
                      ).map((step, idx, arr) => (
                        <div
                          key={idx}
                          className="flex items-start relative mb-6"
                        >
                          {idx < arr.length - 1 && (
                            <span
                              className={`absolute left-2.5 top-6 w-0.5 h-full ${arr[idx + 1].completed
                                ? "bg-orange-500"
                                : "bg-gray-300"
                                }`}
                            />
                          )}

                          <div
                            className={`w-5 h-5 rounded-full mt-1 ${step.completed
                              ? "bg-orange-500"
                              : "bg-gray-200 border"
                              }`}
                          />

                          <div className="ml-4 text-sm">
                            <p
                              className={`font-medium ${step.completed
                                ? "text-gray-900"
                                : "text-gray-500"
                                }`}
                            >
                              {step.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {step.completed ? "Done" : "Pending"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <OrdersList />
    </ProtectedRoute>
  );
}
