// src/router/index.js

import { createWebHistory, createRouter } from "vue-router";

import LoginView from "@/Login.vue";
import RegisterView from "@/Register.vue";
import HomeView from "@/pages/Home.vue";
import ContactView from "@/pages/Contact.vue";
import HelpView from "@/pages/Help.vue";
import ExchangeAlbumsView from "@/pages/Exchange/ExchangeAlbums.vue";
import ExchangeUserView from "@/pages/Exchange/ExchangeUser.vue";
import AlbumView from "@/pages/Albums/Albums.vue";
import AlbumDetailView from "@/pages/Albums/AlbumDetail.vue";
import MessageView from "@/pages/Message.vue";
import ProfileView from "@/pages/Profile/User.vue";
import CollectionsView from "@/pages/Collections/Collections.vue";
import CollectionDetailsView from "@/pages/Collections/CollectionDetails.vue";
import CollectionMissing from "@/pages/Collections/CollectionMissing.vue";
import CollectionOwned from "@/pages/Collections/CollectionOwned.vue";
import ExchangeMessage from "@/pages/Message.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/contact", component: ContactView, meta: { requiresAuth: true } },
  { path: "/help", component: HelpView, meta: { requiresAuth: true } },
  { path: "/exchange", name: "exchange", component: ExchangeAlbumsView, meta: { requiresAuth: true } },
  { path: "/exchange/:albumId", component: ExchangeUserView, meta: { requiresAuth: true } },
  {
    path: "/albums",
    name: "albums",
    component: AlbumView,
    meta: { requiresAuth: true },
  },
  {
    path: "/album/:id",
    name: "album-details",
    component: AlbumDetailView,
    props: true,
    meta: { requiresAuth: true },
  },
  // { path: "/message", component: MessageView, meta: { requiresAuth: true } },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/collections",
    name: "collections",
    component: CollectionsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/collections/:id",
    name: "collection-details",
    component: CollectionDetailsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/collection/:id/missing",
    name: "collection-missing",
    component: CollectionMissing,
    meta: { requiresAuth: true },
  },
  {
    path: "/collection/:id/owned",
    name: "collection-owned",
    component: CollectionOwned,
    meta: { requiresAuth: true },
  },
  {
  path: "/exchange/:albumId/chat/:userId",
  name: "exchange-chat",
  component: ExchangeMessage,
  meta: { requiresAuth: true },
}
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
