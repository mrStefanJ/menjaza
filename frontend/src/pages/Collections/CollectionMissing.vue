<template>
  <section class="stickers__missing">
    <router-link
      :to="{ name: 'collection-details', query: $route.query }"
      class="btn__back"
      >← Back</router-link
    >
    <h1>The thumbnails I'm missing</h1>
    <div v-if="!album">Loading...</div>

    <div v-else class="stickers-grid">
      <StickerCard
        v-for="num in allStickers"
        :key="num"
        :number="num"
        :checked="selected.includes(num)"
        @toggle="toggleSticker(num)"
      />
    </div>
    <div v-if="album" class="actions">
      <button @click="selectAll" class="btn btn--primary">Select all</button>

      <button @click="clearAll" class="btn btn--primary">Clear all</button>
      <button v-if="album" @click="save" class="btn btn--primary">Save</button>
    </div>
    <ScrollToTop />
  </section>
</template>

<script>
import ScrollToTop from "@/components/Button/ScrollToTop.vue";
import StickerCard from "@/components/StickerCard.vue";

export default {
  name: "CollectionMissing",
  components: { StickerCard, ScrollToTop },

  data() {
    return {
      album: null, // album iz kolekcije ALBUMS
      userAlbum: null, // album iz USER.albums
      selected: [],
    };
  },

  async mounted() {
    await this.load();
  },

  computed: {
    allStickers() {
      if (!this.album?.stickersCount) return [];
      return Array.from({ length: this.album.stickersCount }, (_, i) => i + 1);
    },
  },

  methods: {
    async load() {
      const token = localStorage.getItem("token");
      const albumId = this.$route.params.id;

      const res = await fetch(`/api/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      this.album = await res.json();

      const user = JSON.parse(localStorage.getItem("user"));
      const userAlbum = user.albums.find((a) => a.albumId === albumId);

      this.userAlbum = userAlbum;
      this.selected = userAlbum?.missingStickers || [];
    },

    toggleSticker(num) {
      if (this.selected.includes(num)) {
        this.selected = this.selected.filter((n) => n !== num);
      } else {
        this.selected.push(num);
      }
    },

    selectAll() {
      this.selected = [...this.allStickers];
    },

    clearAll() {
      this.selected = [];
    },

    async save() {
      const token = localStorage.getItem("token");
      const albumId = this.userAlbum.albumId;

      await fetch(`/api/users/me/albums/${albumId}/stickers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          missingStickers: this.selected,
        }),
      });

      const userRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const freshUser = await userRes.json();
      localStorage.setItem("user", JSON.stringify(freshUser));

      this.$router.push({
        name: "collection-details",
        params: { id: this.album._id },
      });
    },
  },
};
</script>
