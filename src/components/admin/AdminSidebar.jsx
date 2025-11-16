import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-black text-white min-h-screen p-6 space-y-6">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      <nav className="space-y-3">
        <Link to="/admin" className="block hover:text-gray-300">Dashboard</Link>
        <Link to="/admin/products" className="block hover:text-gray-300">Products</Link>
        <Link to="/admin/products/add" className="block hover:text-gray-300">Add Product</Link>
        <Link to="/admin/orders" className="block hover:text-gray-300">Orders</Link>
      </nav>
    </div>
  );
}
