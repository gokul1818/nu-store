import { Route, Routes } from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import WebsiteLayout from "./layouts/WebsiteLayout";

// Website pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

// Admin pages
import { Toaster } from "react-hot-toast";
import AddProduct from "./pages/admin/AddProducts";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import EditProduct from "./pages/admin/EditProduct";
import OrderList from "./pages/admin/OrderList";
import ProductList from "./pages/admin/ProductList";

export default function App() {
  return (
    <>
      {/* Toasts must be outside <Routes> */}
      <Toaster position="top-right" />

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
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin/" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />

          <Route path="/admin/orders" element={<OrderList />} />
        </Route>
      </Routes>
    </>
  );
}
