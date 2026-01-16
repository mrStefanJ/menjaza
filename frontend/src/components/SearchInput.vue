<template>
  <div class="search-box">
    <input
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search...",
  },
});
</script>

<style scoped>
.search-box {
  margin-bottom: 16px;
}

.search-box input {
  width: 96%;
  padding: 10px 0;
  font-size: 14px;
}
</style>
