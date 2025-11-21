import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAdminStore from "../../stores/useAdminStore";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);

  const [expanded, setExpanded] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Customers", path: "/admin/users", icon: <FaUsers /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div
      className={`
        backdrop-blur-sm bg-black/50 border-gray-400 border-r-2 text-white
        fixed top-0 left-0 h-screen flex flex-col shadow-lg
        transition-all duration-300 rounded-tr-xl rounded-br-xl
        justify-center
        ${expanded ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Header */}
      {/* {expanded && (
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
      )} */}

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4  mx-2 py-2 rounded transition-all 
              ${pathname === item.path ? "bg-white/20" : "hover:bg-white/10"}
              ${expanded ? "justify-start" : "justify-center"}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {expanded && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      {expanded && (
        <button
          onClick={handleLogout}
          className="mt-auto m-5 bg-secondary hover:bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
}
