<template>
  <section class="users-list">
    <h1>Users</h1>

    <SearchInput
      v-model="search"
      placeholder="Search users by username or name..."
    />

    <UserTable :users="filteredUsers" />

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import UserTable from "@/components/Table/Users.vue";
import SearchInput from "@/components/SearchInput.vue";

const users = ref([]);
const error = ref("");
const search = ref("");

const fetchAllUsers = async () => {
  try {
    const response = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const allUsers = await response.json();

    const currentUserName = localStorage.getItem("userName");

    users.value = allUsers.filter((user) => user.userName !== currentUserName);
    console.log(users.value);
  } catch (err) {
    console.error(err);
    error.value = err.message;
  }
};

const filteredUsers = computed(() => {
  if (!search.value) return users.value;

  const q = search.value.toLowerCase();

  return users.value.filter((u) =>
    [u.userName, u.firstName, u.lastName]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q))
  );
});

onMounted(() => {
  fetchAllUsers();
});
</script>

<style scoped>
.users-list {
  height: 100%;
  min-height: 100svh;
  padding: 2rem;
}
</style>
