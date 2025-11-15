import create from "zustand";
import api from "../services/api";

const initialUser = JSON.parse(localStorage.getItem("user") || "null");
const initialToken = localStorage.getItem("token") || null;

const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: initialToken,
  loading: false,
  error: null,

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", payload);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, loading: false });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
      throw err;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token, loading: false });
    } catch (err) {
      set({ loading: false, error: err?.response?.data?.message || err.message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  refreshUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.warn("refreshUser failed", err);
    }
  },
}));

export default useAuthStore;
