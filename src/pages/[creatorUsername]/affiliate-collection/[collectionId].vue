<template>
  <div class="curation-wrapper">
    <div class="sub-header">
      <div class="journey-path">
        <NuxtImg placeholder="[50, 25, 20, 10]" :alt="creatorStore.info.name" width="32" height="32" style="border-radius: 50%; margin-right: 6px" :src="creatorStore.info?.profile_image?.src" />
        {{ creatorStore.info.name }} / Collections / &nbsp;
        <!-- <NuxtImg width="32" height="32" style="border-radius: 6px; margin-right: 6px; object-fit: cover;" :src="collectionInfo.image.src" /> -->
        <span v-if="route.query.title" style="color: #000">{{
          collectionName }}</span>
      </div>
    </div>

    <div class="curation-container">
      <div class="curation-products">
        <h2 class="heading">{{ collectionName }}</h2>
        <div class="product-listing-wrapper" v-if="collectionProducts.length > 0">
          <ProductCard v-for="product in collectionProducts" :key="product?.id" :itemInfo="product" :isAffiliate="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from '~/components/ProductComponents/ProductCard.vue';
definePageMeta({
  name: "AffiliateCollection",
  layout: "public"
})

const route = useRoute();
const creatorStore = useCreatorStore();
const collectionInfo = ref({});
const collectionName = computed(() => {
  return collectionInfo.value?.name || route.query.title;
})
const collectionProducts = ref([]);
if (route.params.collectionId) {
  const { data: response, error } = await useFetch(`${useRuntimeConfig().public.catalogURL}/api/app/influencer/collection`, {
    method: "GET",
    credentials: "include",
    params: {
      id: route.params.collectionId,
    },
    headers: {
      "Content-Type": "application/json",
    }
  })
  if (response) {
    collectionInfo.value = { ...response.value.payload }
    console.log("HERE", collectionInfo.value);
    if (collectionInfo.value?.influencer_link_ids?.length > 0) {
      fetchCatalogInfo(collectionInfo.value.influencer_link_ids);
    }
  } else if (error) {
    console.log("Error fetching collection info", err);
  }
}

async function fetchCatalogInfo(linkIds) {
  await $fetch(`${useRuntimeConfig().public.catalogURL}/api/app/influencer/collection/deeplinks/ids`, {
    method: "POST",
    credentials: "include",
    body: {
      ids: [...linkIds]
    },
    headers: {
      "Content-Type": "application/json",
    }
  }).then((response) => {
    console.log(response.payload);
    if (response.payload) {
      collectionProducts.value = [...response.payload];
    }
  }).catch((error) => {
    console.log("Error fetching catalog info", error);
  })
}
</script>


<style scoped>
@media only screen and (max-width: 520px) {
  .sub-header {
    display: none;
  }

  h2 {
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
}

.curation-wrapper {
  position: relative;
}

h2 {
  margin: 0;
  display: none;
}</style>