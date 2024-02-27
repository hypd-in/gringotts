<template>
  <div class="curation-wrapper">
    <div class="sub-header">

      <div class="journey-path">
        <span @click="gotoStore">
          <ImageFrame :alt="creatorStore.info.name"
            style="width: 32px; height: 32px; border-radius: 50%; margin-right: 6px"
            :src="getReplacedSource(creatorStore.info?.profile_image?.src, 100)" />
          {{ creatorStore.info.name }} / Explore / &nbsp;
        </span>
        <span style="color: #000">{{ curationInfo.title }}</span>
      </div>
    </div>

    <div class="curation-container">
      <div class="curation-products">
        <h2 class="heading">{{ curationInfo.title }}</h2>
        <div class="product-listing-wrapper" v-if="products.length > 0">
          <ProductCard v-for="product in products" :key="product?.id" :itemInfo="product" />
        </div>
      </div>
      <div class="pagination-target" ref="target"></div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from '~/components/ProductComponents/ProductCard.vue';
import ImageFrame from '~/components/ImageFrame.vue';

definePageMeta({
  name: "CuratedCollection",
  layout: "default",
})
const config = useRuntimeConfig();
const creatorStore = useCreatorStore();
const route = useRoute();
const curationInfo = ref({});
const catalogIds = ref([]);
const totalNoOfCatalogs = ref(0);
const catalogsSent = ref(0);
const observer = ref(null);
const target = ref(null);
const products = ref([]);

const router = useRouter()

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
      totalNoOfCatalogs.value = curationInfo.value.sub_collections[0]?.catalog_ids.length;
      catalogIds.value = [...curationInfo.value.sub_collections[0]?.catalog_ids];
    }
  } else if (error) {
    console.log("Error fetching curation info");
  }
}

async function getCatalogInfo() {
  try {
    var params = new URLSearchParams();
    var maxLimit = 20;
    if (totalNoOfCatalogs.value < 20) {
      maxLimit = totalNoOfCatalogs.value
    }
    for (let i = catalogsSent.value; i < catalogsSent.value + maxLimit; i++) {
      params.append("id", catalogIds.value[i]);
      totalNoOfCatalogs.value -= 1;
    }
    if (params.size <= 0) {
      return;
    }
    var response = await $fetch(`${useRuntimeConfig().public.catalogURL}/api/app/catalog/basic?${params.toString()}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.payload) {
      products.value = [...products.value, ...response.payload]
      catalogsSent.value += maxLimit;
    }
    if (totalNoOfCatalogs.value < 1) {
      observer.value.unobserve(target.value);
    }
  }
  catch (err) {
    console.log("Errro fetching product Info", err);
  }
}

function callback(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      getCatalogInfo();
    }
  })
}

useSeoMeta({
  title: `${curationInfo.value.title} • ${creatorStore.info?.name} • HYPD`,
  description: `Shop from ${creatorStore.info?.name}'s collection, curated by HYPD`,
  ogTitle: `${curationInfo.value.title} • ${creatorStore.info?.name} • HYPD`,
  ogDescription: `Shop from ${creatorStore.info?.name}'s collection, curated by HYPD`,
  ogImage: `${creatorStore.info?.profile_image?.src}`,
  ogUrl: `https://www.hypd.store/${creatorStore.info?.username}`,
  twitterTitle: `${curationInfo.value.title} • ${creatorStore.info?.name} • HYPD`,
  twitterDescription: `Shop from ${creatorStore.info?.name}'s collection, curated by HYPD`,
  twitterImage: `${creatorStore.info?.profile_image?.src}`,
  twitterCard: 'summary'
})

function gotoStore() {
  router.replace({
    name: "CreatorStore",
    creatorUsername: creatorStore.info.username
  })
}


onMounted(async () => {
  if (target.value) {
    observer.value = addingObserver(target.value, callback);
  }
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
  padding: 16px;
}

h2 {
  display: none;
}
</style>