<template>
  <div class="search-wrapper">
    <h2>Search Results For "{{ route.query?.query }}"</h2>
    <div class="product-listing" v-if="products.length > 0">
      <Product src="search" v-for="product in products" :key="product?.id" :itemInfo="product" origin="hypd-explore"
        source="searched-product" />
    </div>
  </div>
</template>

<script setup>
import Product from "~/components/ProductComponents/ProductCard.vue";
const props = defineProps({
  products: Array,
});
const route = useRoute();
const store = useStore();

const searchQuery = computed(() => {
  return route.query.query;
});
onMounted(() => {
  trackingSearch(searchQuery.value.trim(), route.params.creatorUsername);
})
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .product-listing {
    display: grid;
    grid-template-columns: repeat(auto-fill,
        minmax(calc(50dvw - 32px), 1fr)) !important;
    gap: 16px !important;
    padding: 0 16px 16px !important;
  }
}

h2 {
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 0.2px;
  margin: 0;
  padding: 16px;
}

.product-listing {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  justify-items: center;
  gap: 32px;
  padding: 20px 16px 16px;
}
</style>