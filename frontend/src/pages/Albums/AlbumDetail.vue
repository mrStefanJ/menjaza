<template>
  <section class="album-details-page">
    <router-link to="/albums" class="album-back">← Back to albums</router-link>

    <div v-if="loading">Loading album...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else-if="album">
      <h1>{{ album.title }}</h1>

      <div class="album-details">
        <div class="album-image">
          <img :src="album.cover" alt="Cover image" class="album-image" />
        </div>
        <div class="album-info">
          <p>Publisher: {{ album.publisher }}</p>
          <p>Category: {{ album.category }}</p>
          <p>Release: {{ album.year }}</p>
          <p>Stickers: {{ album.stickersCount }}</p>
          <p v-if="album.franchise">Franchise: {{ album.franchise }}</p>
        </div>
      </div>

      <button
        @click="addAlbum(album._id)"
        :disabled="adding || isAdded"
        :class="{
          'album-btn': true,
          'album-btn--disabled': isAdded || adding,
        }"
      >
        <span v-if="isAdded">Already added</span>
        <span v-else>{{ adding ? "Adding..." : "Add Album" }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import { api } from "@/services/api";

export default {
  name: "AlbumDetails",
  data() {
    return {
      album: null,
      loading: false,
      error: null,
      adding: false,
      isAdded: false,
    };
  },

  mounted() {
    this.fetchAlbum();
  },

  methods: {
    async fetchAlbum() {
      this.loading = true;
      this.error = null;

      try {
        const id = this.$route.params.id; // parametar iz URL

        const [albumRes, userRes] = await Promise.all([
          api.get(`/albums/${id}`),
          api.get("users/me"),
        ]);

        this.album = albumRes.data;

        this.isAdded = userRes.data.albums?.includes(this.album._id);
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || "Failed to fetch album";
      } finally {
        this.loading = false;
      }
    },

    async addAlbum(albumId) {
      this.adding = true;
      try {
        await api.put("/users/me/albums", { albumId });
        this.isAdded = true;
        alert("Album added successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to add album");
      } finally {
        this.adding = false;
      }
    },
  },
};
</script>

<style>
.album-details-page {
  padding: 20px;
}

.album-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.album-image img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.album-btn {
  padding: 10px 16px;
  cursor: pointer;
}

.album-btn--disabled,
.album-btn:disabled {
  cursor: not-allowed; /* 👈 no-cursor */
  opacity: 0.6;
}

@media (min-width: 480px) {
  .album-details {
    flex-direction: row;
  }
}
</style>
