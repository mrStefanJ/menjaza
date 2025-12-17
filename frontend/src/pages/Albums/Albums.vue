<template>
  <section class="albums-page">
    <h1>Albums list</h1>

    <div v-if="loading">Loading albums...</div>
    <div v-else-if="albums.length === 0">No albums found.</div>

    <ul v-else class="albums-list">
      <li v-for="album in paginatedAlbums" :key="album._id" class="album-item">
        <h3>{{ album.title }}</h3>
        <router-link
          :to="{ name: 'album-details', params: { id: album._id } }"
          class="details-link"
        >
          Details
        </router-link>
      </li>
    </ul>

    <Pagination
      :current-page="currentPage"
      :total-items="albums.length"
      :page-size="pageSize"
      @update:page="currentPage = $event"
    />
  </section>
</template>

<script>
import Pagination from "@/components/Pagination.vue";

export default {
  name: "Albums",
  components: { Pagination },

  data() {
    return {
      albums: [],
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 5,
    };
  },

  computed: {
    paginatedAlbums() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.albums.slice(start, end);
    },
  },

  mounted() {
    this.fetchAlbums();
  },

  methods: {
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
