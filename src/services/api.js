import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5001",
  headers: { "Content-Type": "application/json" }
});

/* -------------------------------------------------------
    AUTOMATIC TOKEN HANDLING
--------------------------------------------------------- */

api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");

  if (config.url.includes("/api/admin")) {
    if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

/* -------------------------------------------------------
    AUTH
--------------------------------------------------------- */
export const AuthAPI = {
  register: (data) => api.post("/api/auth/register", data),

  login: async (data) => {
    const res = await api.post("/api/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  adminLogin: async (data) => {
    const res = await api.post("/api/auth/admin/login", data);
    if (res.data.token) {
      localStorage.setItem("admin_token", res.data.token);
    }
    return res.data;
  },

  getProfile: () => api.get("/api/auth/me"),
};

/* -------------------------------------------------------
    PRODUCTS
--------------------------------------------------------- */
export const ProductAPI = {
  getAll: (query = "") => api.get(`/api/products${query ? `?${query}` : ""}`),
  getOne: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post("/api/products", data),
};

/* -------------------------------------------------------
    CART
--------------------------------------------------------- */
export const CartAPI = {
  addItem: (data) => api.post("/api/cart/add", data),
  getCart: () => api.get("/api/cart"),
  updateQty: (data) => api.post("/api/cart/update", data),
  removeItem: (data) => api.post("/api/cart/remove", data),
};

/* -------------------------------------------------------
    ORDERS
--------------------------------------------------------- */
export const OrderAPI = {
  createOrder: (data) => api.post("/api/orders", data),
  getMyOrders: () => api.get("/api/orders/my"),
  cancelOrder: (id) => api.post(`/api/orders/${id}/cancel`),
};

/* -------------------------------------------------------
    ADMIN
--------------------------------------------------------- */
export const AdminAPI = {
  getUsers: () => api.get("/api/admin/users"),
  getOrders: () => api.get("/api/admin/orders"),
  updateOrderStatus: (id, data) => api.put(`/api/admin/orders/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
};

export default api;
