<template>
  <div class="auth">
    <h2>Register</h2>
    
    <input v-model="firstName" type="text" placeholder="First Name" @input="validateText('firstName')" />
    <input v-model="lastName" type="text" placeholder="Last Name" @input="validateText('lastName')" />
    <input v-model="userName" type="text" placeholder="User Name" />
    <input v-model="email" type="email" placeholder="Email" />

    <!-- PASSWORD FIELD -->
    <div class="input-wrapper">
      <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" />

      <span class="icon" @click="showPassword = !showPassword">
        <svg v-if="showPassword" width="22" height="22" viewBox="0 0 24 24">
          <path fill="#555" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z">
          </path>
        </svg>

        <svg v-else width="22" height="22" viewBox="0 0 24 24">
          <path fill="#555"
            d="M1 4.27L2.28 3 21 21.72 19.73 23l-3.12-3.12C14.93 20.27 13.5 21 12 21c-7 0-11-7-11-7 1.23-2.15 3.07-4.43 5.61-5.97L1 4.27zM12 7c.62 0 1.21.12 1.77.33l-1.77 1.77A3 3 0 009 12c0 .62.18 1.2.48 1.7l-1.5 1.5C6.76 13.66 6 12 6 12s2-4 6-4zm10 5s-1.45 2.59-4.11 4.7l-1.47-1.47C17.92 14.5 19 12 19 12s-2-4-7-4c-.8 0-1.55.1-2.25.29l-1.6-1.6C9.75 6.26 10.86 6 12 6c7 0 10 6 10 6z">
          </path>
        </svg>
      </span>
    </div>

    <!-- CONFIRM PASSWORD FIELD -->
    <div class="input-wrapper">
      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
        placeholder="Confirm Password" />

      <span class="icon" @click="showConfirmPassword = !showConfirmPassword">
        <svg v-if="showConfirmPassword" width="22" height="22" viewBox="0 0 24 24">
          <path fill="#555" d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z">
          </path>
        </svg>

        <svg v-else width="22" height="22" viewBox="0 0 24 24">
          <path fill="#555"
            d="M1 4.27L2.28 3 21 21.72 19.73 23l-3.12-3.12C14.93 20.27 13.5 21 12 21c-7 0-11-7-11-7 1.23-2.15 3.07-4.43 5.61-5.97L1 4.27zM12 7c.62 0 1.21.12 1.77.33l-1.77 1.77A3 3 0 009 12c0 .62.18 1.2.48 1.7l-1.5 1.5C6.76 13.66 6 12 6 12s2-4 6-4zm10 5s-1.45 2.59-4.11 4.7l-1.47-1.47C17.92 14.5 19 12 19 12s-2-4-7-4c-.8 0-1.55.1-2.25.29l-1.6-1.6C9.75 6.26 10.86 6 12 6c7 0 10 6 10 6z">
          </path>
        </svg>
      </span>
    </div>

    <button :disabled="!formValid" @click="register">Register</button>

    <p>If you already have account, go to <RouterLink to="/">Login</RouterLink> page</p>

    <p class="msg">{{ message }}</p>
  </div>
</template>


<script>
import { api } from "@/services/api";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      albums: [],
      message: "",
      country: "",
      city: "",
    };
  },

  computed: {
    formValid() {
      return (
        this.firstName &&
        this.lastName &&
        this.userName &&
        this.email &&
        this.passwordValid &&
        this.password === this.confirmPassword
      );
    },

    passwordValid() {
      const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
      return regex.test(this.password);
    }
  },

  methods: {
    validateText(field) {
      this[field] = this[field].replace(/[^A-Za-zčćžšđČĆŽŠĐ]/g, "");
    },

    async register() {
      try {
        const { data } = await api.post("/auth/register", {
          firstName: this.firstName,
          lastName: this.lastName,
          userName: this.userName,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });

        this.message = data.message;

        // SUCCESS → reset polja
        this.firstName = "";
        this.lastName = "";
        this.userName = "";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
        this.showPassword = false;
        this.showConfirmPassword = false;

        // preusmeri na login posle kratkog delay-a
        setTimeout(() => {
          this.$router.push("/");
        }, 700);

      } catch (err) {
        this.message = err.response?.data?.message || "Error occurred";
      }
    }
  }
};
</script>
