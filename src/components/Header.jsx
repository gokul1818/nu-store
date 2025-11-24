import { useEffect, useRef, useState } from "react";
import {
  FiLogOut,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiInstagram,
  FiPhone,
} from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo1 from "../assets/logo1.png";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";

export default function Header() {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((s) => s.cart);
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  return (
    <header className="backdrop-blur-md bg-white/30 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          <img src={Logo1} alt="Logo" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex gap-6 font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors duration-200 ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition-colors duration-200 ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/men-loot"
            className={({ isActive }) =>
              `transition-colors duration-200 ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`
            }
          >
            Men Loot
          </NavLink>

          <NavLink
            to="/women-loot"
            className={({ isActive }) =>
              `transition-colors duration-200 ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`
            }
          >
            Women Loot
          </NavLink>
        </nav>
        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {/* Social Icons */}
          {/* <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <FiInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            <FiPhone className="w-6 h-6" />
          </a> */}

          {/* Cart Icon */}
          {user && (
            <button
              onClick={() => navigate("/cart")}
              className="relative p-1 rounded hover:bg-gray-100 transition-all duration-200"
            >
              <FiShoppingCart className="w-6 h-6 text-primary hover:text-gray-700 transition-colors duration-200" />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + (item.qty || 1), 0)}
                </span>
              )}
            </button>
          )}

          {/* User Icon */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={handleUserClick}
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            >
              <FiUser className="w-8 h-8 text-primary hover:text-gray-700 transition-colors duration-200" />
            </button>

            {user && showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiUser className="w-4 h-4" /> Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiShoppingBag className="w-4 h-4" /> Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
