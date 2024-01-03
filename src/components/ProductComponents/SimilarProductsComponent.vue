<template>
  <div class="similar-products-wrapper" v-if="products?.length > 0">
    <h3>Similar Products</h3>
    <div class="horizontal-listing">
      <ProductCard
        class="product-card"
        :itemInfo="product"
        origin="similar_products"
        source="product_page"
        v-for="product in products"
        :key="product.id"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from "~/components/ProductComponents/ProductCard.vue";

const route = useRoute();
const productStore = useProductStore();
const config = useRuntimeConfig();
const products = ref([]);

if (route.params.id) {
  console.log(route.params);
  const { data } = await useFetch(
    `${config.public.catalogURL}/api/app/catalog/similar`,
    {
      method: "GET",
      query: {
        query: route.params.id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (data.value.payload) {
    products.value = [...data.value.payload];
  }
}
</script>

<style scoped>
@media only screen and (max-width: 720px) {
  .similar-products-wrapper {
    margin: 4px 0 !important;
  }
}

.similar-products-wrapper {
  background: #fefefe;
  box-sizing: border-box;
  margin: 12px 0;
}
h3 {
  margin: 0;
  padding: 16px;
  color: #000;
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
}
.horizontal-listing {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  overflow: auto hidden;
  padding: 0 16px 16px;
}
.horizontal-listing::-webkit-scrollbar {
  height: 3px;
  width: 3px;
  background: #dedede;
}
.horizontal-listing::-webkit-scrollbar-thumb {
  background: var(--primary-dark);
}
.product-card {
  min-width: 160px;
}
</style>