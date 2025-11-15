import create from "zustand";
import api from "../services/api";

const useProductStore = create((set) => ({
  items: [],
  selected: null,
  loading: false,
  error: null,

  fetchProducts: async (query = "") => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/products${query ? `?${query}` : ""}`);
      set({ items: res.data, loading: false });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/products/${id}`);
      set({ selected: res.data, loading: false });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
    }
  },
}));
export default useProductStore;
