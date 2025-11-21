import create from "zustand";
import { ProductAPI } from "../services/api";
import { buildProductQuery } from "../utils/helpers";

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,

  // filters
  category: "",
  gender: "",
  size: "",
  color: "",
  minPrice: "",
  maxPrice: "",
  searchText: "",
  sort: "",
  page: 1,
  limit: 12,

  total: 0,
  pages: 1,

  // Update filter value
  setFilter: (key, value) => set({ [key]: value }),

  // Reset products before new search/filter
  resetProducts: () => set({ products: [], page: 1 }),

  // Fetch products
  fetchProducts: async (append = false) => {
    set({ loading: true });

    const {
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      searchText,
      sort,
      page,
      limit,
    } = get();

    const query = buildProductQuery({
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      q: searchText,
      sort,
      page,
      limit,
    });

    const res = await ProductAPI.getAll(query);

    set({
      products: append
        ? [...get().products, ...res.data.products]
        : res.data.products,
      total: res.data.total,
      pages: res.data.pages,
      loading: false,
    });
  },

  // Infinite scroll loader
  loadMoreProducts: async () => {
    const { page, pages } = get();

    if (page >= pages) return; // no more pages

    set({ page: page + 1 });
    await get().fetchProducts(true); // append results
  },

  // Fetch product by id
  fetchProductById: async (id) => {
    set({ loading: true });
    const res = await ProductAPI.getOne(id);
    set({ selectedProduct: res.data, loading: false });
  },
}));

export default useProductStore;
