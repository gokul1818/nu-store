import create from "zustand";
import { OrderAPI } from "../services/api";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,

  createOrder: async (payload) => {
    const res = await OrderAPI.createOrder(payload);
    return res.data;
  },

  loadMyOrders: async () => {
    const res = await OrderAPI.getMyOrders();
    set({ orders: res.data });
  },
}));
