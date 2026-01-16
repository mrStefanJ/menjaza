<template>
  <nav v-if="totalPages > 1" class="pagination">
    <button
      class="pagination__button"
      :class="{ 'pagination__button--disabled': currentPage === 1 }"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="pagination__button"
      :class="{ 'pagination__button--active': page === currentPage }"
      @click="changePage(page)"
    >
      {{ page }}
    </button>

    <button
      class="pagination__button"
      :class="{ 'pagination__button--disabled': currentPage === totalPages }"
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

.pagination__button {
  padding: 6px 12px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.pagination__button:hover:not(.pagination__button--disabled) {
  color: #ff7e00;
}

.pagination__button--active {
  font-weight: bold;
  background: #9a9a9a;
}

.pagination__button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
