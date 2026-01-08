<template>
  <section class="stickers__missing">
    <h1>Sličice koje mi fale</h1>

    <div v-if="!album">Učitavanje...</div>

    <div v-else class="stickers-grid">
      <StickerCard
        v-for="num in allStickers"
        :key="num"
        :number="num"
        :checked="selected.includes(num)"
        @toggle="toggleSticker(num)"
      />
    </div>

    <button v-if="album" @click="save" class="btn__save">Sačuvaj</button>
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

      // 1️⃣ fetch albuma
      const res = await fetch(`/api/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      this.album = await res.json();

      // 2️⃣ fetch user iz localStorage
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

    async save() {
      const token = localStorage.getItem("token");

      // 👇 OVO JE PRAVI ID
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

      // 🔄 refetch usera (bez keša)
      const userRes = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const freshUser = await userRes.json();
      localStorage.setItem("user", JSON.stringify(freshUser));

      // ⬅️ vrati se na detalje ALBUMA (ne user-albuma)
      this.$router.push({
        name: "collection-details",
        params: { id: this.album._id },
      });
    },
  },
};
</script>

<style scoped>
.stickers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 12px;
}
</style>
