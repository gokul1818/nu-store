import create from "zustand";
import { AuthAPI } from "../services/api";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  login: async (payload) => {
    set({ loading: true, error: null });

    try {
      const data = await AuthAPI.login(payload); // <— API CALL
      set({ user: data.user, token: data.token, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message });
      throw err;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const data = await AuthAPI.register(payload); // <— API CALL
      set({ user: data.user, token: data.token, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  getProfile: async () => {
    const res = await AuthAPI.getProfile(); // <— API CALL
    set({ user: res.data });
  },
}));

export default useAuthStore;
