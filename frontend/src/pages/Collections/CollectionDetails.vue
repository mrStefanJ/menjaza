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
          <StickerCard
            v-for="n in album.missingStickers"
            :key="n"
            :number="n"
          />
        </div>
        <router-link
          :to="{ name: 'collection-missing', params: { id: album._id } }"
          class="btn__save"
        >
          Add or Remove
        </router-link>
      </div>
      <div class="collection-details__owned">
        <h3>Have</h3>
        <div class="stickers-flex">
          <StickerCard
            v-for="n in album.duplicateStickers"
            :key="n"
            :number="n"
          />
        </div>
        <router-link
          :to="{ name: 'collection-owned', params: { id: album._id } }"
          class="btn__save"
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
.collection-details {
  min-height: 100svh;
}
.stickers-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
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

.collection-details__missing,
.collection-details__owned {
  margin: 18px 0;
}
</style>
