import { useEffect, useState } from "react";
import { AiOutlineInbox } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { ProductAPI } from "../../services/api";

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link
          to="/admin/products/add"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-300 py-5">
            <tr>
              <th className="border p-4 text-left">Title</th>
              <th className="border p-4 text-left">Price</th>
              <th className="border p-4 text-left">Stock</th>
              <th className="border p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border p-4 text-center text-gray-500 flex flex-col items-center gap-2"
                >
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="border p-2">{p.title}</td>
                  <td className="border p-2">₹{p.price}</td>
                  <td className="border p-2">
                    {p.variants.reduce((acc, v) => acc + v.stock, 0)}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <Link
                      to={`/admin/products/edit/${p._id}`}
                      className="p-1 rounded hover:bg-blue-100 transition"
                      title="Edit Product"
                    >
                      <TbEdit className="w-5 h-5 text-primary" />
                    </Link>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="p-1 rounded hover:bg-red-100 transition"
                      title="Delete Product"
                    >
                      <FaTrash className="w-4 h-4 text-primary" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
