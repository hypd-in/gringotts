<template>
  <div class="category-wrapper">
    <div
      @click="goToCuration(category)"
      class="category"
      v-for="category in subCurations"
      :key="category.id"
    >
      <img
        v-if="category.thumbnail"
        :src="getReplacedSource(category.thumbnail.src)"
        alt=""
      />
    </div>
  </div>
</template>

<script setup>
import { getReplacedSource } from '~/utils/helperMethods';

const emit = defineEmits(["open"]);
const props = defineProps({
  subCurations: Array,
  curation: Object,
});

function goToCuration(category) {
  emit("open", category);
}
</script>

<style scoped>
.category-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 16px;
  padding: 0 16px 16px;
  box-sizing: border-box;
  overflow: auto hidden;
}

.category-wrapper::-webkit-scrollbar {
  height: 0;
  width: 0;
}

.category img {
  width: 134px;
  height: 187px;
  border-radius: 16px;
  cursor: pointer;
}
</style>
