import { useEffect, useState } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import AppTable from "../../components/AppTable";
import { Pagination } from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminAPI } from "../../services/api";

export default function CustomerList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // LOAD USERS FROM API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.getUsers(currentPage);
      setCustomers(res.data.users);
      setTotalPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  // DELETE USER
  const deleteCustomer = async (id) => {
    if (!confirm("Delete customer?")) return;

    setLoading(true);
    try {
      await AdminAPI.deleteUser(id);
      loadUsers();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoading(false);
    }
  };

  // TABLE COLUMNS (matching backend!)
  const columns = [
    { key: "uniqId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "totalOrders", label: "Total Orders" },
    { key: "lastOrder", label: "Last Order" },
    { key: "status", label: "Status" },
  ];

  const actions = [
    {
      icon: <FaEye className="w-4 h-4 text-primary" />,
      title: "View Profile",
      onClick: (row) => navigate(`/admin/users/${row._id}`),
      className: "hover:bg-blue-100",
    },
    {
      icon: <FaTrash className="w-4 h-4 text-primary" />,
      title: "Delete",
      onClick: (row) => deleteCustomer(row._id),
      className: "hover:bg-red-100",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
      </div>

      {/* Table */}
      <AppTable
        columns={columns}
        data={customers}
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
