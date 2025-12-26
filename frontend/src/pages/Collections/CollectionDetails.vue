<template>
  <section class="collection-details">
    <h1>Sličice – {{ album?.title }}</h1>

    <div v-if="loading">Učitavanje...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-if="album">
      <h3>Nedostaju</h3>
      <div class="stickers-flex">
        <StickerCard v-for="n in album.missingStickers" :key="n" :number="n" />
      </div>
      <router-link
        :to="{ name: 'collection-missing', params: { id: album._id } }"
      >
        Dodaj ili Izbriše
      </router-link>

      <h3>Imam</h3>
      <div class="stickers-flex">
        <StickerCard
          v-for="n in album.duplicateStickers"
          :key="n"
          :number="n"
        />
      </div>
      <router-link
        :to="{ name: 'collection-owned', params: { id: album._id } }"
      >
        Dodaj ili Izbriše
      </router-link>
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
    console.log("Missing stickers", this.album.missingStickers);
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
        (a, b) => a - b
      );
      this.album.duplicateStickers = (userAlbum?.duplicateStickers || []).sort(
        (a, b) => a - b
      );
    },
  },
};
</script>

<style>
.stickers-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.checkbox-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.collection-link {
  display: flex;
  flex-direction: column;
}
</style>
