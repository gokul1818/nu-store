import create from "zustand";
import { CartAPI } from "../services/api";

const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,

  loadCart: async () => {
    const res = await CartAPI.getCart();
    set({ cart: res.data.items });
  },

  // 👇 EXPECTED BY ProductCard
  addItem: async (product) => {
    // Create data payload for backend
    const payload = {
      productId: product._id,
      qty: 1,
      variant: product.variants?.[0] || {
        size: "M",
        color: "Default",
      }
    };

    const res = await CartAPI.addItem(payload);
    set({ cart: res.data.items });
  },

  updateQty: async (payload) => {
    const res = await CartAPI.updateQty(payload);
    set({ cart: res.data.items });
  },

  removeItem: async (payload) => {
    const res = await CartAPI.removeItem(payload);
    set({ cart: res.data.items });
  }
}));

export default useCartStore;
