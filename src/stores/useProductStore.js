import create from "zustand";
import { ProductAPI } from "../services/api";

const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    const res = await ProductAPI.getAll();  // <— API CALL
    console.log('res: ', res);
    set({ products: res.data, loading: false });
  },

  fetchProductById: async (id) => {
    set({ loading: true });
    const res = await ProductAPI.getOne(id); // <— API CALL
    set({ selectedProduct: res.data, loading: false });
  },
}));

export default useProductStore;
