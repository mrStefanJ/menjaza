<template>
  <button
    v-show="visible"
    class="scroll-to-top"
    @click="scrollToTop"
    aria-label="Scroll to top"
  >
    ↑
  </button>
</template>

<script>
export default {
  name: "ScrollToTop",

  data() {
    return {
      visible: false,
    };
  },

  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },

  methods: {
    onScroll() {
      this.visible = window.scrollY > 300;
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style>
.scroll-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #111;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 1000;
}

.scroll-to-top:hover {
  opacity: 1;
  transform: translateY(-2px);
}
</style>
