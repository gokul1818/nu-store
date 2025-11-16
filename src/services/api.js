import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------------
    AUTOMATIC TOKEN HANDLING
--------------------------------------------------------- */

api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("admin_token");

  config.headers.Authorization = `Bearer ${adminToken || userToken}`;

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
    const res = await api.post("/api/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("admin_token", res.data.token);
    }
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/api/auth/me");
    return res.data;
  },
  updateProfile: async (payload) => {
    const res = await api.put("/api/auth/me", payload);
    return res.data;
  },
};

/* -------------------------------------------------------
    PRODUCTS
--------------------------------------------------------- */
export const ProductAPI = {
  getAll: (query = "") => api.get(`/api/products${query ? `?${query}` : ""}`),
  getOne: (id) => api.get(`/api/products/${id}`),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteOne: (id) => api.delete(`/api/products/${id}`),
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
  getMyOrders: () => api.get("/api/orders"),
  cancelOrder: (id) => api.post(`/api/orders/${id}/cancel`),
};

/* -------------------------------------------------------
    ADMIN
--------------------------------------------------------- */
export const AdminAPI = {
  getUsers: () => api.get("/api/admin/users"),
  getOrders: () => api.get("/api/orders/all"),
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
};

export default api;
