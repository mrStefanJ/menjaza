<template>
  <section class="album">
    <router-link
      :to="{ name: 'albums', query: $route.query }"
      class="btn__back"
    >
      ← Back
    </router-link>

    <p v-if="loading" class="album__state">Loading album...</p>
    <p v-else-if="error" class="album__state album__state--error">
      {{ error }}
    </p>

    <div v-else-if="album" class="album__content">
      <h1 class="album__title">{{ album.title }}</h1>

      <div class="album__details">
        <div class="album__image">
          <img :src="album.cover" :alt="album.title" />
        </div>

        <div class="album__info">
          <p><strong>Publisher:</strong> {{ album.publisher }}</p>
          <p><strong>Category:</strong> {{ album.category }}</p>
          <p><strong>Release:</strong> {{ album.year }}</p>
          <p><strong>Stickers:</strong> {{ album.stickersCount }}</p>
          <p v-if="album.franchise">
            <strong>Franchise:</strong> {{ album.franchise }}
          </p>
        </div>
      </div>

      <button
        class="album__action"
        :class="{
          'album__action--disabled': isAdded || adding,
        }"
        :disabled="isAdded || adding"
        @click="addAlbum(album._id)"
      >
        <span v-if="isAdded">Already added</span>
        <span v-else>{{ adding ? "Adding..." : "Add Album" }}</span>
      </button>

      <p
        v-if="status.message"
        class="album__status"
        :class="`album__status--${status.type}`"
      >
        {{ status.message }}
      </p>
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
      adding: false,
      isAdded: false,
      error: null,
      status: {
        type: "", // success | error
        message: "",
      },
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
        const albumId = this.$route.params.id;

        const [albumRes, userRes] = await Promise.all([
          api.get(`/albums/${albumId}`),
          api.get("/users/me"),
        ]);

        this.album = albumRes.data;

        this.isAdded = userRes.data.albums?.some(
          (a) => a.albumId === this.album._id
        );
      } catch (err) {
        this.error =
          err.response?.data?.message || "Failed to load album details.";
      } finally {
        this.loading = false;
      }
    },

    async addAlbum(albumId) {
      this.adding = true;
      this.status = { type: "", message: "" };

      try {
        await api.put("/users/me/albums", { albumId });

        this.isAdded = true;
        this.status = {
          type: "success",
          message: "Album added to your collection.",
        };
      } catch (err) {
        this.status = {
          type: "error",
          message:
            err.response?.data?.message || "Failed to add album.",
        };
      } finally {
        this.adding = false;
      }
    },
  },
};
</script>

<style scoped>
.album {
  padding: 1.25rem;
      min-height: 100svh;
    height: 100%;
}

.album__title {
  margin-bottom: 1rem;
  font-size: 1.6rem;
}

.album__state {
  font-size: 1rem;
}

.album__state--error {
  color: #c62828;
}

.album__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.album__details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.album__image img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
}

.album__info p {
  margin: 0.25rem 0;
}

.album__action {
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.album__action--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.album__status {
  font-size: 0.95rem;
}

.album__status--success {
  color: #2e7d32;
}

.album__status--error {
  color: #c62828;
}

/* ===== Tablet & Up ===== */
@media (min-width: 480px) {
  .album__details {
    flex-direction: row;
    align-items: flex-start;
  }
}
</style>
