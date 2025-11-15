import create from "zustand";
import api from "../services/api";

const initial = JSON.parse(localStorage.getItem("cart") || "[]");

const useCartStore = create((set, get) => ({
  items: initial,
  addItem: (product, qty = 1, selectedOptions = {}) => {
    set((state) => {
      const found = state.items.find((i) => i._id === product._id && JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions));
      let items;
      if (found) {
        items = state.items.map((i) =>
          i === found ? { ...i, qty: i.qty + qty } : i
        );
      } else {
        items = [...state.items, { ...product, qty, selectedOptions }];
      }
      localStorage.setItem("cart", JSON.stringify(items));
      return { items };
    });
  },
  removeItem: (id, options = {}) => {
    set((state) => {
      const items = state.items.filter((i) => !(i._id === id && JSON.stringify(i.selectedOptions) === JSON.stringify(options)));
      localStorage.setItem("cart", JSON.stringify(items));
      return { items };
    });
  },
  updateQty: (id, qty, options = {}) => {
    set((state) => {
      const items = state.items.map((i) => (i._id === id && JSON.stringify(i.selectedOptions) === JSON.stringify(options) ? { ...i, qty } : i));
      localStorage.setItem("cart", JSON.stringify(items));
      return { items };
    });
  },
  clear: () => {
    localStorage.removeItem("cart");
    set({ items: [] });
  },
  createOrder: async (orderPayload) => {
    // sample create order - backend should return created order
    const res = await api.post("/orders", orderPayload);
    // On success, clear cart
    set({ items: [] });
    localStorage.removeItem("cart");
    return res.data;
  },
}));

export default useCartStore;
