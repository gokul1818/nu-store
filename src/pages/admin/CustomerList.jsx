import { useEffect, useState, useRef } from "react";
import { FaEye, FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AppTable from "../../components/AppTable";
import { showError, showSuccess } from "../../components/AppToast";
import { Pagination } from "../../components/Pagination";
import { AdminAPI } from "../../services/api";

export default function CustomerList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  const [statusFilter, setStatusFilter] = useState("");

  // ---------------------------
  // Load users with search & filter
  // ---------------------------
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await AdminAPI.getUsers({
        page,
        q: searchQuery,
        status: statusFilter,
      });
      setCustomers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
      showError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage, searchQuery, statusFilter]);

  // ---------------------------
  // Handle search input
  // ---------------------------
  const handleSearch = (e) => {
    const value = e.target.value;
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500);
  };

  // ---------------------------
  // Delete user
  // ---------------------------
  const deleteCustomer = async (id) => {
    if (!confirm("Delete customer?")) return;
    setLoading(true);
    try {
      await AdminAPI.deleteUser(id);
      showSuccess("Customer deleted successfully!");
      loadUsers(currentPage);
    } catch (err) {
      console.error(err);
      showError("Failed to delete customer");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Block / Unblock user
  // ---------------------------
  const toggleBlock = async (row) => {
    setLoading(true);
    try {
      if (row.status === "Active") {
        await AdminAPI.blockUser(row._id);
        showSuccess("User InActive successfully!");
      } else {
        await AdminAPI.unblockUser(row._id);
        showSuccess("User unInActive successfully!");
      }
      loadUsers(currentPage);
    } catch (err) {
      console.error(err);
      showError("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Table columns
  // ---------------------------
  const columns = [
    { key: "uniqId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "totalOrders", label: "Total Orders" },
    {
      key: "lastOrder",
      label: "Last Order",
      render: (row) => {
        if (!row.lastOrder) return "—";
        const date = new Date(row.lastOrder);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
      },
    },
    { key: "status", label: "Status" },
  ];

  // ---------------------------
  // Table actions
  // ---------------------------
  const actions = [
    {
      icon: <FaEye className="w-4 h-4 text-primary" />,
      title: "View Profile",
      onClick: (row) => navigate(`/admin/users/${row._id}`),
      className: "hover:bg-blue-100",
    },
    // {
    //   icon: <FaTrash className="w-4 h-4 text-primary" />,
    //   title: "Delete",
    //   onClick: (row) => deleteCustomer(row._id),
    //   className: "hover:bg-red-100",
    // },
    {
      icon: (row) =>
        row.status === "Active" ? (
          <FaLock className="w-4 h-4 text-primary" />
        ) : (
          <FaLockOpen className="w-4 h-4 text-primary" />
        ),
      title: (row) => (row.status === "Active" ? "Block User" : "Unblock User"),
      onClick: (row) => toggleBlock(row),
      className: "hover:bg-gray-100",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6 space-x-4">
        <h2 className="text-2xl font-semibold">Customers</h2>

        <div className="gap-3">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="border p-2 rounded w-64"
            onChange={handleSearch}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded left-5"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
        </div>
      </div>

      <AppTable
        columns={columns}
        data={customers}
        actions={actions}
        loading={loading}
      />

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
