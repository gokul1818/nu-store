import { useEffect, useState } from "react";
import { ProductAPI } from "../../services/api";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await ProductAPI.getAll();
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    await ProductAPI.deleteOne(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link to="/admin/products/add" className="px-3 py-2 bg-primary text-white rounded">
          + Add Product
        </Link>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.title}</td>
              <td className="border p-2">₹{p.price}</td>
              <td className="border p-2">
                {p.variants.reduce((acc, v) => acc + v.stock, 0)}
              </td>
              <td className="border p-2">
                <Link
                  to={`/admin/products/edit/${p._id}`}
                  className="px-2 py-1 border rounded mr-2"
                >
                  Edit
                </Link>
                <button
                  className="px-2 py-1 border rounded text-red-600"
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
