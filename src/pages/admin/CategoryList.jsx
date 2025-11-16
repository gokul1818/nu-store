import { useEffect, useState } from "react";
import { CategoryAPI } from "../../services/api";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  const load = async () => {
    const res = await CategoryAPI.getAll();
    console.log('res: ', res);
    setCategories(res.data);
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;
    await CategoryAPI.delete(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Link
          to="/admin/categories/add"
          className="px-3 py-2 bg-black text-white rounded"
        >
          + Add Category
        </Link>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Category Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">
                <Link
                  to={`/admin/categories/edit/${c._id}`}
                  className="px-2 py-1 border rounded mr-2"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteCategory(c._id)}
                  className="px-2 py-1 border rounded text-red-600"
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
