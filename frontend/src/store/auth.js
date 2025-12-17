import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token // ili !!state.token ako hoćeš
  },
  actions: {
    login(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const res = await api.get("/auth/me");
        this.user = res.data;
      } catch (err) {
        console.error(err);
        this.logout();
      }
    }
  }
});
