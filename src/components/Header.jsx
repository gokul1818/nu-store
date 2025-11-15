import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import useCartStore from "../stores/useCartStore";

export default function Header() {
  const { user, logout } = useAuthStore();
  const cart = useCartStore((s) => s.items);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold">NU<span className="text-black">Store</span></Link>
          <nav className="hidden md:flex gap-4">
            <Link to="/products" className="hover:underline">Shop</Link>
            <Link to="/orders" className="hover:underline">Orders</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/cart")} className="relative">
            Cart
            <span className="ml-2 inline-block bg-black text-white text-xs px-2 py-0.5 rounded-full">{cart?.length}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">{user.firstName || user.name}</span>
              {user.role === "admin" && (
                <Link to="/admin" className="text-sm border px-2 py-1 rounded">Admin</Link>
              )}
              <button
                onClick={() => { logout(); }}
                className="text-sm px-2 py-1 rounded border"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm px-3 py-1 border rounded">Login</Link>
              <Link to="/register" className="text-sm px-3 py-1 bg-black text-white rounded">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
