import create from "zustand";
import { CartAPI } from "../services/api";

const useCartStore = create((set) => ({
  cart: [],
  loading: false,

  loadCart: async () => {
    const res = await CartAPI.getCart(); // <— API CALL
    set({ cart: res.data.items });
  },

  addToCart: async (data) => {
    const res = await CartAPI.addItem(data); // <— API CALL
    set({ cart: res.data.items });
  },

  updateQty: async (data) => {
    const res = await CartAPI.updateQty(data); // <— API CALL
    set({ cart: res.data.items });
  },

  removeItem: async (data) => {
    const res = await CartAPI.removeItem(data); // <— API CALL
    set({ cart: res.data.items });
  },
}));

export default useCartStore;
