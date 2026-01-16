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
import axios from "axios";

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
    await axios.post("http://localhost:5000/send-email", form.value);

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

<style scoped>
/* ===== Block ===== */
.contact {
  min-height: 100svh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* ===== Elements ===== */
.contact__container {
  width: 100%;
  max-width: 520px;
      padding: 24px 24px 24px 0px;
}

.contact__title {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.75rem;
}

.contact__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.contact__field {
  width: 100%;
}

.contact__input,
.contact__textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.contact__input:focus,
.contact__textarea:focus {
  outline: none;
  border-color: #1976d2;
}

.contact__button {
  padding: 0.85rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: #333;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.contact__button:hover:not(:disabled) {
  background-color: #464646;
  color: #ff7e00;
}

/* ===== Modifiers ===== */
.contact__button--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.contact__status {
  margin-top: 0.75rem;
  font-size: 0.95rem;
}

.contact__status--success {
  color: #2e7d32;
}

.contact__status--error {
  color: #c62828;
}

/* ===== Tablet & Up ===== */
@media (min-width: 768px) {
  .contact {
    padding: 3rem 1rem;
  }

  .contact__title {
    font-size: 2rem;
  }
}
</style>
