<template>
  <div class="users-table-wrapper">
    <table class="users-table">
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Country</th>
          <th>City</th>
          <th>Albums</th>
          <th>Register</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td data-label="First name">{{ user.firstName }}</td>
          <td data-label="Last name">{{ user.lastName }}</td>
          <td data-label="Username">{{ user.userName }}</td>
          <td data-label="Email">{{ user.email }}</td>
          <td data-label="Country">{{ user.country || "-" }}</td>
          <td data-label="City">{{ user.city || "-" }}</td>
          <td data-label="Albums">{{ user.albums?.length || 0 }}</td>
          <td data-label="Register">{{ formatDate(user.createdAt) }}</td>
        </tr>

        <tr v-if="!users.length">
          <td colspan="8" class="empty">No users found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatDate } from "@/helper/formatingDate";

export default {
  name: "UserTable",

  props: {
    users: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  methods: {
    formatDate,
  },
};
</script>

<style scoped>
.users-table-wrapper {
  width: 100%;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  display: none;
}

.users-table tr {
  display: block;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  background: #fff;
}

.users-table td {
  display: flex;
  justify-content: space-between;
  padding: 6px 4px;
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.users-table td::before {
  content: attr(data-label);
  font-weight: 600;
  color: #555;
}

.users-table td:last-child {
  border-bottom: none;
}

.empty {
  text-align: center;
  color: #777;
}

@media (min-width: 768px) {
  .users-table thead {
    display: table-header-group;
  }

  .users-table tr {
    display: table-row;
    border: none;
    border-radius: 0;
    padding: 0;
  }

  .users-table td {
    display: table-cell;
    padding: 10px;
    border: 1px solid #ddd;
  }

  .users-table td::before {
    display: none;
  }

  .users-table th {
    padding: 10px;
    background: #f5f5f5;
    font-weight: 600;
    border: 1px solid #ddd;
    text-align: left;
  }
}
</style>
