<template>
  <section class="collection-page">
    <h1>My collections</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="albums.length === 0">You don't have collections.</div>

    <ul v-else class="collection-list">
      <li v-for="album in albums" :key="album._id" class="collection-card">
        <p class="collection-name">
          <strong>{{ album.title }}</strong> - {{ album.publisher }}
        </p>
        <router-link
          :to="{
            name: 'collection-details',
            params: { id: album._id },
            query: $route.query,
          }"
          class="collection-link"
        >
          My thumbnails
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "MyCollection",

  data() {
    return {
      albums: [],
      loading: true,
    };
  },

  mounted() {
    this.fetchUserCollections();
  },

  methods: {
    async fetchUserCollections() {
      try {
        const userRes = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Ne mogu da učitam usera");
        }

        const freshUser = await userRes.json();
        // upiši svežeg usera u localStorage
        localStorage.setItem("user", JSON.stringify(freshUser));

        const collectionAlbums = (freshUser.albums || []).map((item) =>
          String(item.albumId)
        );
        if (collectionAlbums.length === 0) {
          return;
        }

        console.log("Spisak albuma", collectionAlbums);
        const response = await fetch("/api/albums", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Neuspešno učitavanje albuma");
        }

        const allAlbums = await response.json();
        console.log(allAlbums);
        this.albums = allAlbums.filter((album) =>
          collectionAlbums.includes(String(album._id))
        );
      } catch (error) {
        console.error("Greška pri učitavanju kolekcije:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.collection-page {
  min-height: 100svh;
}

.collection-card {
  background: #fff;
  border-radius: 12px;
  margin: 10px 0;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.collection-link:hover {
  color: #ff7e00;
}

@media (min-width: 480px) {
  .collection-card{
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
