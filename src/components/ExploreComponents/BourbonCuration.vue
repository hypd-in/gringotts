<template>
  <div class="bourbon-wrapper" v-if="subCurations.length > 0">
    <div class="bourbon" v-for="subCuration in subCurations" :key="subCuration.id" @click="goToCuration(subCuration)">
      <img :src="getReplacedSource(subCuration.image.src)" alt="" />
    </div>
  </div>
</template>

<script setup>
import { getReplacedSource } from '~/utils/helperMethods';

const props = defineProps({
  subCurations: Array,
  curation: Object,
});

const emit = defineEmits(["open"]);

function goToCuration(subCuration) {
  emit("open", subCuration);
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .bourbon-wrapper {
    gap: 16px !important;
  }

  .bourbon img {
    min-width: calc(100dvw - 64px) !important;
  }
}

.bourbon-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 32px;

  overflow: auto hidden;
  padding: 0 16px 16px;
  box-sizing: border-box;
}

.bourbon-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.bourbon img {
  cursor: pointer;
  width: 279px;
  object-fit: cover;
  border-radius: 16px;
}
</style>