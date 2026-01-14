import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("token"),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    login(token) {
      this.token = token;
      localStorage.setItem("token", token);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    },

    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const { data } = await api.get("/auth/me");
        this.setUser(data);
      } catch (err) {
        console.error("fetchUser failed", err);
        this.logout();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete api.defaults.headers.common.Authorization;
    },
  },
});
