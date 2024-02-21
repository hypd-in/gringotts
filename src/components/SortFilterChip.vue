<template>
  <div
    class="sort-filter-container"
    :class="{ 'brand-page-visiblity': source }"
  >
    <button class="sort" @click="openSorting">
      <SortIcon />
      <span>Sort By</span>
    </button>
    <div class="seperator"></div>
    <button class="filter" @click="openFilters">
      <FilterIcon />

      <span>Filters</span>
    </button>
  </div>
</template>

<script setup>
import SortIcon from "~/components/SVG/SortIcon.vue"
import FilterIcon from "~/components/SVG/FilterIcon.vue"
  const props = defineProps({
    source: {
        type: Boolean
    }
  })  
const emits = defineEmits(['openFilters','openSorting'])
const openSorting = () => {
      emits("openSorting", "Sort");
    }
const openFilters = () => {
      emits("openFilters", "Category");
    }

</script>

<style scoped>
.sort-filter-container {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  display: none;
}
.sort-filter-container button {
    cursor: pointer;
  padding: 0;
  background: inherit;
  border: none;
}
.brand-page-visiblity {
  display: grid;
}
.brand-page-visiblity button {
  display: flex;
}
.sort-filter-container {
  box-sizing: border-box;
  background: #342546;
  grid-template-columns: 80px 1px 80px;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  border-radius: 8px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 13;
}
.seperator {
  width: 1px !important;
  height: 14px !important;
  background: var(--plain-white);
  margin: 0;
  padding: 0;
}

.sort,
.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.sort span,
.filter span {
  font-family: "Urbanist-Regular";
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  color: var(--plain-white);
  white-space: nowrap;
  user-select: none;
}

.sort svg,
.filter svg {
  width: 16px;
  height: 16px;
}

@media (min-width: 320px) and (max-width: 480px) {
  .sort-filter-container {
    display: grid;
  }
}
</style>