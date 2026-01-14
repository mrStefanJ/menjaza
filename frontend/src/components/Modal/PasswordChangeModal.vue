<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <h2>Change password</h2>

      <form @submit.prevent="submit">
        <!-- CURRENT PASSWORD -->
        <div class="form-group">
          <label>Current password</label>
          <div class="password-field">
            <input
              :type="show.current ? 'text' : 'password'"
              v-model="form.currentPassword"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle"
              @click="show.current = !show.current"
            >
              {{ show.current ? "Hide" : "Show" }}
            </button>
          </div>
        </div>

        <!-- NEW PASSWORD -->
        <div class="form-group">
          <label>New password</label>
          <div class="password-field">
            <input
              :type="show.new ? 'text' : 'password'"
              v-model="form.newPassword"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="toggle"
              @click="show.new = !show.new"
            >
              {{ show.new ? "Hide" : "Show" }}
            </button>
          </div>

          <!-- STRENGTH INDICATOR -->
          <div class="strength">
            <div class="bar">
              <span :class="strengthClass"></span>
            </div>
            <small :class="strengthClass">
              {{ strengthLabel }}
            </small>
          </div>
        </div>

        <!-- CONFIRM -->
        <div class="form-group">
          <label>Confirm new password</label>
          <div class="password-field">
            <input
              :type="show.confirm ? 'text' : 'password'"
              v-model="form.confirmPassword"
            />
            <button
              type="button"
              class="toggle"
              @click="show.confirm = !show.confirm"
            >
              {{ show.confirm ? "Hide" : "Show" }}
            </button>
          </div>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <p v-if="success" class="success-message">{{ success }}</p>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="close">
            Cancel
          </button>
          <button type="submit" :disabled="loading">
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
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border-radius: 14px;
}

h2 {
  text-align: center;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 14px;
}

.password-field {
  display: flex;
  gap: 8px;
}

.password-field input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.toggle {
  background: none;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  color: #007bff;
}

/* STRENGTH */
.strength {
  margin-top: 6px;
}

.bar {
  height: 6px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  width: 0%;
  transition: width 0.3s;
}

.bar span.weak {
  width: 33%;
  background: #dc3545;
}

.bar span.medium {
  width: 66%;
  background: #ffc107;
}

.bar span.strong {
  width: 100%;
  background: #28a745;
}

.strength small {
  font-size: 0.75rem;
}

.strength small.weak {
  color: #dc3545;
}

.strength small.medium {
  color: #ffc107;
}

.strength small.strong {
  color: #28a745;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
}

.success-message {
  color: #28a745;
  font-size: 0.85rem;
}

.btn-secondary {
  background: #e0e0e0;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
}
</style>
