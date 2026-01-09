<template>
  <section class="exchange-page">
    <router-link
      :to="{ name: 'exchange', query: $route.query }"
      class="exchange-back"
      >← Back to exchange</router-link
    >
    <div class="exchange-header">
      <h1>Moguća razmena</h1>
      <p>Korisnici sa kojima možeš da se menjaš</p>
    </div>

    <div class="exchange-table-wrapper">
      <div class="exchange-grid">
        <div class="exchange-grid-header">
          <span>Korisnik</span>
          <span>Imam za njega</span>
          <span>Ima za mene</span>
          <span>Moguća razmena</span>
          <span></span>
        </div>

        <div v-for="user in exchanges" :key="user.userId" class="exchange-card">
          <div class="user-cell">
            <div class="avatar">
              {{ user.userName.charAt(0).toUpperCase() }}
            </div>
            <div>
              <strong>{{ user.userName }}</strong>
              <span>{{ user.city || "Nepoznato" }}</span>
            </div>
          </div>

          <div class="stat">
            <span class="label">Imam za njega</span>
            <span class="value">{{ user.haveForThem }}</span>
          </div>

          <div class="stat">
            <span class="label">Ima za mene</span>
            <span class="value">{{ user.haveForMe }}</span>
          </div>

          <div class="stat">
            <span class="label">Moguća razmena</span>
            <span class="badge success">{{ user.exchangeCount }}</span>
          </div>

          <div class="actions">
            <button class="btn-primary" @click="sendMessage(user)">
              Pošalji poruku
            </button>
          </div>
        </div>

        <div v-if="loading" class="empty">Učitavanje razmena...</div>

        <div v-else-if="!exchanges.length" class="empty">
          Trenutno nema mogućih razmena
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const exchanges = ref([]);
const albumId = route.params.albumId;
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch(`/api/exchange/${albumId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed");

    exchanges.value = await res.json();
  } catch (err) {
    console.error("Exchange users fetch error:", err);
    exchanges.value = [];
  } finally {
    loading.value = false;
  }
});

const sendMessage = (user) => {
  router.push({
    name: "exchange-chat",
    params: {
      albumId,
      userId: user.userId,
    },
  });
};

</script>

<style scoped>
  .exchange-page{
    min-height: 100svh;
  }
/* ===== GRID WRAPPER ===== */
.exchange-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ===== HEADER (desktop only) ===== */
.exchange-grid-header {
  display: none;
  font-weight: 600;
  color: #666;
}

/* ===== CARD ===== */
.exchange-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  background: #fff;
  padding: 1rem;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* user */
.user-cell {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.avatar {
  width: 42px;
  height: 42px;
  background: #4f46e5;
  color: #fff;
  border-radius: 50%;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-cell span {
  display: block;
  font-size: 0.8rem;
  color: #777;
}

/* stats */
.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat .label {
  font-size: 0.85rem;
  color: #666;
}

.stat .value {
  font-weight: 600;
}

/* badge */
.badge.success {
  background: #dcfce7;
  color: #166534;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

/* actions */
.actions {
  margin-top: 0.5rem;
}

.btn-primary {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  border: none;
  cursor: pointer;
}

/* empty */
.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* ===== DESKTOP ===== */
@media (min-width: 768px) {
  .exchange-grid {
    gap: 0;
    width: 760px;
  }

  .exchange-grid-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 2fr auto;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
  }

  .exchange-card {
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    align-items: center;
    border-radius: 0;
    box-shadow: none;
    border-bottom: 1px solid #eee;
  }

  .stat {
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .stat .label {
    display: none;
  }

  .btn-primary {
    width: auto;
  }
}
</style>
