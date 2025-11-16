import { useEffect, useState } from "react";
import { AdminAPI } from "../../services/api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const statuses = ["Processing", "Packed", "Shipped", "Delivered"];

  const load = async () => {
    const res = await AdminAPI.getOrders();
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await AdminAPI.updateOrderStatus(id, { status });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Order #{o._id}</div>
                <div className="text-sm text-gray-600">{o.user.email}</div>
              </div>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o._id, e.target.value)}
                className="border p-2"
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mt-4 text-sm">
              {o.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.title}</span>
                  <span>Qty: {item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
