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
  forgotPassword: (data) => api.post("/api/auth/forgot", data),
  resetPassword: (data) => api.post(`/api/auth/reset`, data),
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
  addReview: (productId, reviewData) =>
    api.post(`/api/products/${productId}/review`, reviewData),
  getReview: (productId) => api.get(`/api/products/${productId}/review`),
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
  getMyOrders: (page = 1, limit = 10) =>
    api.get(`/api/orders?page=${page}&limit=${limit}`),
  cancelOrder: (id) => api.post(`/api/orders/${id}/cancel`),
};

/* -------------------------------------------------------
    ADMIN
--------------------------------------------------------- */
export const AdminAPI = {
  getUsers: ({ page = 1, limit = 10, q = "", status = "" } = {}) => {
    let query = `?page=${page}&limit=${limit}`;
    if (q) query += `&q=${encodeURIComponent(q)}`;
    if (status) query += `&status=${status}`;
    return api.get(`/api/admin/users${query}`);
  },
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  getDashboard: () => api.get(`/api/admin/dashboard`),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  getOrders: (page = 1, limit = 10, status) =>
    api.get(`/api/orders/all?status=${status}&page=${page}&limit=${limit}`),
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  blockUser: (user_id) => api.put(`/api/admin/users/${user_id}/block`),
  unblockUser: (user_id) => api.put(`/api/admin/users/${user_id}/unblock`),
};

export const CategoryAPI = {
  getAll: () => api.get("/api/categories"),
  getOne: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post("/api/categories", data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const UploadAPI = {
  thumbnail: (formData) =>
    api.post("/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const BannerAPI = {
  create: (formData) => api.post("/api/banner", formData),
  getAll: () => api.get("/api/banner"),
  getOne: (id) => api.get(`/api/banner/${id}`),
  delete: (id) => api.delete(`/api/banner/${id}`),
  update: (id, formData) => api.put(`/api/banner/${id}`, formData),
};

export default api;
