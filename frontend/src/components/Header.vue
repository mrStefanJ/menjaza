<template>
  <header class="header">
    <nav class="nav-wrapper" :class="{ open: isOpen }">
      <ul class="nav-list">
        <li><router-link to="/home" @click="closeMenu">Home</router-link></li>
        <li><router-link to="/albums" @click="closeMenu">Albums</router-link></li>
        <li><router-link to="/message" @click="closeMenu">Message</router-link></li>
        <li><router-link to="/exchange" @click="closeMenu">Exchange</router-link></li>
        <li><router-link to="/help" @click="closeMenu">Help</router-link></li>
        <li><router-link to="/contact" @click="closeMenu">Contact</router-link></li>
      </ul>
    </nav>
    <div class="header-top">
      <button class="hamburger" :class="{ open: isOpen }" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </div>
  </header>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const auth = useAuthStore();
    const router = useRouter();
    const isOpen = ref(false);

    const toggleMenu = () => (isOpen.value = !isOpen.value);
    const closeMenu = () => (isOpen.value = false);

    function logout() {
      auth.logout();
      router.push("/");
    }

    return { logout, isOpen, toggleMenu, closeMenu };
  },
};
</script>

<style scoped>
/* MOBILE FIRST */
.header {
  background-color: #333;
  color: white;
  padding: 10px 15px;
}

/* Top bar */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Hamburger button */
.hamburger {
  width: 30px;
  height: 22px;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: 0.3s ease;
}

/* Animation: Hamburger → X */
.hamburger.open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Logout */
.logout-btn {
  background-color: #555;
  border: none;
  color: white;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 4px;
}

/* NAVIGATION WRAPPER (for animation) */
.nav-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, opacity 0.35s ease;
  opacity: 0;
}

.nav-wrapper.open {
  max-height: 300px;
  opacity: 1;
}

/* NAV LIST */
.nav-list {
  list-style: none;
  padding: 10px 0;
  margin: 0;
}

.nav-list li {
  margin: 12px 0;
}

.nav-list li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

/* Active link */
.nav-list li a.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

/* DESKTOP VERSION */
@media (min-width: 768px) {
  .hamburger {
    display: none;
  }

  .nav-wrapper {
    max-height: none;
    opacity: 1;
  }

  .nav-list {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 0;
  }

  .nav-list li {
    margin: 0;
  }
}
</style>
