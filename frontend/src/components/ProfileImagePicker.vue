<template>
  <div class="profile-image-picker">
    <img :src="preview" alt="Avatar" />
    <label v-if="!readonly" class="upload-btn">
      Change image
      <input type="file" accept="image/*" @change="onChange" hidden />
    </label>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: File,
  imageUrl: String,
  fallback: {
    type: String,
    default: "/image/default-avatar.png",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const localFile = ref(null);

watch(
  () => props.imageUrl,
  () => {
    localFile.value = null;
  }
);

const preview = computed(() => {
  if (localFile.value) {
    return URL.createObjectURL(localFile.value);
  }
  if (props.imageUrl) {
    return props.imageUrl;
  }
  return props.fallback;
});

const onChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  localFile.value = file;
  emit("update:modelValue", file);
};
</script>

<style scoped>
.profile-image-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  width: 150px;
  color: #fff;
  background-color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.upload-btn:hover {
  background-color: #515050;
  border-color: #ff7e00;
  color: #ff7e00;
}

.upload-btn:active {
  background-color: #ddd;
}
</style>
