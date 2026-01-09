<template>
  <section class="exchange-page">
    <header class="exchange-header">
      <h1>Moguće razmene</h1>
      <p>Albumi za koje postoji potencijal za razmenu sličica</p>
    </header>

    <div class="album-list">
      <div
        v-for="album in albums"
        :key="album.albumId"
        class="album-card"
        @click="openAlbum(album.albumId)"
      >
        <div>
          <h3>{{ album.albumName }}</h3>
          <p>{{ album.exchangeUsers }} korisnika za razmenu</p>
        </div>

        <span class="arrow">→</span>
      </div>

      <div v-if="loading" class="empty">
        Učitavanje albuma...
      </div>

      <div v-else-if="!albums.length" class="empty">
        Trenutno nema mogućih razmena
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const albums = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch("/api/exchange/albums", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed");

    albums.value = await res.json();
    console.log("Albums: ",albums.value);
  } catch (err) {
    console.error("Album exchange fetch error:", err);
    albums.value = [];
  } finally {
    loading.value = false;
  }
});

const openAlbum = (albumId) => {
  router.push(`/exchange/${albumId}`);
};
</script>

<style scoped>
.exchange-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100svh;
}

.album-list {
  display: grid;
  gap: 12px;
}

.album-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

.album-card:hover {
  background: #f8fbff;
}

.arrow {
  font-size: 22px;
}

.empty {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}
</style>
