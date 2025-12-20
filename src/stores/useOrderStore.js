import create from "zustand";
import { OrderAPI } from "../services/api";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  page: 1,
  totalPages: 1,

  // =========================================
  // CREATE ORDER (RETURNS RAZORPAY DATA)
  // =========================================
  createOrder: async (payload) => {
    try {
      set({ loading: true });
      const res = await OrderAPI.createOrder(payload);
      return res.data; // { orderId, razorpayOrder, key }
    } finally {
      set({ loading: false });
    }
  },

  // =========================================
  // VERIFY PAYMENT
  // =========================================
  verifyPayment: async (payload) => {
    try {
      set({ loading: true });
      const res = await OrderAPI.verifyPayment(payload);
      return res.data;
    } finally {
      set({ loading: false });
    }
  },

  // =========================================
  // LOAD USER ORDERS (PAGINATION)
  // =========================================
  loadMyOrders: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await OrderAPI.getMyOrders(page, limit);

      set({
        orders: res.data.orders,
        page: res.data.page,
        totalPages: res.data.totalPages,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
