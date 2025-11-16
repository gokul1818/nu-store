import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAdminStore from "../../stores/useAdminStore";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Add Product", path: "/admin/products/add" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Orders", path: "/admin/orders" },
  ];

  const handleLogout = () => {
    logout(); // clear admin store
    navigate("/admin/login");
  };

  return (
    <div className="w-64 bg-black text-white min-h-screen flex flex-col p-6">
      {/* Header */}
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      {/* Menu Items */}
      <nav className="space-y-2 flex-1">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded 
              ${pathname === item.path ? "bg-gray-800" : "hover:bg-gray-700"}
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
