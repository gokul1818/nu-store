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
import BannerForm from "./pages/admin/AddBanner";
import AddProduct from "./pages/admin/AddProducts";
import AdminLogin from "./pages/admin/AdminLogin";
import BannerList from "./pages/admin/BannerList";
import CategoryForm from "./pages/admin/CategoryForm";
import CategoryList from "./pages/admin/CategoryList";
import CustomerList from "./pages/admin/CustomerList";
import CustomerProfile from "./pages/admin/CustomerProfile";
import Dashboard from "./pages/admin/Dashboard";
import OrderDetails from "./pages/admin/OrderDetails";
import OrderList from "./pages/admin/OrderList";
import ProductDetailsAdmin from "./pages/admin/ProductDetails";
import ProductList from "./pages/admin/ProductList";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import ShippingPolicy from "./pages/ShippingPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Terms from "./pages/Terms";

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
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<Terms />} />

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

          {/* Products */}
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/add/:id" element={<AddProduct />} />
          <Route
            path="/admin/products/view/:id"
            element={<ProductDetailsAdmin />}
          />

          {/* Categories */}
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/add" element={<CategoryForm />} />
          <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />

          {/* Orders */}
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/details/:id" element={<OrderDetails />} />

          {/* Customers */}
          <Route path="/admin/users" element={<CustomerList />} />
          <Route path="/admin/users/:id" element={<CustomerProfile />} />

          {/* Banner */}
          <Route path="/admin/banner" element={<BannerList />} />
          <Route path="/admin/banner/add" element={<BannerForm />} />
          <Route path="/admin/banner/edit/:id" element={<BannerForm />} />

          {/* <Route path="/admin/master-settings" element={<MasterData />} /> */}
        </Route>
      </Routes>
    </>
  );
}
