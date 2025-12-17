<template>
  <div class="auth">
    <h2>Login</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
    <RouterLink to="/register">Register</RouterLink>
    <p>{{ message }}</p>
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
      message: ""
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
          password: this.password
        });
        this.auth.login(res.data.token);
        await this.auth.fetchUser(); // odmah fetch user
        this.$router.push("/home");
      } catch (err) {
        this.message = err.response?.data?.message || "Invalid credentials";
      }
    }
  }
};
</script>
