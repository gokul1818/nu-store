import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import AppTable from "../../components/AppTable";
import { ProductAPI } from "../../services/api";
import { formatCurrencyINR } from "../../utils/helpers";
import { Pagination } from "../../components/Pagination"; // import pagination

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // pagination state
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await ProductAPI.getAll();
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    setLoading(true);
    try {
      await ProductAPI.deleteOne(id);
      await load();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (row) =>
        row.thumbnail ? (
          <img
            src={row.thumbnail}
            alt={row.title}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          "-"
        ),
    },
    { key: "title", label: "Title" },
    {
      key: "category",
      label: "Category",
      render: (row) => row.category?.name || "-",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => formatCurrencyINR(row.price),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row) =>
        row.variants?.length
          ? row.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
          : 0,
    },
  ];

  const actions = [
    {
      icon: <TbEdit className="w-5 h-5 text-primary" />,
      onClick: (row) => navigate(`/admin/products/add/${row._id}`),
      title: "Edit Product",
      className: "hover:bg-blue-100",
    },
    {
      icon: <FaTrash className="w-4 h-4 text-primary" />,
      onClick: (row) => deleteProduct(row._id),
      title: "Delete Product",
      className: "hover:bg-red-100",
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedData = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
