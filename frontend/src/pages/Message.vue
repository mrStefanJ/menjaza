<template>
  <section class="chat-page">
    <header class="chat-header">
      <button class="back" @click="$router.back()">←</button>

      <div class="chat-user">
        <div class="avatar">{{ otherUserInitial }}</div>
        <div>
          <strong>{{ otherUserName }}</strong>
          <!-- <span class="status">Online</span> -->
        </div>
      </div>
    </header>

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
const otherUserName = route.query.userName || "Korisnik";
const otherUserInitial = otherUserName.charAt(0).toUpperCase();

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

<style>
@import "@/assets/message.css";
</style>
