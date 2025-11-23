import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import { Pagination } from "../components/Pagination";
import { useOrderStore } from "../stores/useOrderStore";
import { generateTrackingSteps } from "../utils/helpers";

function OrdersList() {
  const { orders, page, totalPages, loading, loadMyOrders } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // load page 1 when component mounts
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-3">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {loading && <div className="text-center py-10">Loading...</div>}

      <AnimatePresence>
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;



          return (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                setExpandedOrder(isExpanded ? null : order._id)
              }
            >
              {/* ORDER HEADER */}
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-800 text-lg">
                  Order #{order._id}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-800" :
                      order.status === "Packed"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.status}
                </div>
              </div>

              {/* ITEM IMAGES */}
              <div className="flex mt-3 overflow-x-auto w-full">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-row gap-5">
                    <img
                      src={item?.images?.[0] || "/placeholder.png"}
                      className="w-20 h-20  rounded-lg border mx-auto object-cover"
                    />
                    <div>

                      <p className="text-sm text-gray-600 mt-1 font-medium truncate w-54 text-wrap">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-900 mt-1 font-medium truncate w-54 text-wrap">
                        ₹ {order.totalAmount}
                      </p>
                      {order.trackingNumber && order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-600 mt-3 font-medium truncate w-54 block hover:underline cursor-pointer"
                          title="Open Tracking Link"
                        >
                          {order.trackingNumber}
                        </a>
                      )}

                    </div>
                  </div>
                ))}
              </div>


              {/* EXPANDED CONTENT */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 border-t border-gray-200 pt-4"
                  >
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Tracking Timeline
                    </h4>

                    {/* TRACKING TIMELINE */}
                    <div className="relative ml-4">
                      {(() => {
                        const steps = generateTrackingSteps(order.status, order.createdAt);

                        return steps.map((step, idx) => (
                          <div key={idx} className="flex items-start relative mb-6">

                            {/* Connecting Line */}
                            {idx < steps.length - 1 && (
                              <span
                                className={`absolute left-2.5 top-6 w-0.5 h-full ${steps[idx + 1].completed ? "bg-orange-500" : "bg-gray-300"
                                  }`}
                              />
                            )}

                            {/* Dot */}
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
                                <div className="text-gray-400 text-xs">
                                  {idx === 0
                                    ? new Date(step.date).toLocaleDateString()  // Processing shows date
                                    : step.completed
                                      ? "Done"
                                      : "Pending"}
                                </div>

                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>



                    {/* CANCEL ORDER */}
                    {order.status === "Placed" && (
                      <div className="mt-4">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
