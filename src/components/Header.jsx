import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";
import { useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((s) => s.items);
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          NU<span className="text-black">Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <Link to="/products" className="hover:underline">
              Shop
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {/* Cart Icon - logged-in users only */}
          {user && (
            <button
              onClick={() => navigate("/cart")}
              className="relative p-1 rounded hover:bg-gray-100 transition-all duration-200"
            >
              <FiShoppingCart className="w-6 h-6 text-black hover:text-gray-700 transition-colors duration-200" />
              {cart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.length}
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
              <FiUser className="w-8 h-8 text-black hover:text-gray-700 transition-colors duration-200" />
            </button>

            {/* Animated Dropdown */}
            {user && showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg py-2 z-50 
                  origin-top-right transform transition-all duration-200 scale-95 opacity-0 animate-dropdown"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100 transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {user && (
              <Link to="/products" className="hover:underline">
                Shop
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
