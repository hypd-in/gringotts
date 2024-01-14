<template>
  <div class="trending-curation-wrapper">
    <div
      v-for="curation in trendingCurations"
      :key="curation.id"
      class="trending-curation"
      @click="goToCuration(curation)"
    >
      <div class="overlay"></div>

      <img
        :src="getReplacedSource(curation.collection_featured_image.src)"
        alt=""
      />
      <p id="curation-name">{{ curation.collection_name }}</p>
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

const trendingCurations = computed(() => {
  return props.subCurations[0]?.trending_collections_info;
});

function goToCuration(subCuration) {
  emit("open", subCuration);
}
</script>

<style scoped>
.trending-curation-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 16px;
  overflow: auto hidden;
  padding: 0 16px 16px;
  box-sizing: border-box;
}

.trending-curation-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.trending-curation {
  position: relative;
  width: 238px;
  height: 238px;
  border-radius: 12px;
}

.trending-curation img {
  width: 238px;
  height: 238px;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
}
p#curation-name {
  margin: 0;
  position: absolute;
  bottom: 18px;
  left: 12px;
  z-index: 2;
  color: var(--plain-white, #fff);
  font-family: "Urbanist-Bold";
  width: 220px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.trending-curation .overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  content: "";
  top: 0;
  left: 0;
  z-index: 1;
  background: transparent
    linear-gradient(
      180deg,
      #00000000 0%,
      #0000000a 37%,
      #00000033 58%,
      #00000066 82%,
      #00000080 100%
    )
    0% 0% no-repeat padding-box;
}
</style>