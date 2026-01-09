<template>
  <section class="chat-page">
    <!-- HEADER -->
    <header class="chat-header">
      <button class="back" @click="$router.back()">←</button>

      <div class="chat-user">
        <div class="avatar">{{ otherUserInitial }}</div>
        <div>
          <strong>{{ otherUserName }}</strong>
          <span class="status">Online</span>
        </div>
      </div>
    </header>

    <!-- MESSAGES -->
    <div ref="messagesEl" class="messages">
      <div
        v-for="msg in messages"
        :key="msg._id"
        class="message"
        :class="{ mine: msg.sender === myUserId }"
      >
        <div class="bubble">
          {{ msg.text }}
        </div>

        <div class="time">
          {{ formatDate(msg.createdAt) }}
        </div>
      </div>
    </div>

    <!-- INPUT -->
    <form class="chat-input" @submit.prevent="send">
      <input
        v-model="text"
        type="text"
        placeholder="Napiši poruku…"
        autocomplete="off"
      />
      <button :disabled="!text.trim()">➤</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

/* ROUTE */
const route = useRoute();
const albumId = route.params.albumId;
const otherUserId = route.params.userId;

/* AUTH */
const token = localStorage.getItem("token");
const myUserId = JSON.parse(atob(token.split(".")[1])).id;

/* STATE */
const chatId = ref(null);
const messages = ref([]);
const text = ref("");
const messagesEl = ref(null);

/* UI (kasnije možeš iz API-ja) */
const otherUserName = "Korisnik";
const otherUserInitial = "K";

/* SOCKET */
const socket = io("/", {
  auth: { token },
});

/* INIT */
onMounted(async () => {
  await initChat();
  if (!chatId.value) return;

  await loadMessages();
  joinSocket();
});

/* CLEANUP */
onUnmounted(() => {
  socket.disconnect();
});

/* API */
const initChat = async () => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: otherUserId,
      albumId,
    }),
  });

  const chat = await res.json();
  chatId.value = chat._id;
};

const loadMessages = async () => {
  const res = await fetch(`/api/chat/${chatId.value}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  messages.value = await res.json();
};

/* SOCKET HANDLERS */
const joinSocket = () => {
  socket.emit("join-chat", chatId.value);

  socket.on("new-message", (msg) => {
    messages.value.push(msg);
  });
};

/* SEND MESSAGE */
const send = () => {
  if (!text.value.trim()) return;

  socket.emit("send-message", {
    chatId: chatId.value,
    text: text.value,
    userId: myUserId,
  });

  text.value = "";
};

/* AUTO SCROLL */
watch(messages, async () => {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
});

/* DATE FORMAT */
const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
/* PAGE */
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

/* HEADER */
.chat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.back {
  font-size: 1.2rem;
  background: none;
  border: none;
  cursor: pointer;
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4f46e5;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status {
  display: block;
  font-size: 0.75rem;
  color: #22c55e;
}

/* MESSAGES */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 75%;
}

.message.mine {
  align-self: flex-end;
}

.bubble {
  padding: 0.6rem 0.8rem;
  border-radius: 14px;
  background: #e5e7eb;
  font-size: 0.9rem;
}

.message.mine .bubble {
  background: #4f46e5;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.time {
  font-size: 0.65rem;
  color: #6b7280;
  margin-top: 2px;
  align-self: flex-end;
}

.message.mine .time {
  color: #6b7280;
}

/* INPUT */
.chat-input {
  display: flex;
  padding: 0.5rem;
  background: #fff;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 0.6rem 0.75rem;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
}

.chat-input button {
  margin-left: 0.5rem;
  width: 42px;
  border-radius: 50%;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
}

.chat-input button:disabled {
  opacity: 0.5;
}

/* DESKTOP */
@media (min-width: 768px) {
  .chat-page {
    max-width: 700px;
    margin: 0 auto;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
}
</style>
