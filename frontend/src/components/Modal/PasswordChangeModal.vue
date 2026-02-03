<template>
  <div class="change-password-modal" @click.self="close">
    <div class="change-password-modal__content">
      <h2 class="change-password-modal__title">Change password</h2>

      <form class="change-password-modal__form" @submit.prevent="submit">
        <!-- CURRENT PASSWORD -->
        <div class="change-password-modal__group">
          <label class="change-password-modal__label">Current password</label>

          <div class="change-password-modal__password">
            <input
              :type="show.current ? 'text' : 'password'"
              v-model="form.currentPassword"
              autocomplete="current-password"
              class="change-password-modal__input"
            />
            <button
              type="button"
              class="change-password-modal__toggle"
              @click="show.current = !show.current"
            >
              {{ show.current ? "Hide" : "Show" }}
            </button>
          </div>
        </div>

        <!-- NEW PASSWORD -->
        <div class="change-password-modal__group">
          <label class="change-password-modal__label">New password</label>

          <div class="change-password-modal__password">
            <input
              :type="show.new ? 'text' : 'password'"
              v-model="form.newPassword"
              autocomplete="new-password"
              class="change-password-modal__input"
            />
            <button
              type="button"
              class="change-password-modal__toggle"
              @click="show.new = !show.new"
            >
              {{ show.new ? "Hide" : "Show" }}
            </button>
          </div>

          <!-- STRENGTH -->
          <div class="change-password-modal__strength">
            <div class="change-password-modal__strength-bar">
              <span
                class="change-password-modal__strength-fill"
                :class="`change-password-modal__strength-fill--${strengthClass}`"
              />
            </div>

            <small
              class="change-password-modal__strength-text"
              :class="`change-password-modal__strength-text--${strengthClass}`"
            >
              {{ strengthLabel }}
            </small>
          </div>
        </div>

        <!-- CONFIRM -->
        <div class="change-password-modal__group">
          <label class="change-password-modal__label">
            Confirm new password
          </label>

          <div class="change-password-modal__password">
            <input
              :type="show.confirm ? 'text' : 'password'"
              v-model="form.confirmPassword"
              class="change-password-modal__input"
            />
            <button
              type="button"
              class="change-password-modal__toggle"
              @click="show.confirm = !show.confirm"
            >
              {{ show.confirm ? "Hide" : "Show" }}
            </button>
          </div>
        </div>

        <p
          v-if="error"
          class="change-password-modal__message change-password-modal__message--error"
        >
          {{ error }}
        </p>

        <p
          v-if="success"
          class="change-password-modal__message change-password-modal__message--success"
        >
          {{ success }}
        </p>

        <div class="change-password-modal__actions">
          <button
            type="button"
            class="change-password-modal__button change-password-modal__button--secondary"
            @click="close"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="change-password-modal__button"
            :disabled="loading"
          >
            {{ loading ? "Saving..." : "Update password" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { api } from "@/services/api";

const emit = defineEmits(["close"]);

const loading = ref(false);
const error = ref("");
const success = ref("");

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const show = reactive({
  current: false,
  new: false,
  confirm: false,
});

/* =========================
   PASSWORD STRENGTH
========================= */

const strengthScore = computed(() => {
  const pwd = form.newPassword;
  let score = 0;

  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  return score;
});

const strengthLabel = computed(() => {
  if (!form.newPassword) return "";
  if (strengthScore.value <= 2) return "Weak password";
  if (strengthScore.value === 3) return "Medium strength";
  return "Strong password";
});

const strengthClass = computed(() => {
  if (strengthScore.value <= 2) return "weak";
  if (strengthScore.value === 3) return "medium";
  return "strong";
});

/* ========================= */

const close = () => emit("close");

const submit = async () => {
  error.value = "";
  success.value = "";

  if (!form.currentPassword || !form.newPassword) {
    error.value = "All fields are required";
    return;
  }

  if (strengthScore.value < 3) {
    error.value = "Password is too weak";
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;

  try {
    await api.put("/auth/me/password", {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    success.value = "Password updated successfully";

    setTimeout(close, 1000);
  } catch (err) {
    error.value =
      err.response?.data?.message || "Failed to change password";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.change-password-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.change-password-modal__content {
  background: #fff;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border-radius: 14px;
}

.change-password-modal__title {
  text-align: center;
  margin-bottom: 16px;
}

.change-password-modal__group {
  margin-bottom: 14px;
}

.change-password-modal__label {
  display: block;
  margin-bottom: 4px;
}

.change-password-modal__password {
  display: flex;
  gap: 8px;
}

.change-password-modal__input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.change-password-modal__toggle {
  background: none;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  color: #007bff;
}

/* STRENGTH */
.change-password-modal__strength {
  margin-top: 6px;
}

.change-password-modal__strength-bar {
  height: 6px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}

.change-password-modal__strength-fill {
  display: block;
  height: 100%;
  width: 0;
  transition: width 0.3s;
}

.change-password-modal__strength-fill--weak {
  width: 33%;
  background: #dc3545;
}

.change-password-modal__strength-fill--medium {
  width: 66%;
  background: #ffc107;
}

.change-password-modal__strength-fill--strong {
  width: 100%;
  background: #28a745;
}

.change-password-modal__strength-text {
  font-size: 0.75rem;
}

.change-password-modal__strength-text--weak {
  color: #dc3545;
}

.change-password-modal__strength-text--medium {
  color: #ffc107;
}

.change-password-modal__strength-text--strong {
  color: #28a745;
}

/* ACTIONS */
.change-password-modal__actions {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

.change-password-modal__button {
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #333;
  color: #fff;
  border: 1px solid #ccc;
}

.change-password-modal__button:hover {
  background: #515050;
  border-color: #ff7e00;
  color: #ff7e00;
}

/* MESSAGES */
.change-password-modal__message {
  font-size: 0.85rem;
}

.change-password-modal__message--error {
  color: #dc3545;
}

.change-password-modal__message--success {
  color: #28a745;
}

</style>
