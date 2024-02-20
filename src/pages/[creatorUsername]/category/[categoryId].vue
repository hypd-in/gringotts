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
       <span v-if="route.query.title" style="color: #000">{{
          route.query.title }}</span>
      </div>
    </div>

    <div class="curation-container">
      <div class="curation-products">
        <h2 class="heading">{{ route.query.title }}</h2>
        <div class="product-listing-wrapper" v-if="products?.length > 0">
          <ProductCard v-for="product in products" :key="product?.id" :itemInfo="product" />
        </div>
      </div>
      <div class="pagination-target" ref="target"></div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "~/components/ProductComponents/ProductCard"
import ImageFrame from "~/components/ImageFrame.vue";

definePageMeta({
  name: "CategoryCuration",
  layout: "default",
})
const creatorStore = useCreatorStore();
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter()

const categoryInfo = ref({});
const target = ref(null);
const observer = ref(null);
const pageCount = ref(0);
const products = ref([]);

if (route.params.categoryId) {
  const { data: response, error } = await useFetch(`${config.public.catalogURL}/api/categories`, {
    method: "POST",
    body: {
      id: [route.params.categoryId], 
    },
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  })
  if (response) {
    categoryInfo.value = {...response.value.payload[0]}
  } else if (error) {
    console.log("Error fetching category info", err);
  }
}

async function fetchCollectionInfo() {
  try {
    var response = await $fetch(`${config.public.catalogURL}/api/catalog/category`, {
      method: "POST",
      body: {
        category_lvl3: [route.params.categoryId],
        page: pageCount.value,
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
    pageCount.value++;
    if (response.payload?.data) {
      categoryInfo.value = { ...response.payload };
      products.value = [...products.value, ...response.payload.data];
    } else {
      observer.value.unobserve(target.value);
    }
  } catch (error) {
    console.log("Error fetching catalog info", error);
  }
}

useSeoMeta({
  title: `${categoryInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  ogTitle: `${categoryInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  twitterTitle: `${categoryInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  description: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  twitterDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogImage: categoryInfo.value?.img?.src,
  twitterImage: categoryInfo.value?.img?.src,
  twitterCard: "summary",
  lang: "en-IN"
})

function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      await fetchCollectionInfo();
    }
  });
}

function gotoStore() {
  router.replace({
    name: "CreatorStore",
    creatorUsername: creatorStore.info.username
  })
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