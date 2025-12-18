<template>
  <header class="header">
    <!-- NAV -->
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

    <!-- TOP BAR -->
    <div class="header-top">
      <button class="hamburger" :class="{ open: isOpen }" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- PROFILE DROPDOWN -->
      <div class="profile-wrapper">
        <button class="profile-btn" @click="toggleProfileMenu">
          Me
        </button>

        <ul v-if="isProfileOpen" class="profile-menu">
          <li>
            <router-link to="/profile" @click="closeProfileMenu">
              Profile
            </router-link>
          </li>
          <li>
            <button class="logout-link" @click="logout">
              Logout
            </button>
          </li>
        </ul>
      </div>
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
    const isProfileOpen = ref(false);

    const toggleMenu = () => (isOpen.value = !isOpen.value);
    const closeMenu = () => (isOpen.value = false);

    const toggleProfileMenu = () =>
      (isProfileOpen.value = !isProfileOpen.value);
    const closeProfileMenu = () => (isProfileOpen.value = false);

    function logout() {
      auth.logout();
      isProfileOpen.value = false;
      router.push("/");
    }

    return {
      isOpen,
      isProfileOpen,
      toggleMenu,
      closeMenu,
      toggleProfileMenu,
      closeProfileMenu,
      logout,
    };
  },
};
</script>

<style scoped>
/* =========================
   BASE (MOBILE FIRST)
========================= */

.header {
  position: relative;
  background-color: #333;
  color: white;
  padding: 10px 15px;
}

/* TOP BAR */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* HAMBURGER */
.hamburger {
  width: 30px;
  height: 22px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: 0.3s ease;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* NAV (MOBILE COLLAPSED) */
.nav-wrapper {
   position: absolute;
  top: 100%;
  left: 0;
  width: 100%;

  background-color: #333;

  max-height: 0;
  overflow: hidden;
  opacity: 0;

  transition: max-height 0.3s ease, opacity 0.3s ease;
  z-index: 50;
}

.nav-wrapper.open {
  max-height: 300px;
  opacity: 1;
}

.nav-list {
  list-style: none;
  padding: 10px 16px;
  margin: 0;
}

.nav-list li {
  margin: 12px 0;
}

.nav-list a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

/* PROFILE (MOBILE) */
.profile-wrapper {
  position: relative;
}

.profile-btn {
  background-color: #555;
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}

/* MOBILE DROPDOWN = FULL WIDTH */
.profile-menu {
  position: absolute;
  right: -14px;
  background-color: #444;
  margin-top: 10px;
  border-radius: 4px;
}

.profile-menu li {
  padding: 10px 14px;
}

.profile-menu a,
.logout-link {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
}

.profile-menu li:hover {
  background-color: #555;
}
/* =========================
   DESKTOP
========================= */
@media (min-width: 768px) {
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
  /* Hide hamburger */
  .hamburger {
    display: none;
  }

  /* NAV ALWAYS VISIBLE */
  .nav-wrapper {
    position: static;
    max-height: none;
    opacity: 1;
    background: none;
  }

  .nav-list {
    display: flex;
    gap: 20px;
    padding: 0;
    align-items: center;
  }

  .nav-list li {
    margin: 0;
  }

  /* PROFILE DROPDOWN (FLOATING) */
  .profile-menu {
    right: -15px;
    top: 28px;
    min-width: 160px;
    padding: 8px 0;
  }
}

</style>
