<template>
  <section class="albums">
    <h1 class="albums__title">Albums list</h1>

    <div class="albums__search">
      <SearchInput
        v-model="search"
        placeholder="Search albums by title..."
      />
    </div>

    <div
      v-if="loading"
      class="albums__status albums__status--loading"
    >
      Loading albums...
    </div>

    <div
      v-else-if="filteredAlbums.length === 0"
      class="albums__status albums__status--empty"
    >
      No albums found.
    </div>

    <ul v-else class="albums__list">
      <li
        v-for="album in paginatedAlbums"
        :key="album._id"
        class="albums__card"
      >
        <h3 class="albums__card-title">
          {{ album.title }}
        </h3>

        <router-link
          :to="{ name: 'album-details', params: { id: album._id }, query: $route.query }"
          class="albums__card-link"
        >
          Details
        </router-link>
      </li>
    </ul>

    <Pagination
      :current-page="currentPage"
      :total-items="filteredAlbums.length"
      :page-size="pageSize"
      @update:page="onPageChange"
    />
  </section>
</template>


<script>
import Pagination from "@/components/Pagination.vue";
import SearchInput from "@/components/SearchInput.vue";

export default {
  name: "Albums",
  components: { Pagination, SearchInput  },

  data() {
    return {
      albums: [],
      search: "",
      loading: false,
      currentPage: 1,
      pageSize: 10,
    };
  },

  computed: {
    filteredAlbums() {
      if (!this.search) return this.albums;

      const q = this.search.toLowerCase();
      return this.albums.filter((a) =>
        a.title.toLowerCase().includes(q)
      );
    },

    paginatedAlbums() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredAlbums.slice(start, start + this.pageSize);
    },
  },

  watch: {
 search() {
      this.currentPage = 1;
    },
  },

  mounted() {
    this.fetchAlbums();
  },

  methods: {
    onPageChange(page) {
      this.currentPage = page;
    },

    async fetchAlbums() {
      this.loading = true;
      try {
        const response = await fetch("/api/albums", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
          },
        });
        if (!response.ok) throw new Error("Failed to fetch albums");

        this.albums = await response.json();
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
  .albums {
  min-height: 100svh;
  padding: 2rem;
}

/* Title */
.albums__title {
  margin-bottom: 16px;
}

/* Search */
.albums__search {
  margin-bottom: 20px;
}

/* Status (loading / empty) */
.albums__status {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.albums__status--loading {
  opacity: 0.7;
}

.albums__status--empty {
  color: #777;
}

/* List */
.albums__list {
  min-height: 400px;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Item */
.albums__card {
  background: #fff;
  border-radius: 12px;
  margin: 10px 0;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* Link */
.albums__card-link {
  text-decoration: none;
  color: #000;
  transition: color 0.2s ease;
}

.albums__card-link:hover {
  color: #ff7e00;
}


@media (min-width: 480px) {
  .albums__card{
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>