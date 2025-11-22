import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";
import { useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiUser, FiShoppingBag, FiLogOut } from "react-icons/fi";

export default function Header() {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((s) => s.cart); // ✅ corrected from s.items to s.cart
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
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
    <header className="  backdrop-blur-md bg-white/30  shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          NU<span className="text-primary">Store</span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {/* Cart Icon - logged-in users only */}
          {user && (
            <button
              onClick={() => navigate("/cart")}
              className="relative p-1 rounded hover:bg-gray-100 transition-all duration-200"
            >
              <FiShoppingCart className="w-6 h-6 text-primary hover:text-gray-700 transition-colors duration-200" />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + (item.qty || 1), 0)} 
                  {/* ✅ sum of quantities, not just length */}
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

            {/* Dropdown Menu */}
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
