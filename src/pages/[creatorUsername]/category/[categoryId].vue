<template>
  <div class="curation-wrapper">
    <div class="sub-header">
      <div class="journey-path">
        <NuxtImg width="32" style="border-radius: 50%; margin-right: 6px" :src="creatorStore.info.profile_image.src" />
        {{ creatorStore.info.name }} / Explore / &nbsp; <span v-if="route.query.title" style="color: #000">{{ route.query.title }}</span>
      </div>
    </div>

    <div class="curation-container">
      <div class="curation-products">
        <h2 class="heading">{{ route.query.title }}</h2>
        <div class="product-listing-wrapper" v-if="categoryInfo.data.length > 0">
          <ProductCard v-for="product in categoryInfo.data" :key="product?.id" :itemInfo="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "~/components/ProductComponents/ProductCard"
definePageMeta({
  name: "CategoryCuration",
  layout: "default",
})
const creatorStore = useCreatorStore();
const config = useRuntimeConfig();
const categoryInfo = ref({});
const pageCount = ref(0);
const route = useRoute();
if (route.params.categoryId) {
  await $fetch(`${config.public.catalogURL}/api/catalog/category`, {
    method: "POST",
    body: {
      category_lvl3: [route.params.categoryId],
      page: pageCount.value,
    },
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    if (response.payload) {
      categoryInfo.value = { ...response.payload };
    }
  }).catch((err) => {
    console.log(err);
  })
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .sub-header {
    display: none;
  }

  .curation-container{
    padding: 0 !important;
  }

  h2{
    font-family: Urbanist-SemiBold;
    font-size: 16px;
    position: fixed;
    top: 19px;
    left: calc(16px + 24px + 8px);
    z-index: 52;
    padding: 0 !important;
    display: block !important;
  }
}

.sub-header {
  background: #eeeeee;
  padding: 12px 16px;
  width: 100%;
  height: 56px;
  box-sizing: border-box;
}

.journey-path {
  max-width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  font-family: 'Urbanist-Medium';
  font-size: 12px;
  color: #a9a9a9;

  position: sticky;
  top: 0;
}

.curation-container {
  font-family: Urbanist-Bold;
  max-width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 16px;
}

h2 {
  margin: 0;
  display: none;
}
</style>