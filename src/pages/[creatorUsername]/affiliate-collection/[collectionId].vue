<template>
  <div class="curation-wrapper">
    <div class="sub-header">
      <div class="journey-path">
        <span @click="gotoStore">
          <ImageFrame  style="width: 32px; height: 32px; border-radius: 50%; margin-right: 6px" :alt="creatorStore.info.name"
           :src="creatorStore.info?.profile_image?.src" />
          {{ creatorStore.info.name }} / Collections / &nbsp;
        </span>

        <!-- <ImageFrame width="32" height="32" style="border-radius: 6px; margin-right: 6px; object-fit: cover;" :src="collectionInfo.image.src" /> -->
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
        <div class="pagination-target" ref="target"></div>
      </div>
    </div>
  </div>
</template>

<script setup>

import ProductCard from '~/components/ProductComponents/ProductCard.vue';
import ImageFrame from '~/components/ImageFrame.vue';

definePageMeta({
  name: "AffiliateCollection",
  layout: "public"
})

const route = useRoute();
const router = useRouter()
const creatorStore = useCreatorStore();
const collectionInfo = ref({});
const linkIds = ref(null);
const target = ref(null);
const observer = ref(null);
const catalogsSent = ref(0);
const totalNoOfLinks = ref(0);

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
    if (collectionInfo.value?.influencer_link_ids?.length > 0) {
      totalNoOfLinks.value = collectionInfo.value?.influencer_link_ids?.length;
      linkIds.value = [...collectionInfo.value?.influencer_link_ids];
    }
  } else if (error) {
    console.log("Error fetching collection info", err);
  }
}

useSeoMeta({
  title: `${collectionInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  ogTitle: `${collectionInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  twitterTitle: `${collectionInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  description: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  twitterDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogImage: collectionInfo.value?.img?.src,
  twitterImage: collectionInfo.value?.img?.src,
  twitterCard: "summary",
  lang: "en-IN"
})

function gotoStore() {
  router.replace({
    name: "CreatorStore",
    creatorUsername: creatorStore.info.username
  })
}

function callback(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fetchCatalogInfo();
    }
  });
}

async function fetchCatalogInfo() {
  try {
    var ids = [];
    var maxLimit = 20;
    if (totalNoOfLinks.value < 20) {
      maxLimit = totalNoOfLinks.value;
    }
    for (let i = catalogsSent.value; i < catalogsSent.value + maxLimit; i++) {
      ids.push(linkIds.value[i]);
      totalNoOfLinks.value -= 1;
    }
    var response = await $fetch(`${useRuntimeConfig().public.catalogURL}/api/app/influencer/collection/deeplinks/ids`, {
      method: "POST",
      credentials: "include",
      body: {
        ids: [...ids]
      },
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (response.payload) {
      collectionProducts.value = [...response.payload];
      catalogsSent.value += maxLimit;
    }
    if (totalNoOfLinks.value < 1) {
      observer.value.unobserve(target.value);
    };
  }
  catch (error) {
    console.log("Error fetching catalog info", error);
  }
}

onMounted(() => {
  if (target.value) {
    observer.value = addingObserver(target.value, callback);
  }
})
</script>


<style scoped>
@media only screen and (max-width: 520px) {
  .sub-header {
    display: none;
  }

  h2 {
    display: none !important;
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

.journey-path span{
  display: flex;
  align-items: center;
}
.journey-path {
  cursor: pointer;
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
}
</style>