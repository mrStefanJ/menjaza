<template>
  <div
    class="sticker-card"
    :class="{ active: checked }"
    @click="$emit('toggle')"
  >
    {{ number }}
  </div>
</template>

<script>
export default {
  props: {
    number: Number,
    checked: Boolean,
  },
};
</script>

<style scoped>
.sticker-card {
  width: 45px;
  height: 45px;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sticker-card.active {
  border-color: #42b883;
  background: #e8fff3;
}
</style>
