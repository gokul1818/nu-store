import { useEffect, useState } from "react";
import { CategoryAPI } from "../../services/api";
import { Link } from "react-router-dom";
import AppTable from "../../components/AppTable";
import { FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { Pagination } from "../../components/Pagination"; // import your pagination

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const load = async () => {
    setLoading(true);
    try {
      const res = await CategoryAPI.getAll();
      const formatted = res.data.map((cat) => ({
        ...cat,
      }));
      setCategories(formatted);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;
    setLoading(true);
    try {
      await CategoryAPI.delete(id);
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
    { key: "name", label: "Category Name" },
    { key: "parent", label: "Gender" },
  ];

  // Actions
  const actions = [
    {
      icon: <TbEdit className="w-5 h-5 text-primary" />,
      onClick: (row) =>
        (window.location.href = `/admin/categories/edit/${row._id}`),
      title: "Edit Category",
      className: "hover:bg-blue-100",
    },
    {
      icon: <FaTrash className="w-4 h-4 text-primary" />,
      onClick: (row) => deleteCategory(row._id),
      title: "Delete Category",
      className: "hover:bg-red-100",
    },
  ];

  // Calculate paginated data
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <Link
          to="/admin/categories/add"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          + Add Category
        </Link>
      </div>

      <AppTable
        columns={columns}
        data={paginatedData}
        actions={actions}
        loading={loading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
