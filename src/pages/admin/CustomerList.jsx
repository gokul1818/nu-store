import { useEffect, useState } from "react";
import { FaTrash, FaEye } from "react-icons/fa";
import AppTable from "../../components/AppTable";
import { useNavigate } from "react-router-dom";

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy data
  const dummyData = [
    {
      id: "U1001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 9876543210",
      totalOrders: 5,
      lastOrder: "2025-11-15",
      status: "Active",
    },
    {
      id: "U1002",
      name: "Sarah Parker",
      email: "sarah@example.com",
      phone: "+91 9876543211",
      totalOrders: 2,
      lastOrder: "2025-11-10",
      status: "Inactive",
    },
    {
      id: "U1003",
      name: "Alex Lee",
      email: "alex@example.com",
      phone: "+91 9876543212",
      totalOrders: 8,
      lastOrder: "2025-11-18",
      status: "Active",
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCustomers(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  const deleteCustomer = (id) => {
    if (!confirm("Delete customer?")) return;
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const columns = [
    { key: "id", label: "User ID" },
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
      onClick: (row) => navigate(`/admin/users/${row.id}`),
      className: "hover:bg-blue-100",
    },
    {
      icon: <FaTrash className="w-4 h-4 text-primary" />,
      title: "Delete",
      onClick: (row) => deleteCustomer(row.id),
      className: "hover:bg-red-100",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
      </div>

      <AppTable columns={columns} data={customers} actions={actions} loading={loading} />
    </div>
  );
}
