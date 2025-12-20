import { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiShoppingCart,
  FiLogOut,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiInstagram,
  FiFacebook,
  FiPhone,
} from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import Logo1 from "../assets/logo1.png";
import Logo2 from "../assets/nueLoot.png";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";

export default function Header() {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((s) => s.cart);
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef();

  const searchParams = new URLSearchParams(location.search);
  const genderQuery = searchParams.get("gender") || "";

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
    if (!user) navigate("/login");
    else setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="backdrop-blur-md bg-white/30 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo + Brand Name */}
        <Link to="/" className="flex items-center ">
          <img src={Logo1} alt="Logo" className="h-12 w-auto" />
          <img src={Logo2} alt="Logo2" className="h-12 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-700">
          <NavLink
            to="/"
            end
            className={({ is_active }) =>
              `transition-colors duration-200 ${is_active
                ? "text-orange-500 border-b-2 border-orange-500"
                : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            end
            className={({ is_active }) =>
              `transition-colors duration-200 ${is_active
                ? "text-orange-500 border-b-2 border-orange-500"
                : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`
            }
          >
            About Us
          </NavLink>

          <NavLink
            to="/products?gender=gender_men"
            className={`transition-colors duration-200 ${genderQuery === "men"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`}
          >
            Men Loot
          </NavLink>

          <NavLink
            to="/products?gender=gender_women"
            className={`transition-colors duration-200 ${genderQuery === "women"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
              }`}
          >
            Women Loot
          </NavLink>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          <nav className="hidden lg:flex gap-6 font-medium text-gray-700">

            {/* Social Icons */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              <FiInstagram className="w-6 h-6" />
            </a>

            <a
              href="https://youtube.com/@nueloot_official?si=YX71-yedaiPTOv1X"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              <FaYoutube className="w-6 h-6" />
            </a>

            <a
              href="https://www.facebook.com/share/1MuwbgQbEn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              <FiFacebook className="w-6 h-6" />
            </a>

            {/* Contact Us */}
            <Link
              to="/contact"
              className="flex items-center gap-1 px-3 py-1 rounded-md border border-orange-400 text-v font-medium hover:bg-orange-100 transition"
            >
              <FiPhone />
              Contact Us
            </Link>
          </nav>
          {/* Cart */}
          {/* {user && ( */}
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
          {/* )} */}

          {/* User Menu */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={handleUserClick}
              className="p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <FiUser className="w-8 h-8 text-primary hover:text-gray-700 transition-colors duration-200" />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded hover:bg-gray-100 transition"
            >
              {showMobileMenu ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>

            {/* User Dropdown */}
            {user && showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiUser className="w-4 h-4" /> Profile
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiShoppingBag className="w-4 h-4" /> Orders
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-lg border-t">

          {/* Social Icons Mobile */}
          <div className="flex gap-6 px-6 py-3 border-b text-gray-700">
            <a
              href="https://www.instagram.com/nueloot_official"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiInstagram className="w-6 h-6" />
            </a>

            <a
              href="https://youtube.com/@nueloot_official?si=YX71-yedaiPTOv1X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="w-6 h-6" />
            </a>

            <a
              href="https://www.facebook.com/share/1MuwbgQbEn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiFacebook className="w-6 h-6" />
            </a>

            <Link to="/contact" className="ml-auto text-orange-600 font-medium">
              Contact Us
            </Link>
          </div>

          {/* Navigation Items */}
          <NavLink
            to="/"
            end
            onClick={() => setShowMobileMenu(false)}
            className="block px-6 py-3 border-b hover:bg-gray-100"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            end
            onClick={() => setShowMobileMenu(false)}
            className="block px-6 py-3 border-b hover:bg-gray-100"
          >
            About Us
          </NavLink>

          <NavLink
            to="/products?gender=gender_men"
            onClick={() => setShowMobileMenu(false)}
            className="block px-6 py-3 border-b hover:bg-gray-100"
          >
            Men Loot
          </NavLink>

          <NavLink
            to="/products?gender=gender_women"
            onClick={() => setShowMobileMenu(false)}
            className="block px-6 py-3 border-b hover:bg-gray-100"
          >
            Women Loot
          </NavLink>
        </div>
      )}
    </header>
  );
}
