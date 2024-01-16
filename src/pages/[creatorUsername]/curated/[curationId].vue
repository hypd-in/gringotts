<template>
  <div class="curation-wrapper">
    <div class="sub-header">
      <div class="journey-path">
        <NuxtImg width="32" style="border-radius: 50%; margin-right: 6px" :src="creatorStore.info.profile_image.src" />
        {{ creatorStore.info.name }} / Explore / &nbsp; <span style="color: #000">{{ curationInfo.title }}</span>
      </div>
    </div>

    <div class="curation-container">
      <div class="curation-products">
        <h2 class="heading">{{ curationInfo.title }}</h2>
        <div class="product-listing-wrapper" v-if="products.length > 0">
          <ProductCard v-for="product in products" :key="product?.id" :itemInfo="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from '~/components/ProductComponents/ProductCard.vue';

definePageMeta({
  name: "CuratedCollection",
  layout: "default",
})
const config = useRuntimeConfig();
const creatorStore = useCreatorStore();
const route = useRoute();
const curationInfo = ref({});
const curationCatalogs = ref([]);
const products = ref([]);

if (route.params.curationId) {
  const { data: info, error } = await useFetch(`${config.public.catalogURL}/api/app/subcollection`, {
    method: "GET",
    credentials: "include",
    params: {
      id: route.params.curationId
    },
    headers: {
      "Content-Type": "application/json",
    }
  })
  if (info.value) {
    curationInfo.value = { ...info.value.payload };
    if (curationInfo.value.sub_collections[0]?.catalog_ids.length > 0) {
      await getCatalogInfo();
    }
  } else if (error) {
    console.log("Error fetching curation info");
  }
}

async function getCatalogInfo() {
  let ids = '';
  curationInfo.value.sub_collections[0]?.catalog_ids.forEach((id, index) => {
    ids += `${index == 0 ? '' : '&'}id=${id}`;
  });
  await $fetch(`${useRuntimeConfig().public.catalogURL}/api/app/catalog/basic?${ids}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.payload) {
      products.value = [...response.payload]
    }
  }).catch((err) => {
    console.log("Errro fetching product Info", err);
  })
}

useSeoMeta({
  title: `${curationInfo.value.title} | ${creatorStore.info?.name}`,
  description: `Shop from ${creatorStore.info?.name}'s collection, curated by HYPD`,
  ogTitle: `${curationInfo.value.title} | ${creatorStore.info?.name}`,
  ogDescription: `Shop from ${creatorStore.info?.name}'s collection, curated by HYPD`,
  ogImage: `${creatorStore.info?.profile_image?.src}`,
  ogUrl: `https://www.hypd.store/${creatorStore.info?.username}`,
  twitterTitle: `${curationInfo.value.title} | ${creatorStore.info?.name}`,
  twitterDescription: `Shop from ${creatorStore.info?.name}'s collection, curated by HYPD`,
  twitterImage: `${creatorStore.info?.profile_image?.src}`,
  twitterCard: 'summary'
})

onMounted(async () => {
  // await fetchCurationInfo();
});
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .sub-header {
    display: none;
  }

  .curation-container {
    padding: 0 !important;
  }

  h2 {
    font-family: Urbanist-SemiBold;
    font-size: 16px;
    position: fixed;
    top: 19px;
    left: calc(16px + 24px + 8px);
    z-index: 52;
    padding: 0 !important;
    margin: 0;
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

.sub-header {
  position: sticky;
  top: 72px;
  z-index: 52;
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
}

.curation-container {
  font-family: Urbanist-Bold;
  max-width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 16px;
}

h2 {
  display: none;
}
</style>