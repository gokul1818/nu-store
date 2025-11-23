import create from "zustand";
import { OrderAPI } from "../services/api";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  page: 1,
  totalPages: 1,
  loading: false,

  createOrder: async (payload) => {
    const res = await OrderAPI.createOrder(payload);
    return res.data;
  },

  loadMyOrders: async (page = 1, limit = 10) => {
    set({ loading: true });
    const res = await OrderAPI.getMyOrders(page, limit);

    set({
      orders: res.data.orders,
      page: res.data.page,
      totalPages: res.data.totalPages,
      loading: false,
    });
  },
}));
