import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(80); // default collapsed width (px)

  // Listen to sidebar expansion changes using a custom event (or state lifting)
  useEffect(() => {
    const handleSidebarWidthChange = (e) => {
      setSidebarWidth(e.detail);
    };
    window.addEventListener("sidebarWidthChange", handleSidebarWidthChange);
    return () => window.removeEventListener("sidebarWidthChange", handleSidebarWidthChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Content area with dynamic left margin */}
      <div
        className="transition-all duration-300 p-6"
        style={{ marginLeft: sidebarWidth }}
      >
        <Outlet />
      </div>
    </div>
  );
}
