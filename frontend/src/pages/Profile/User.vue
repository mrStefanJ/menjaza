<template>
  <section class="profile-page">
    <h1>My profile</h1>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-group">
        <ProfileImagePicker v-model="imageFile" :image-url="profileImageUrl" class="avatar avatar--profile" />
      </div>
      <div
        class="form-group"
        :class="{
          error: errors.firstName && touched.firstName,
          success:
            !errors.firstName &&
            touched.firstName &&
            form.firstName !== originalForm.firstName,
        }"
      >
        <label>First name</label>

        <input
          v-model="form.firstName"
          type="text"
          @blur="
            touched.firstName = true;
            validateField('firstName');
          "
        />

        <small v-if="errors.firstName && touched.firstName">
          {{ errors.firstName }}
        </small>
      </div>

      <div
        class="form-group"
        :class="{
          error: errors.lastName && touched.lastName,
          success:
            !errors.lastName &&
            touched.lastName &&
            form.lastName !== originalForm.lastName,
        }"
      >
        <label>Last name</label>
        <input
          v-model="form.lastName"
          type="text"
          @blur="
            touched.lastName = true;
            validateField('lastName');
          "
        />
        <small v-if="errors.lastName && touched.lastName">
          {{ errors.lastName }}
        </small>
      </div>

      <div
        class="form-group"
        :class="{
          error: errors.userName && touched.userName,
          success:
            !errors.userName &&
            touched.userName &&
            form.userName !== originalForm.userName,
        }"
      >
        <label>Username</label>
        <input
          v-model="form.userName"
          type="text"
          @blur="
            touched.lastName = true;
            validateField('lastName');
          "
        />
        <small v-if="errors.userName && touched.userName">
          {{ errors.userName }}
        </small>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" disabled />
      </div>

      <div
        class="form-group"
        :class="{
          error: errors.country && touched.country,
          success:
            !errors.country &&
            touched.country &&
            form.country !== originalForm.country,
        }"
      >
        <label>Country</label>
        <select v-model="form.country">
          <option value="">-- Select country --</option>
          <option v-for="c in countries" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
        <small v-if="errors.country && touched.country">
          {{ errors.country }}
        </small>
      </div>

      <div class="form-group">
        <label>City</label>
        <input v-model="form.city" type="text" />
      </div>

      <p v-if="message" class="form-message">
        {{ message }}
      </p>
      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Save changes" }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import ProfileImagePicker from "@/components/ProfileImagePicker.vue";

const auth = useAuthStore();
const imageFile = ref(null);
const loading = ref(false);
const message = ref("");

const countries = [
  "Srbija",
  "Hrvatska",
  "Slovenija",
  "Severna Makedonija",
  "Crna Gora",
  "Bosna i Hercegovina",
];

const form = reactive({
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  city: "",
  country: "",
});

const touched = reactive({
  firstName: false,
  lastName: false,
  userName: false,
  city: false,
  country: false,
});

const errors = reactive({
  firstName: "",
  lastName: "",
  userName: "",
  city: "",
  country: "",
});

// originalna kopija – služi za poređenje
const originalForm = reactive({});

/* =========================
   FETCH USER
========================= */

const validateField = (field) => {
  switch (field) {
    case "firstName":
      errors.firstName = form.firstName.trim() ? "" : "First name is required";
      break;
    case "lastName":
      errors.lastName = form.lastName.trim() ? "" : "Last name is required";
      break;
    case "userName":
      errors.userName = form.userName.trim() ? "" : "Username is required";
      break;
    case "country":
      errors.country = form.country ? "" : "Country is required";
      break;
  }
};

const validateForm = () => {
  validateField("firstName");
  validateField("lastName");
  validateField("userName");
  validateField("country");
  return !Object.values(errors).some(Boolean);
};

/* =========================
   PROVERA PROMENA
========================= */
const hasChanges = () => {
  return (
    form.firstName !== originalForm.firstName ||
    form.lastName !== originalForm.lastName ||
    form.userName !== originalForm.userName ||
    form.city !== originalForm.city ||
    form.country !== originalForm.country
  );
};

const profileImageUrl = computed(() => {
  if (!form.profileImage) return "";
  return import.meta.env.VITE_API_URL + form.profileImage;
});

/* =========================
   UPDATE PROFILE
========================= */
const updateProfile = async () => {
  message.value = "";
  Object.keys(touched).forEach((k) => (touched[k] = true));

  if (!validateForm()) return;

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("userName", form.userName);
    formData.append("city", form.city);
    formData.append("country", form.country);

    if (imageFile.value) {
      formData.append("profileImage", imageFile.value);
    }

    const { data } = await api.put("/users/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Object.assign(form, data);
    Object.assign(originalForm, data);

    // 🔥 Update Pinia + localStorage -> automatski Header vidi novu sliku
    auth.setUser(data);

    message.value = "Profile updated successfully";
  } catch (err) {
    message.value = err.response?.data?.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (auth.user) {
    Object.assign(form, auth.user);
    Object.assign(originalForm, auth.user);
  }
});
</script>

<style scoped>
.profile-page {
  padding: 16px;
  max-width: 100%;
}

.profile-page h1 {
  font-size: 1.4rem;
  margin-bottom: 16px;
  text-align: center;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: #555;
}

.form-group input,
.form-group select {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
}

.form-group.error input,
.form-group.error select {
  border-color: #dc3545;
}

.form-group.success input,
.form-group.success select {
  border-color: #28a745;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
}

.form-group small {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #dc3545;
}

:deep(.avatar img) {
  border-radius: 50%;
  padding: 2px;
  border: 2px solid #ff7e00;
}

:deep(.avatar--profile img) {
  width: 96px;
  height: 96px;
}

button[type="submit"] {
  margin-top: 12px;
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .profile-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
  }

  .profile-page h1 {
    font-size: 1.6rem;
  }

  .profile-form {
    gap: 18px;
  }
}

@media (min-width: 1024px) {
  .profile-page {
    max-width: 720px;
    padding: 32px;
  }

  .profile-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-group:nth-child(4), /* email */
  .form-group:nth-child(7) {
    /* city */
    grid-column: span 2;
  }

  button[type="submit"] {
    grid-column: span 2;
    justify-self: flex-end;
    width: 200px;
  }
}
</style>
