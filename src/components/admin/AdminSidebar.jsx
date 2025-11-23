import React from "react";
import {
  FaBoxOpen,
  FaImage,
  FaShoppingCart,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTags,
  FaUsers,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAdminStore from "../../stores/useAdminStore";
import Logo from "../../assets/logo1.png";
import nueLoot from "../../assets/nueLoot.png";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);

  const [expanded, setExpanded] = React.useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Banner", path: "/admin/banner", icon: <FaImage /> },
    { name: "Customers", path: "/admin/users", icon: <FaUsers /> },
    // {
    //   name: "Master Settings",
    //   path: "/admin/master-settings",
    //   icon: <TbSettingsCog />,
    // },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div
      className={`
        backdrop-blur-sm bg-black/50 border-gray-400 border-r-2 text-white
        fixed top-0 left-3 h-[95%] flex flex-col shadow-lg my-3
        transition-all duration-300 rounded-tr-xl rounded-xl z-50
        justify-center
        ${expanded ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex items-center justify-center p-4">
        {expanded ? (
          <img src={nueLoot} alt="nueLoot" className="h-16   w-auto object-cover" />
        ) : (
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
        )}
      </div>
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
