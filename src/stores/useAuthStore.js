import create from "zustand";
import { AuthAPI } from "../services/api";

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  login: async (payload) => {
    set({ loading: true, error: null });

    try {
      const data = await AuthAPI.login(payload);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, loading: false });
      return data.user;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "Login failed" });
      throw err;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const data = await AuthAPI.register(payload);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, loading: false });
      return data.user;
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || "Registration failed" });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  getProfile: async () => {
    try {
      const res = await AuthAPI.getProfile();
      localStorage.setItem("user", JSON.stringify(res.data));
      set({ user: res.data });
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  updateProfile: async (payload) => {
    try {
      const updatedUser = await AuthAPI.updateProfile(payload);

      // Sync store and localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return updatedUser;
    } catch (err) {
      throw err;
    }
  },
}));

export default useAuthStore;
