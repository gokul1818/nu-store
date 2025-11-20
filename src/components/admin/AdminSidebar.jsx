import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAdminStore from "../../stores/useAdminStore";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);

  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`bg-primary text-white fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 shadow-lg
        ${expanded ? "w-64" : "w-20"}
      `}
    >
      {/* Toggle button (only shown when collapsed) */}
      {!expanded && (
        <button
          className="text-white text-lg m-4 p-1 hover:bg-gray-700 rounded self-start"
          onClick={() => setExpanded(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Header (shown when expanded) */}
      {expanded && (
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setExpanded(false)} // <-- Close menu on click
            className={`flex items-center px-4 py-2 rounded transition
                ${pathname === item.path ? "bg-gray-800" : "hover:bg-gray-700"}
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
