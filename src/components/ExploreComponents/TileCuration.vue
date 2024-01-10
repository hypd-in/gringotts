<template>
  <div class="tile-wrapper">
    <div
      @click="goToCuration(subCuration)"
      class="tile"
      v-for="subCuration in subCurations"
      :key="subCuration.id"
    >
      <img
        v-if="subCuration.image"
        :src="getReplacedSource(subCuration.image.src)"
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

function goToCuration(subCuration) {
  emit("open", subCuration);
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .tile-wrapper {
    display: grid !important;
    grid-template-columns: repeat(2, calc(100% / 2)) !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 3px !important;
  }
  .tile img {
    border-radius: 0 !important;
    max-width: 100% !important;
  }
}
.tile-wrapper {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
  padding: 0 16px 16px;
  box-sizing: border-box;
}

.tile {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 170px;
  border-radius: 16px;
  cursor: pointer;
}
</style>