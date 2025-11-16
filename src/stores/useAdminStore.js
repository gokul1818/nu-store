import create from "zustand";
import { AuthAPI } from "../services/api";

const useAdminStore = create((set) => ({
  admin: (() => {
    try {
      const stored = localStorage.getItem("admin");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  
  token: localStorage.getItem("admin_token") || null,
  loading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      const res = await AuthAPI.adminLogin({ email, password });

      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin", JSON.stringify(res.admin));

      set({
        admin: res.admin,
        token: res.token,
        loading: false,
      });

      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    set({ admin: null, token: null });
  },
}));

export default useAdminStore;
