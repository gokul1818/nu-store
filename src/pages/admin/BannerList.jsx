import { useEffect, useState } from "react";
import { BannerAPI } from "../../services/api";
import { Link } from "react-router-dom";

export default function BannerList() {
  const [banners, setBanners] = useState([]);

  const load = async () => {
    const res = await BannerAPI.getAll();
    setBanners(res.data);
  };

  const remove = async (id) => {
    if (!confirm("Delete banner?")) return;
    await BannerAPI.delete(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Banners</h2>
        <Link
          to="/admin/banner/add"
          className="px-3 py-2 bg-black text-white rounded"
        >
          + Add Banner
        </Link>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Link</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {banners.map((b) => (
            <tr key={b._id}>
              <td className="border p-2">
                <img
                  src={b.imageUrl}
                  className="w-32 h-16 object-cover rounded"
                />
              </td>
              <td className="border p-2">{b.title}</td>
              <td className="border p-2">{b.link}</td>

              <td className="border p-2 space-x-2">
                <Link
                  to={`/admin/banner/edit/${b._id}`}
                  className="px-2 py-1 border rounded"
                >
                  Edit
                </Link>

                <button
                  className="px-2 py-1 border rounded text-red-600"
                  onClick={() => remove(b._id)}
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
