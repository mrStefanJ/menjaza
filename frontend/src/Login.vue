<template>
  <div class="auth">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" />
      <div class="input-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          type="password"
          placeholder="Password"
        />
        <span class="icon" @click="showPassword = !showPassword">
          <svg v-if="showPassword" width="22" height="22" viewBox="0 0 24 24">
            <path
              fill="#555"
              d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"
            ></path>
          </svg>

          <svg v-else width="22" height="22" viewBox="0 0 24 24">
            <path
              fill="#555"
              d="M1 4.27L2.28 3 21 21.72 19.73 23l-3.12-3.12C14.93 20.27 13.5 21 12 21c-7 0-11-7-11-7 1.23-2.15 3.07-4.43 5.61-5.97L1 4.27zM12 7c.62 0 1.21.12 1.77.33l-1.77 1.77A3 3 0 009 12c0 .62.18 1.2.48 1.7l-1.5 1.5C6.76 13.66 6 12 6 12s2-4 6-4zm10 5s-1.45 2.59-4.11 4.7l-1.47-1.47C17.92 14.5 19 12 19 12s-2-4-7-4c-.8 0-1.55.1-2.25.29l-1.6-1.6C9.75 6.26 10.86 6 12 6c7 0 10 6 10 6z"
            ></path>
          </svg>
        </span>
      </div>
      <button type="submit">Login</button>
    </form>
    <p>If you don't have account, go to <router-link to="/register">Register</router-link> page</p>
    <p class="msg">{{ message }}</p>
  </div>
</template>

<script>
import { api } from "./services/api";
import { useAuthStore } from "./store/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
      showPassword: false,
    };
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  methods: {
    async login() {
      try {
        const res = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        this.auth.login(res.data.token);

        await this.auth.fetchUser();

        localStorage.setItem("user", JSON.stringify(this.auth.user));

        this.$router.push("/home");
      } catch (err) {
        this.message = err.response?.data?.message || "Invalid credentials";
      }
    },
  },
};
</script>
