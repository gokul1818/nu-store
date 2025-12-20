import { useEffect, useState } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import AppTable from "../../components/AppTable";
import { CategoryAPI, ProductAPI } from "../../services/api";
import { buildProductQuery, formatCurrencyINR, safeParse } from "../../utils/helpers";
import { Pagination } from "../../components/Pagination";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  /** FILTER STATES */
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  /** BUILD QUERY STRING */
  const query = buildProductQuery({
    category: "",
    gender: "",
    size,
    color,
    minPrice,
    maxPrice,
    q: searchText,
    sort,
    page,
    limit: 10
  });

  /** LOAD DATA */
  const load = async () => {
    setLoading(true);
    try {
      const productRes = await ProductAPI.getAll(query);
      const categoryRes = await CategoryAPI.getAll();

      setCategoryList(categoryRes.data);
      setProducts(productRes.data); // contains { products, total, pages }
    } finally {
      setLoading(false);
    }
  };

  /** DELETE PRODUCT */
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

  /** INITIAL LOAD + RELOAD ON FILTER CHANGE */
  useEffect(() => {
    load();
  }, [size, color, minPrice, maxPrice, searchText, sort, page]);

  /** FIND CATEGORY NAME */
  const findCategory = (id) => categoryList.find((c) => c.id == id);

  /** TABLE COLUMNS */
  const columns = [
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (row) =>
        row.images?.length ? (
          <img
            src={safeParse(row.images)[0]}
            alt={row.title}
            className="w-12 h-12 object-cover rounded mx-auto"
          />
        ) : (
          "-"
        ),
    },
    { key: "title", label: "Title" },

    {
      key: "category",
      label: "Category",
      render: (row) => findCategory(row.category)?.name || "-",
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
        safeParse(row.variants).length
          ? safeParse(row.variants).reduce((acc, v) => acc + (v.stock || 0), 0)
          : 0,
    },
  ];

  /** ROW ACTIONS */
  const actions = [
    {
      icon: <FaEye className="w-4 h-4 text-primary" />,
      onClick: (row) => navigate(`/admin/products/view/${row.id}`),
      title: "View Product",
    },
    {
      icon: <TbEdit className="w-5 h-5 text-primary" />,
      onClick: (row) => navigate(`/admin/products/add/${row.id}`),
      title: "Edit Product",
    },
    {
      icon: <FaTrash className="w-4 h-4 text-primary" />,
      onClick: (row) => deleteProduct(row.id),
      title: "Delete Product",
    },
  ];

  /** PAGINATION FROM SERVER */
  const totalPages = products?.pages || 1;
  const tableData = products?.products || [];

  return (
    <div className="container mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>

        <Link
          to="/admin/products/add"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <AppTable
        columns={columns}
        data={tableData}
        actions={actions}
        loading={loading}
      />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          setCurrentPage={setPage}
        />
      )}
    </div>
  );
}
