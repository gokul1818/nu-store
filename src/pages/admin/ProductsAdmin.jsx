import AdminRoute from "../../components/AdminRoute";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data)).catch(console.error);
  }, []);

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Products Management</h2>
        <div className="bg-white p-4 rounded">
          <table className="w-full">
            <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.stock || "-"}</td>
                  <td>
                    <button className="px-2 py-1 border rounded mr-2">Edit</button>
                    <button className="px-2 py-1 border rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminRoute>
  );
}
