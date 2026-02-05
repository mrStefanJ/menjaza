<template>
  <section class="contact">
    <div class="contact__container">
      <h2 class="contact__title">Contact Us</h2>

      <form class="contact__form" @submit.prevent="sendEmail">
        <div class="contact__field">
          <input
            v-model="form.name"
            type="text"
            class="contact__input"
            placeholder="Your Name"
            required
          />
        </div>

        <div class="contact__field">
          <input
            v-model="form.email"
            type="email"
            class="contact__input"
            placeholder="Your Email"
            required
          />
        </div>

        <div class="contact__field">
          <input
            v-model="form.subject"
            type="text"
            class="contact__input"
            placeholder="Subject"
            required
          />
        </div>

        <div class="contact__field">
          <textarea
            v-model="form.message"
            class="contact__textarea"
            placeholder="Message"
            rows="5"
            required
          />
        </div>

        <button
          class="contact__button"
          :class="{ 'contact__button--loading': loading }"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? "Sending..." : "Send Message" }}
        </button>

        <p v-if="status.message" :class="statusClass">
          {{ status.message }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { api } from "@/services/api";

const loading = ref(false);

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const status = ref({
  type: "", // success | error
  message: "",
});

const statusClass = computed(() => ({
  contact__status: true,
  "contact__status--success": status.value.type === "success",
  "contact__status--error": status.value.type === "error",
}));

const resetForm = () => {
  form.value = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
};

const sendEmail = async () => {
  status.value = { type: "", message: "" };
  loading.value = true;

  try {
    await api.post("/users/me/send-email", form.value);

    status.value = {
      type: "success",
      message: "Your message has been sent successfully.",
    };

    resetForm();
  } catch (error) {
    status.value = {
      type: "error",
      message:
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.",
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style>
@import '@/assets/contact.css';
</style>
