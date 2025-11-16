import React from "react";
import { Routes, Route } from "react-router-dom";

import WebsiteLayout from "./layouts/WebsiteLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

// Website pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import AddProduct from "./pages/admin/AddProducts";
import OrderList from "./pages/admin/OrderList";
import AdminLogin from "./pages/admin/AdminLogin";
import EditProduct from "./pages/admin/EditProduct";
import CategoryList from "./pages/admin/CategoryList";
import CategoryForm from "./pages/admin/CategoryForm";

export default function App() {
  return (
    <Routes>

      {/* Website Layout */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin Login (no layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Layout */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin/" element={<Dashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/admin/categories" element={<CategoryList />} />
        <Route path="/admin/categories/add" element={<CategoryForm />} />
        <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />

        <Route path="/admin/orders" element={<OrderList />} />
      </Route>

    </Routes>
  );
}
