import AdminRoute from "../../components/AdminRoute";
export default function Dashboard() {
  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">Sales</div>
          <div className="bg-white p-4 rounded shadow">Orders</div>
          <div className="bg-white p-4 rounded shadow">Users</div>
        </div>
      </div>
    </AdminRoute>
  );
}
