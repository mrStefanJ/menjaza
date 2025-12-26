<template>
  <section class="profile-page">
    <h1>My profile</h1>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-group">
        <label>First name</label>
        <input v-model="form.firstName" type="text" required />
      </div>

      <div class="form-group">
        <label>Last name</label>
        <input v-model="form.lastName" type="text" required />
      </div>

      <div class="form-group">
        <label>Username</label>
        <input v-model="form.userName" type="text" required />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" disabled />
      </div>

      <div class="form-group">
        <label>Country</label>
        <select v-model="form.country">
          <option value="">-- Select country --</option>
          <option v-for="c in countries" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>City</label>
        <input v-model="form.city" type="text" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Save changes" }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { api } from "@/services/api";

const loading = ref(false);

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

const fetchMe = async () => {
  const { data } = await api.get("/users/me");
  Object.assign(form, data);
};

const updateProfile = async () => {
  loading.value = true;
  try {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      userName: form.userName,
      city: form.city,
      country: form.country,
    };

    const { data } = await api.put("/users/me", payload);
    Object.assign(form, data);
    alert("Profile updated successfully");
  } catch (err) {
    alert("Failed to update profile");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMe);
</script>
