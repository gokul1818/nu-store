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

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5200 },
  { name: "Mar", revenue: 6800 },
  { name: "Apr", revenue: 7400 },
  { name: "May", revenue: 8900 },
  { name: "Jun", revenue: 9600 },
];

const ordersData = [
  { status: "Pending", value: 34 },
  { status: "Shipped", value: 78 },
  { status: "Delivered", value: 210 },
  { status: "Returned", value: 12 },
];

export default function Dashboard() {
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
            { title: "Total Sales", value: "$45,800" },
            { title: "Total Orders", value: "1,563" },
            { title: "Total Users", value: "2,348" },
            { title: "Avg Order Value", value: "$83.50" },
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
              <li>Denim Jacket - Only 4 left</li>
              <li>Linen Shirt - Only 2 left</li>
              <li>Black Hoodie - Out of stock</li>
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
            <h3 className="text-lg font-semibold mb-4">
              Order Status Breakdown
            </h3>
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
            <h3 className="text-lg font-semibold mb-4">
              🔥 Best-Selling Products
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Denim Jacket</span>
                <span>230 sold</span>
              </li>
              <li className="flex justify-between">
                <span>Summer Dress</span>
                <span>180 sold</span>
              </li>
              <li className="flex justify-between">
                <span>Cotton T-Shirt</span>
                <span>150 sold</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Recent Orders */}
        {/* <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-100 text-left text-gray-600 uppercase text-xs border-b">
                <th className="py-3 px-2">Order ID</th>
                <th className="px-2">Customer</th>
                <th className="px-2">Status</th>
                <th className="px-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "#1023",
                  name: "John Doe",
                  status: "Delivered",
                  total: "$250",
                },
                {
                  id: "#1024",
                  name: "Sarah Parker",
                  status: "Shipped",
                  total: "$180",
                },
                {
                  id: "#1025",
                  name: "Alex Lee",
                  status: "Pending",
                  total: "$99",
                },
              ].map((order, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-3 px-2">{order.id}</td>
                  <td className="px-2">{order.name}</td>
                  <td className="px-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full
                ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div> */}
      </div>
    </AdminRoute>
  );
}
