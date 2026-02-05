<template>
  <section class="exchange">
    <header class="exchange__header">
      <h1 class="exchange__title">Possible exchanges</h1>
      <p class="exchange__subtitle">
        Albums that have thumbnail exchange potential
      </p>
    </header>

    <div class="exchange__list">
      <div
        v-for="album in albums"
        :key="album.albumId"
        class="exchange__card"
        @click="openAlbum(album.albumId)"
      >
        <div class="exchange__card-content">
          <h3 class="exchange__card-title">
            {{ album.albumName }}
          </h3>
          <p class="exchange__card-meta">
            {{ album.exchangeUsers }} exchange user
          </p>
        </div>

        <span class="exchange__card-arrow">→</span>
      </div>

      <div v-if="loading" class="exchange__empty exchange__empty--loading">
        Loading album...
      </div>

      <div v-else-if="!albums.length" class="exchange__empty">
        There are currently no exchanges possible
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
.exchange {
  max-width: 900px;
  padding: 2rem;
  min-height: 100svh;
}

/* Header */
.exchange__header {
  margin-bottom: 24px;
}

.exchange__title {
  margin-bottom: 4px;
}

.exchange__subtitle {
  color: #6b7280;
  font-size: 14px;
}

/* List */
.exchange__list {
  display: grid;
  gap: 12px;
}

/* Card */
.exchange__card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: background 0.2s ease;
}

.exchange__card:hover {
  background: #f8fbff;
}

.exchange__card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exchange__card-title {
  margin-bottom: 4px;
}

.exchange__card-meta {
  font-size: 14px;
  color: #6b7280;
}

.exchange__card-arrow {
  font-size: 22px;
}

/* Empty states */
.exchange__empty {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}

.exchange__empty--loading {
  opacity: 0.7;
}

/* Responsive */
@media (min-width: 480px) {
  .exchange__card {
    flex-direction: row;
    justify-content: space-between;
  }

  .exchange__card-content {
    align-items: flex-start;
  }
}
</style>
