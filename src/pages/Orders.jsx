import { useEffect, useState } from "react";
import api from "../services/api";
import useAuthStore from "../stores/useAuthStore";
import ProtectedRoute from "../components/ProtectedRoute";

function OrdersList() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/orders/my"); // backend: GET /orders/my
      setOrders(res.data);
    }
    load();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="bg-white p-4 rounded mb-3">
          <div className="flex justify-between">
            <div>Order #{o._id}</div>
            <div>{o.status}</div>
          </div>
          <div className="mt-2">Items: {o.items.length}</div>
        </div>
      ))}
    </div>
  );
}

export default function Orders() { return <ProtectedRoute><OrdersList /></ProtectedRoute>; }
