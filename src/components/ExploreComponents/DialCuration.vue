<template>
  <div class="dial-wrapper">
    <div
      @click="goToCuration(subCuration)"
      class="dial"
      v-for="subCuration in subCurations"
      :key="subCuration.id"
    >
      <img v-if="subCuration.image" :src="subCuration.image.src" alt="" />
      <span v-if="subCurationName(subCuration)" id="title">
        {{ subCurationName(subCuration) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  subCurations: Array,
  curation: Object,
});

const emit = defineEmits(["open"]);

function subCurationName(data) {
  if (data.name) {
    return data.name;
  } else if (data.dial_collections_info?.name) {
    return data.dial_collections_info.name;
  } else {
    return false;
  }
}
function goToCuration(subCuration) {
  emit("open", subCuration);
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .dial img {
    width: 90px !important;
    height: 90px !important;
  }
}
.dial-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 24px;

  padding: 0 16px 16px;
  overflow: auto hidden;
  box-sizing: border-box;
}

.dial-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.dial {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
}
.dial img {
  width: 110px;
  height: 110px;
  cursor: pointer;
}

span#title {
  color: var(--dark-purple, #13141b);
  text-align: center;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
  text-align: center;

  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  width: 90px;
}
</style>