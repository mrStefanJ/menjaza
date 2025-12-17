// src/router/index.js

import { createWebHistory, createRouter } from "vue-router";

import LoginView from "@/Login.vue";
import RegisterView from "@/Register.vue";
import HomeView from "@/pages/Home.vue";
import ContactView from "@/pages/Contact.vue";
import HelpView from "@/pages/Help.vue";
import ExchangeView from "@/pages/Exchange.vue";
import AlbumView from "@/pages/Albums/Albums.vue";
import AlbumDetailView from "@/pages/Albums/AlbumDetail.vue";
import MessageView from "@/pages/Message.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/home", component: HomeView, meta: { requiresAuth: true } }, // <-- Protected
  { path: "/contact", component: ContactView, meta: { requiresAuth: true } },
  { path: "/help", component: HelpView, meta: { requiresAuth: true } },
  { path: "/exchange", component: ExchangeView, meta: { requiresAuth: true } },
  { path: "/albums", component: AlbumView, meta: { requiresAuth: true } },
  { path: "/album/:id", name: "album-details", component: AlbumDetailView, props: true, meta: { requiresAuth: true } },
  { path: "/message", component: MessageView, meta: { requiresAuth: true }}
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Touter guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    return next("/");
  }
  if ((to.path === "/" || to.path === "/register") && token) {
    return next("/home");
  }
  next();
});
