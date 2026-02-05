<template>
  <section class="collection-details">
    <router-link
      :to="{ name: 'collections', query: $route.query }"
      class="btn__back"
      >← Back</router-link
    >
    <h1>{{ album?.title }}</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-if="album">
      <div class="collection-details__missing">
        <h3>Missing</h3>

        <div class="stickers-flex">
          <p v-if="!hasMissing" class="collection-details__empty">
            You didn't add missing stickers
          </p>

          <StickerCard
            v-else
            v-for="n in missingStickers"
            :key="n"
            :number="n"
          />
        </div>

        <router-link
          :to="{ name: 'collection-missing', params: { id: album._id } }"
          class="btn btn--primary"
        >
          Add or Remove
        </router-link>
      </div>

      <div class="collection-details__owned">
        <h3>Have</h3>

        <div class="stickers-flex">
          <p v-if="!hasDuplicates" class="collection-details__empty">
            You didn't add duplicates stickers
          </p>

          <StickerCard
            v-else
            v-for="n in duplicateStickers"
            :key="n"
            :number="n"
          />
        </div>

        <router-link
          :to="{ name: 'collection-owned', params: { id: album._id } }"
          class="btn btn--primary"
        >
          Add or Remove
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import StickerCard from "@/components/StickerCard.vue";

export default {
  name: "CollectionDetails",

  components: {
    StickerCard,
  },

  data() {
    return {
      album: null,
    };
  },

  async mounted() {
    await this.loadData();
  },

  computed: {
    missingStickers() {
      return this.album?.missingStickers ?? [];
    },
    duplicateStickers() {
      return this.album?.duplicateStickers ?? [];
    },
    hasMissing() {
      return this.missingStickers.length > 0;
    },
    hasDuplicates() {
      return this.duplicateStickers.length > 0;
    },
  },

  methods: {
    async loadData() {
      const token = localStorage.getItem("token");
      const albumId = this.$route.params.id;

      const res = await fetch(`/api/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const albumData = await res.json();
      this.album = albumData;

      const user = JSON.parse(localStorage.getItem("user"));
      const userAlbum = user.albums.find((a) => a.albumId === albumId);

      this.album.missingStickers = (userAlbum?.missingStickers || []).sort(
        (a, b) => a - b,
      );
      this.album.duplicateStickers = (userAlbum?.duplicateStickers || []).sort(
        (a, b) => a - b,
      );
    },
  },
};
</script>

<style>
@import "@/assets/collection.css";
</style>
