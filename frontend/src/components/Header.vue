<template>
  <header class="header">
    <nav class="nav-wrapper" :class="{ open: isOpen }">
      <ul class="nav-list">
        <li><router-link to="/home" @click="closeMenu">Home</router-link></li>
        <li>
          <router-link to="/albums" @click="closeMenu">Albums</router-link>
        </li>
        <li>
          <router-link to="/exchange" @click="closeMenu">Exchange</router-link>
        </li>
        <li>
          <router-link to="/collections" @click="closeMenu"
            >Collections</router-link
          >
        </li>
        <li v-if="isAdmin">
          <router-link to="/users" @click="closeMenu">Users</router-link>
        </li>
        <li>
          <router-link to="/contact" @click="closeMenu">Contact</router-link>
        </li>
      </ul>
    </nav>

    <div class="header-top">
      <!-- Hamburger -->
      <button class="hamburger" :class="{ open: isOpen }" @click="toggleMenu">
        <span></span><span></span><span></span>
      </button>

      <!-- Profile -->
      <div class="profile-wrapper">
        <button class="profile-btn" @click="toggleProfileMenu">
          <ProfileImagePicker :image-url="profileImageUrl" :readonly="true" class="avatar avatar--profile" />
        </button>

        <ul v-if="isProfileOpen" class="profile-menu">
          <li>
            <router-link to="/profile" @click="closeProfileMenu"
              >Profile</router-link
            >
          </li>
          <li>
            <button class="logout-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import ProfileImagePicker from "@/components/ProfileImagePicker.vue";

export default {
  components: {
    ProfileImagePicker,
  },
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    const isOpen = ref(false);
    const isProfileOpen = ref(false);

    const user = computed(() => auth.user);

    // Uvek default fallback, čak i pre nego što se user učita
    const defaultAvatar = "/image/default-avatar.png";

    const profileImageUrl = computed(() => {
      if (!user.value?.profileImage) {  
        return defaultAvatar;
      }

      return import.meta.env.VITE_API_URL + user.value.profileImage;
    });

    console.log("API URL:", import.meta.env.VITE_API_URL);

    console.log("header image: ", profileImageUrl);

    const isAdmin = computed(() => {
      return auth.user?.role === "admin";
    });

    console.log(isAdmin);
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

    watch(isOpen, (open) => {
      document.body.style.overflow = open ? "hidden" : "";
    });

    return {
      isOpen,
      isProfileOpen,
      toggleMenu,
      closeMenu,
      toggleProfileMenu,
      closeProfileMenu,
      logout,
      profileImageUrl,
      isAdmin,
    };
  },
};
</script>

<style scoped>
.header {
  position: relative;
  background-color: #333;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-top {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}

/* Hamburger (mobile) */
.hamburger {
  width: 30px;
  height: 22px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
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

/* Nav */
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

.nav-list a:hover {
  color: #ff7e00;
}

/* Profile */
.profile-wrapper {
  position: relative;
}

.profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* Dropdown */
.profile-menu {
  position: absolute;
  right: 0;
  background-color: #444;
  margin-top: 10px;
  border-radius: 4px;
  z-index: 100;
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
  padding: 0;
}

.profile-menu li:hover {
  background-color: #555;
}

:deep(.avatar img) {
  border-radius: 50%;
  padding: 2px;
  border: 2px solid #ff7e00;
}

:deep(.avatar--profile img) {
  width: 28px;
  height: 28px;
}

/* Desktop adjustments */
@media (min-width: 768px) {
  .hamburger {
    display: none;
  }

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

  .profile-menu {
    top: 40px;
    min-width: 160px;
  }
}
</style>
