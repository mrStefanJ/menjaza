<template>
  <section class="collections">
    <h1>Moja kolekcija</h1>

    <div v-if="loading">Učitavanje...</div>
    <div v-else-if="albums.length === 0">Nema albuma u kolekciji.</div>

    <ul v-else class="collection-list">
      <li v-for="album in albums" :key="album._id">
        <p>
          <strong>{{ album.title }}</strong> – {{ album.artist }}
        </p>
        <router-link
          :to="{
            name: 'collection-details',
            params: { id: album._id },
            query: $route.query,
          }"
          class="collection-link"
        >
          Moje slicice
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

  .collection-list li {
        display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .collection-list li a:hover {
    color: #ff7e00;
  }
</style>