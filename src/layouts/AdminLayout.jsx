import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 bg-gray-50 p-6">
        <Outlet /> 
      </div>
    </div>
  );
}
