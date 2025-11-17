import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import AppTable from "../../components/AppTable";
import { ProductAPI } from "../../services/api";
import { formatCurrencyINR } from "../../utils/helpers";
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // <-- new

  const load = async () => {
    setLoading(true); // <-- start loader
    try {
      const res = await ProductAPI.getAll();
      setProducts(res.data);
    } finally {
      setLoading(false); // <-- stop loader
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    setLoading(true); // optional, show loader while deleting
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
    { key: "title", label: "Title" },
    { key: "price", label: "Price", render: (row) => `${formatCurrencyINR(row.price)}` },
    {
      key: "stock",
      label: "Stock",
      render: (row) => row.variants.reduce((acc, v) => acc + v.stock, 0),
    },
  ];

  const actions = [
    {
      icon: <TbEdit className="w-5 h-5 text-primary" />,
      onClick: (row) =>
        (window.location.href = `/admin/products/edit/${row._id}`),
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

      <AppTable columns={columns} data={products} actions={actions} loading={loading} />
    </div>
  );
}
