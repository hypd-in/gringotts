<template>
  <div class="trending-searches">
    <div class="heading">Trending Searches</div>
    <div class="trending-search-container" :style="{
      'grid-template-columns': `repeat(${Math.ceil(
        trendingSearches.length / 4
      )}, minmax(min-content, 200px))`,
    }">
      <div class="trending-search" v-for="(trendingSearch, index) in trendingSearches" :key="trendingSearch.id"
        v-show="index < 12" @click="goToThisSearchQuery(trendingSearch.value)">
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_62_1134)">
            <path d="M15.3346 4.5L9.0013 10.8333L5.66797 7.5L0.667969 12.5" stroke="#DDDDDD" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.332 4.5H15.332V8.5" stroke="#DDDDDD" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_62_1134">
              <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
            </clipPath>
          </defs>
        </svg>

        {{ trendingSearch.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits([
  'goToSearch'
])
const trendingSearches = ref([
  {
    id: 0,
    name: "Liquid lipstick",
    value: "Liquid lipstick",
  },
  {
    id: 1,
    name: "Trousers",
    value: "Trousers",
  },
  {
    id: 2,
    name: "Pants",
    value: "Pants",
  },
  {
    id: 3,
    name: "Facewash",
    value: "Facewash",
  },
  {
    id: 4,
    name: "Perfume",
    value: "Perfume",
  },
  {
    id: 5,
    name: "Lip balm",
    value: "Lip balm",
  },
  {
    id: 6,
    name: "Moisturiser",
    value: "Moisturiser",
  },
  {
    id: 7,
    name: "Kits & Combos",
    value: "Kits & Combos",
  },
  {
    id: 8,
    name: "Dress",
    value: "Dress",
  },
  {
    id: 9,
    name: "Joggers",
    value: "Joggers",
  },
  {
    id: 10,
    name: "Sneakers",
    value: "Sneakers",
  },
  {
    id: 11,
    name: "Boots",
    value: "Boots",
  },
  {
    id: 12,
    name: "Heels",
    value: "Heels",
  },
  {
    id: 13,
    name: "Eye shadow",
    value: "Eye shadow",
  },
  {
    id: 14,
    name: "Lipstick",
    value: "Lipstick",
  },
  {
    id: 15,
    name: "Jacket",
    value: "Jacket",
  },
  {
    id: 16,
    name: "Hoodie",
    value: "Hoodie",
  },
  {
    id: 17,
    name: "Oversized t-shirt",
    value: "Oversized t-shirt",
  },
  {
    id: 18,
    name: "Tshirt",
    value: "Tshirt",
  },
  {
    id: 19,
    name: "Crop top",
    value: "Crop top",
  },
  {
    id: 20,
    name: "Serum",
    value: "Serum",
  },
  {
    id: 21,
    name: "Tops",
    value: "Tops",
  },
])

function goToThisSearchQuery(query) {
  console.log(query);
  emits("goToSearch", query)
}

onMounted(() => {
  trendingSearches.value.sort(() => Math.random() - 0.5);
})
</script>

<style scoped>
.heading {
  font-family: "Urbanist-SemiBold";
  font-size: 16px;
  line-height: 24px;
  color: #13141b;
  letter-spacing: 0.2px;
  padding: 16px 16px 0;
}

.trending-search-container {
  display: grid;
  box-sizing: border-box;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  overflow: auto hidden;
  width: 100%;
  padding: 16px 16px 0;
}

.trending-search-container::-webkit-scrollbar {
  height: 0px;
}

.trending-search {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;

  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: 'Urbanist-Medium';

  cursor: pointer;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 12px 16px;

  max-width: 200px;
  user-select: none;
}
</style>