import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import { Pagination } from "../components/Pagination"; // assuming you move your Pagination component to its own file

// Dummy orders
const dummyOrders = [
  {
    _id: "ORD1001",
    status: "Delivered",
    items: [{ variant: { _id: "v1", color: "Black", size: "M", image: "/placeholder.png" } }],
    tracking: {
      steps: [
        { title: "Order Placed", date: "2025-11-10", completed: true },
        { title: "Shipped", date: "2025-11-12", completed: true },
        { title: "Out for Delivery", date: "2025-11-14", completed: true },
        { title: "Delivered", date: "2025-11-15", completed: true },
      ],
    },
  },
  {
    _id: "ORD1002",
    status: "Cancelled",
    items: [{ variant: { _id: "v2", color: "Red", size: "L", image: "/placeholder.png" } }],
    tracking: {
      steps: [
        { title: "Order Placed", date: "2025-11-11", completed: true },
        { title: "Cancelled", date: "2025-11-12", completed: true },
      ],
    },
  },
  {
    _id: "ORD1003",
    status: "Shipped",
    items: [{ variant: { _id: "v3", color: "Blue", size: "S", image: "/placeholder.png" } }],
    tracking: {
      steps: [
        { title: "Order Placed", date: "2025-11-12", completed: true },
        { title: "Shipped", date: "2025-11-14", completed: true },
        { title: "Out for Delivery", date: "2025-11-16", completed: false },
        { title: "Delivered", date: "2025-11-18", completed: false },
      ],
    },
  },
  {
    _id: "ORD1004",
    status: "Placed",
    items: [{ variant: { _id: "v4", color: "Green", size: "XL", image: "/placeholder.png" } }],
    tracking: {
      steps: [
        { title: "Order Placed", date: "2025-11-15", completed: true },
        { title: "Shipped", date: "", completed: false },
        { title: "Out for Delivery", date: "", completed: false },
        { title: "Delivered", date: "", completed: false },
      ],
    },
  },
  // Add more dummy orders if needed
];

function OrdersList() {
  const [orders, setOrders] = useState(dummyOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showReview, setShowReview] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const handleCancelOrder = (orderId, e) => {
    e.stopPropagation();
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
    );
  };

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-3">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      <AnimatePresence>
        {paginatedOrders.map((order) => {
          const isExpanded = expandedOrder === order._id;

          const lineColor =
            order.status === "Delivered"
              ? "bg-green-500"
              : order.status === "Cancelled"
              ? "bg-red-500"
              : order.status === "Shipped"
              ? "bg-blue-500"
              : "bg-gray-300";

          return (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer overflow-hidden hover:shadow-lg transition"
              onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
            >
              {/* Basic Order Info */}
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-800 text-lg">Order #{order._id}</div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              {/* Item Thumbnails */}
              <div className="flex gap-3 mt-3 overflow-x-auto">
                {order.items.map((item) => (
                  <img
                    key={item.variant._id}
                    src={item.variant.image || "/placeholder.png"}
                    alt={`${item.variant.color} ${item.variant.size}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>

              {/* Expanded Tracking Timeline */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 border-t border-gray-200 pt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 className="font-semibold text-gray-700 mb-3">Tracking Timeline</h4>
                    {order.tracking?.steps ? (
                      <div className="relative ml-4">
                        {order.tracking.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start relative mb-6">
                            {idx < order.tracking.steps.length - 1 && (
                              <span
                                className={`absolute left-2.5 top-6 w-0.5 h-full ${lineColor}`}
                              />
                            )}
                            <div
                              className={`w-5 h-5 rounded-full flex-shrink-0 mt-1 ${
                                step.completed ? lineColor : "bg-gray-200 border border-gray-300"
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
                                {step.date || "Pending"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No tracking info yet</div>
                    )}

                    {/* Review Section */}
                    {order.status === "Delivered" && showReview[order._id] !== "skip" && (
                      <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                        {showReview[order._id] !== "continue" ? (
                          <div className="flex items-center gap-2">
                            <span>Would you like to add a review?</span>
                            <button
                              onClick={() =>
                                setShowReview((prev) => ({ ...prev, [order._id]: "continue" }))
                              }
                              className="px-3 py-1 bg-orange-500 text-white rounded"
                            >
                              Continue
                            </button>
                            <button
                              onClick={() =>
                                setShowReview((prev) => ({ ...prev, [order._id]: "skip" }))
                              }
                              className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                            >
                              Skip
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span>Star Rating:</span>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="text-orange-400 text-xl hover:scale-110 transition"
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <div>
                              <textarea
                                placeholder="Write your review (optional)"
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                              />
                            </div>
                            <button className="px-4 py-2 bg-orange-500 text-white rounded">
                              Submit Review
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cancel Order */}
                    {order.status === "Placed" && (
                      <div className="mt-4">
                        <button
                          onClick={(e) => handleCancelOrder(order._id, e)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
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
