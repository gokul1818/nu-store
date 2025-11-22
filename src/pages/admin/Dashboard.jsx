import AdminRoute from "../../components/AdminRoute";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { AdminAPI } from "../../services/api";
import SpinLoader from "../../components/SpinLoader";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await AdminAPI.getDashboard();
        setDashboard(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !dashboard) return <SpinLoader />;

  // Format revenue analytics for line chart
  const revenueData = dashboard.revenueAnalytics?.map((rev, idx) => ({
    name: new Date(2025, idx).toLocaleString("default", { month: "short" }),
    revenue: Number(rev),
  })) || [];

  // Format orders data for bar chart
  const ordersData =
    dashboard.orderStatus
      ? Object.entries(dashboard.orderStatus).map(([status, value]) => ({
          status,
          value: Number(value),
        }))
      : [];

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-6">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Dashboard
        </motion.h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { title: "Total Sales", value: `₹${Number(dashboard.totalSales || 0).toLocaleString()}` },
            { title: "Total Orders", value: Number(dashboard.totalOrders || 0) },
            { title: "Total Users", value: Number(dashboard.totalUsers || 0) },
            { title: "Avg Order Value", value: `₹${Number(dashboard.avgOrderValue || 0).toFixed(2)}` },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Line Chart & Low Stock Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg md:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#F97310" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
            <ul className="space-y-2 text-sm">
              {dashboard.lowStock?.map((item, idx) => (
                <li key={idx}>
                  {item.title} -{" "}
                  {item.stock > 0 ? `Only ${item.stock} left` : "Out of stock"}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Orders Bar Chart & Best-Selling Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#F9731680" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">🔥 Best-Selling Products</h3>
            <ul className="space-y-3">
              {dashboard.bestSelling?.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>{item.totalSold}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </AdminRoute>
  );
}
