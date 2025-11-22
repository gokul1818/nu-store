import create from "zustand";
import { ProductAPI } from "../services/api";
import { buildProductQuery } from "../utils/helpers";

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,

  // Filters
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

  // Update a filter
  setFilter: (key, value) => set({ [key]: value }),

  // Reset only filters
  resetFilters: () =>
    set({
      category: "",
      gender: "",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      searchText: "",
      sort: "",
      page: 1,
    }),

  // Reset product list when filters/search change
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

  // Infinite scroll
  loadMoreProducts: async () => {
    const { page, pages } = get();
    if (page >= pages) return;
    set({ page: page + 1 });
    await get().fetchProducts(true);
  },

  // Fetch product by ID
  fetchProductById: async (id) => {
    set({ loading: true });
    const res = await ProductAPI.getOne(id);
    set({ selectedProduct: res.data, loading: false });
  },
}));

export default useProductStore;
