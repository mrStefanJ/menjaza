<template>
  <section class="home">
    <h1 class="home__title">Dobrodošli !!!</h1>

    <div class="home__content">
      <div class="home__description">
        menjaza.rs je prva domaća stranica namenjena razmeni sličica za albume.
        Nastala je kao pokušaj da se sakupljanje sličica pojednostavi, kako bi uz
        druženje lakše i brže popunili albume sa sličicama. Korišćenje stranice je
        potpuno besplatno. Samo je potrebno da kreirate svoj nalog, popunite podatke
        o sličicama koje nudite i onima koje tražite. Sistem vam automatski nudi
        moguće razmene i omogućuje da stupite u kontakt sa korisnikom koji ima
        sličice koje vam nedostaju i sa njim dogovorite detalje oko razmene.
        Pozovite svoje komšije, prijatelje, rođake. Što nas je više, lakše i brže
        ćemo se menjati.
      </div>

      <div class="home__users">
        <h3 class="home__users-title">Novi članovi</h3>

        <ul v-if="users.length" class="home__users-list">
          <li
            v-for="user in users"
            :key="user._id"
            class="home__users-item"
          >
            <span class="home__users-date">
              {{ formatDate(user.createdAt) }}
            </span>
            <span class="home__users-name">
              {{ user.userName }}
            </span>
          </li>
        </ul>

        <p v-else class="home__users-empty">Nema korisnika</p>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  name: "Dashboard",

  data() {
    return {
      users: [],
      error: null,
    }
  },

  mounted() {
    this.fetchAllUsers();
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return "";

      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    },
    async fetchAllUsers() {
      try {
        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        this.users = await response.json();
        console.log(this.users);
      } catch (err) {
        console.error(err);
        this.error = err.message;
      }
    }
  }
}
</script>

<style>
 /* ===== BLOCK: home (mobile first) ===== */

.home {
  padding: 1rem;
}

.home__title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.home__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Description */

.home__description {
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Users */

.home__users {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.home__users-title {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.home__users-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.home__users-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.4rem 0;
}

.home__users-date {
  color: #777;
}

.home__users-name {
  font-weight: 600;
}

.home__users-empty {
  font-size: 0.9rem;
  color: #999;
}

/* ===== TABLET & UP ===== */

@media (min-width: 480px) {
  .home__content {
    flex-direction: row;
    gap: 2rem;
  }

  .home__description {
    flex: 2;
  }

  .home__users {
    flex: 1;
    border-top: none;
    padding-top: 0;
  }

  .home__users-list {
    padding: 10px;
    border: 1px solid #999;
  }
}

/* ===== DESKTOP & UP ===== */

@media (min-width: 768px) {
  .home {
    padding: 2rem;
  }

  .home__title {
    font-size: 1.8rem;
  }
}

</style>