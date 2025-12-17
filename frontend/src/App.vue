<template>
  <Header v-if="auth.isLoggedIn" />
  <main>
    <router-view />
  </main>
  <Footer v-if="auth.isLoggedIn" />
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { useAuthStore } from "@/store/auth";

export default {
  components: { Header, Footer },

  setup() {
    const auth = useAuthStore();
    if(auth.token){
      auth.fetchUser();
    }
    return { auth };
  },
};
</script>
