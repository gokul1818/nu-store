import { useEffect, useState } from "react";
import { Pagination } from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminAPI } from "../../services/api";

const statusBorderColors = {
  Processing: "border-l-4 border-yellow-500",
  Packed: "border-l-4 border-blue-500",
  Shipped: "border-l-4 border-indigo-500",
  Delivered: "border-l-4 border-green-500",
  Cancelled: "border-l-4 border-red-500",
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeTab, setActiveTab] = useState("New");
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  
  const tabs = ["New", "Packed", "Shipped", "Delivered", "Cancelled"];

  // 👉 Convert "New" tab → "Processing" filter
  const getStatusFilter = () =>
    activeTab === "New" ? "Processing" : activeTab;

  // ===========================
  // 🚀 Load Orders from Backend
  // ===========================
  const load = async (page = 1) => {
    setLoading(true);
    try {
      const statusFilter = getStatusFilter();

      const res = await AdminAPI.getOrders(page, itemsPerPage, statusFilter);

      setOrders(res.data.orders || []);
      setTotalOrders(res.data.total || 0);
    } catch (err) {
      console.log("Error loading orders:", err);
    }
    setLoading(false);
  };

  // ===========================
  // 🔄 Update Local Status Only
  // ===========================
  const updateStatus = async (id, newStatus) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
  };

  // When tab changes → reload page 1
  useEffect(() => {
    setCurrentPage(1);
    load(1);
  }, [activeTab]);

  // When page changes
  useEffect(() => {
    load(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

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

      {/* ================= TAB FILTERS ================= */}
      <div className="flex mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 font-semibold text-black text-center rounded-t-3xl ${activeTab === tab
              ? "bg-orange-200 border-b-2 border-b-orange-700"
              : ""
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= LOADER ================= */}
      {loading && (
        <div className="py-10 text-center text-lg font-semibold text-gray-600">
          Loading orders...
        </div>
      )}

      {/* ================= ORDER LIST ================= */}
      {!loading && (
        <div className="space-y-4">
          {orders?.map((o) => (
            <div
              key={o.id}
              className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg  overflow-hidden transition-all duration-300 hover:scale-[1.01] ${statusBorderColors[o.status]
                }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <div className="font-bold text-lg">Order #{o.id}</div>
                  <div className="text-gray-500 text-sm">{o.user?.firstName} {o.user?.lastName}</div>
                  <div className="text-gray-500 text-sm">{o.user?.email}</div>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[o.status]
                    }`}
                >
                  {o.status}
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-4">
                {o.items?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 p-2 border rounded-lg"
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        item.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md border"
                    />

                    {/* DETAILS */}
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">
                        {item.title}
                      </span>

                      {/* color + size if you want */}
                      {item.selectedOptions && (
                        <span className="text-sm text-gray-500">
                          {item.selectedOptions.color} • {item.selectedOptions.size}
                        </span>
                      )}

                      <span className="text-gray-500 text-sm">
                        Quantity: {item.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>


              {/* Status Dropdown */}

              <div className="flex items-center justify-between">
                <button
                  className="text-blue-600 hover:underline mt-2"
                  onClick={() => navigate(`/admin/orders/details/${o.id}`)}
                >
                  View details
                </button>

              </div>
            </div>
          ))}

          {orders.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-6">
              No orders in this category.
            </div>
          )}
        </div>
      )
      }

      {/* ================= PAGINATION ================= */}
      {
        !loading && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )
      }
    </div >
  );
}
