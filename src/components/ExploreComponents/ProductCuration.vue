<template>
  <div class="product-listing" v-if="products?.length > 0">
    <Product
      class="product"
      v-for="product in products"
      :key="product.id"
      :itemInfo="product"
      source="product-curation"
      origin="explore"
      :hideWishlist="true"
    />
  </div>
</template>

<script setup>
import Product from "../ProductComponents/ProductCard.vue";
const props = defineProps({
  subCurations: Array,
  curation: Object,
});

const products = computed(() => {
  return props.subCurations[0].catalog_info;
});
</script>

<style scoped>
.product-listing {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 0 16px 16px;
  box-sizing: border-box;
  overflow: scroll hidden;
}

.product-listing::-webkit-scrollbar {
  height: 0;
  width: 0;
}
.product {
  min-width: 180px;
}
</style>