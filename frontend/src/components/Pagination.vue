<template>
  <nav v-if="totalPages > 1" class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
    >
      Next
    </button>
  </nav>
</template>

<script>
export default {
  name: "Pagination",

  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },

    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },

  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit("update:page", page);
      }
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 6px 12px;
  cursor: pointer;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 4px;
}

button:hover {
    color: #ff7e00;
}

button.active {
  font-weight: bold;
  background: #9a9a9a;
  color: #fff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
