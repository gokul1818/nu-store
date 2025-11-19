import { useEffect, useState } from "react";
import { Pagination } from "../../components/Pagination";

// Dummy data for testing
const dummyOrders = Array.from({ length: 45 }, (_, i) => ({
  _id: `order${i + 1}`,
  user: { email: `user${i + 1}@example.com` },
  status: ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"][i % 5],
  items: [
    { productId: `p${i + 1}-1`, title: `Product ${i + 1}-1`, qty: 1 },
    { productId: `p${i + 1}-2`, title: `Product ${i + 1}-2`, qty: 2 },
  ],
}));

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeTab, setActiveTab] = useState("New");
  const itemsPerPage = 10;

  const statuses = [
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const tabs = ["New", "Packed", "Shipped", "Delivered", "Cancelled"];

  const load = async (page = 1) => {
    // Filter orders based on tab
    const filteredOrders = dummyOrders.filter((o) => {
      if (activeTab === "New") return o.status === "Processing"; // New = Processing
      return o.status === activeTab;
    });

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setOrders(filteredOrders.slice(start, end));
    setTotalOrders(filteredOrders.length);
  };

  const updateStatus = async (id, status) => {
    // Update locally for dummy data
    const updatedOrders = orders.map((o) =>
      o._id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders);
  };

  useEffect(() => {
    setCurrentPage(1); // reset to first page when tab changes
    load(1);
  }, [activeTab]);

  useEffect(() => {
    load(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Status badge colors
  const statusColors = {
    Processing: "bg-yellow-200 text-yellow-800",
    Packed: "bg-blue-200 text-blue-800",
    Shipped: "bg-indigo-200 text-indigo-800",
    Delivered: "bg-green-200 text-green-800",
    Cancelled: "bg-red-200 text-red-800",
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      <div className="flex mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 font-semibold text-black text-center rounded-t-3xl ${
              activeTab === tab
                ? "bg-orange-200 border-b-2 border-b-orange-700"
                : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <div className="font-semibold text-lg mr-3">
                    Order #{o._id}
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      statusColors[o.status]
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-2">{o.user.email}</div>
                <div className="flex flex-wrap gap-2">
                  {o.items.map((item) => (
                    <span
                      key={item.productId}
                      className="bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      {item.title} (x{item.qty})
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border rounded p-2 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No orders in this category.
          </div>
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
