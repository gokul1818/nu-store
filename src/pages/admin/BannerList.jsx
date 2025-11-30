import { useEffect, useState } from "react";
import { BannerAPI } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import AppTable from "../../components/AppTable";
import { FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await BannerAPI.getAll();
      setBanners(res.data);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete banner?")) return;
    setLoading(true);
    try {
      await BannerAPI.delete(id);
      await load();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Table columns
  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (row) => (
        <img
          src={row.imageUrl}
          className="w-32 h-16 object-cover rounded"
          alt={row.title}
        />
      ),
    },
    { key: "title", label: "Title" },
    { key: "link", label: "Link" },
  ];

  // Actions
  const actions = [
    {
      icon: <TbEdit className="w-5 h-5 text-primary" />,
      onClick: (row) => navigate(`/admin/banner/edit/${row.id}`),
      title: "Edit Banner",
      className: "hover:bg-blue-100",
    },
    {
      icon: <FaTrash className="w-4 h-4 text-red-600" />,
      onClick: (row) => remove(row.id),
      title: "Delete Banner",
      className: "hover:bg-red-100",
    },
  ];

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

      <AppTable columns={columns} data={banners} actions={actions} loading={loading} />
    </div>
  );
}
