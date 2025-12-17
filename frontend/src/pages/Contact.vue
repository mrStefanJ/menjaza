<template>
  <div class="contact-page">
    <h2>Contact Us</h2>
    <form @submit.prevent="sendEmail" class="contact-form">
      <input v-model="name" type="text" placeholder="Your Name" required />
      <input v-model="email" type="email" placeholder="Your Email" required />
      <input v-model="subject" type="text" placeholder="Subject" required />
      <textarea v-model="message" placeholder="Message" required></textarea>
      <button type="submit" :disabled="loading">
        {{ loading ? "Sending..." : "Send Message" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const loading = ref(false);

const sendEmail = async () => {
  if (!name.value || !email.value || !subject.value || !message.value) {
    alert("Please fill in all fields.");
    return;
  }

  loading.value = true;

  try {
    await axios.post("http://localhost:5000/send-email", {
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value
    });

    alert("Email sent successfully!");
    name.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
  } catch (err) {
    console.error(err);
    alert(
      "Failed to send email: " +
        (err.response?.data?.message || err.message)
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contact-page {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.contact-form {
  display: flex;
  flex-direction: column;
}

.contact-form input,
.contact-form textarea {
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.contact-form button {
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.contact-form button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
