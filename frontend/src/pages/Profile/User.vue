<template>
  <section class="profile">
    <h1 class="profile__title">My profile</h1>

    <form @submit.prevent="updateProfile" class="profile__form">
      <!-- Avatar -->
      <div class="profile__group profile__group--avatar" :class="{ 'profile__group--success': imageFile }">
        <ProfileImagePicker
          v-model="imageFile"
          :image-url="profileImageUrl"
          class="profile__avatar"
        />
      </div>

      <!-- First / Last name -->
      <div class="profile__row">
        <div
          class="profile__group"
          :class="{
            'profile__group--error': errors.firstName && touched.firstName,
            'profile__group--success':
              !errors.firstName &&
              touched.firstName &&
              form.firstName !== originalForm.firstName,
          }"
        >
          <label class="profile__label">First name</label>
          <input
            v-model="form.firstName"
            class="profile__input"
            type="text"
            @blur="touched.firstName = true; validateField('firstName')"
          />
          <small v-if="errors.firstName && touched.firstName" class="profile__error">
            {{ errors.firstName }}
          </small>
        </div>

        <div
          class="profile__group"
          :class="{
            'profile__group--error': errors.lastName && touched.lastName,
            'profile__group--success':
              !errors.lastName &&
              touched.lastName &&
              form.lastName !== originalForm.lastName,
          }"
        >
          <label class="profile__label">Last name</label>
          <input
            v-model="form.lastName"
            class="profile__input"
            type="text"
            @blur="touched.lastName = true; validateField('lastName')"
          />
          <small v-if="errors.lastName && touched.lastName" class="profile__error">
            {{ errors.lastName }}
          </small>
        </div>
      </div>

      <!-- Username -->
      <div
        class="profile__group"
        :class="{
          'profile__group--error': errors.userName && touched.userName,
          'profile__group--success':
            !errors.userName &&
            touched.userName &&
            form.userName !== originalForm.userName,
        }"
      >
        <label class="profile__label">Username</label>
        <input
          v-model="form.userName"
          class="profile__input"
          type="text"
          @blur="touched.userName = true; validateField('userName')"
        />
        <small v-if="errors.userName && touched.userName" class="profile__error">
          {{ errors.userName }}
        </small>
      </div>

      <!-- Email -->
      <div class="profile__group">
        <label class="profile__label">Email</label>
        <input v-model="form.email" class="profile__input" type="email" disabled />
      </div>

      <!-- Country / City -->
      <div class="profile__row">
        <div
          class="profile__group"
          :class="{
            'profile__group--error': errors.country && touched.country,
            'profile__group--success':
              !errors.country &&
              touched.country &&
              form.country !== originalForm.country,
          }"
        >
          <label class="profile__label">Country</label>
          <select v-model="form.country" class="profile__select">
            <option value="">-- Select country --</option>
            <option v-for="c in countries" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
          <small v-if="errors.country && touched.country" class="profile__error">
            {{ errors.country }}
          </small>
        </div>

        <div class="profile__group">
          <label class="profile__label">City</label>
          <input v-model="form.city" class="profile__input" type="text" />
        </div>
      </div>

      <!-- Message -->
      <p v-if="message" class="profile__message">
        {{ message }}
      </p>

      <!-- Actions -->
      <div class="profile__actions">
        <button
          class="btn btn--primary"
          type="submit"
          :disabled="loading || !hasChanges"
        >
          {{ loading ? "Saving..." : "Save changes" }}
        </button>

        <button
          type="button"
          class="btn btn--primary"
          @click="showPasswordModal = true"
        >
          Change password
        </button>
      </div>

      <PasswordChangeModal
        v-if="showPasswordModal"
        @close="showPasswordModal = false"
      />
    </form>
  </section>
</template>


<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import ProfileImagePicker from "@/components/ProfileImagePicker.vue";
import PasswordChangeModal from "@/components/Modal/PasswordChangeModal.vue";

const auth = useAuthStore();
const imageFile = ref(null);
const showPasswordModal = ref(false);
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
    form.country !== originalForm.country ||
    !!imageFile.value
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

  if (!hasChanges()) {
    message.value = "No changes to save";
    return;
  }

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

    imageFile.value = null;

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
.profile {
  width: 100%;
}

.profile__title {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 20px;
}

.profile__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Groups */
.profile__group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.profile__group--error .profile__input,
.profile__group--error .profile__select {
  border-color: #dc3545;
}

.profile__group--success .profile__input,
.profile__group--success .profile__select {
  border-color: #28a745;
}

/* Labels & inputs */
.profile__label {
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: #555;
}

.profile__input,
.profile__select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.profile__input:focus,
.profile__select:focus {
  outline: none;
  border-color: #007bff;
}

.profile__error {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #dc3545;
}

/* Avatar */
.profile__avatar img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px solid #ff7e00;
  padding: 2px;
}

/* Layout */
.profile__row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Actions */
.profile__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Message */
.profile__message {
  text-align: center;
  font-size: 0.9rem;
  color: #ff0000;
}

/* Tablet */
@media (min-width: 768px) {
  .profile {
    max-width: 640px;
    margin: 0 auto;
    padding: 24px;
  }

  .profile__row .profile__group {
    flex: 1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .profile {
    max-width: 720px;
  }

  .profile__form {
    gap: 20px;
  }
}

</style>
