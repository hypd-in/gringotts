<template>
  <section>
    <div class="brand-profile">
      <div class="display-picture">
        <img :src="getReplacedSource(brandStore.brandInfo?.cover_img?.src)" :alt="brandStore.brandInfo.name" />
      </div>
      <div class="name">
        {{ brandStore.brandInfo.name }}
      </div>
      <p class="bio" v-if="brandStore.brandInfo?.bio">
        {{ brandBio }}
        <span style="color: #fb6c23; cursor: pointer" @click="toggleBio"
          v-show="bioLength == 120 && brandStore.brandInfo.bio.length > 120">
          View More
        </span>
      </p>
    </div>
  </section>
  <section style="margin-bottom: 40px">
    <div style="border-top: 2px solid #0000001a">
      <h3>All Products</h3>
      <div class="product-listing-wrapper">
        <Product v-for="product in brandStore.products" :key="product?.id" :itemInfo="product" />
      </div>
      <div v-if="fetchingProducts" style="display: flex; justify-content: center">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div id="pagiation-footer"></div>
    </div>
  </section>
</template>

<script setup>
definePageMeta({
  name: "BrandProfile",
  layout: "public",
});
import { getBrandPageProducts } from "~/utils/globalAPIs";
import { getReplacedSource } from "~/utils/helperMethods.js";
import Product from "~/components/ProductComponents/ProductCard.vue";

const runtimeConfig = useRuntimeConfig();
const brandStore = useBrandProfileStore();
const route = useRoute();
const { data: brandInfo, pending: loadingBrandInfo } = await useFetch(
  runtimeConfig.public.entityURL +
  "/api/app/brand/username/" +
  route.params.brandUsername,
  {
    key: "brand_profile_info",
    methods: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);
brandStore.saveBrand(brandInfo.value.payload);

const bioLength = ref(120);
const filters = ref({});
const page = ref(0);
const receivedAllInfo = ref(false);
const observer = ref(null);
const fetchingProducts = ref(false);
const target = ref(null);
const callback = (entries) => {
  entries.forEach(async (entry) => {
    if (
      entry.isIntersecting &&
      !fetchingProducts.value &&
      !receivedAllInfo.value
    ) {
      if (brandStore.products.length > 0) {
        page.value += 1;
        await fetchProducts();
      }
    }
  });
};
const brandBio = computed(() => {
  if (bioLength.value == 120) {
    return brandStore.brandInfo.bio.substring(0, 120) + "...";
  }
  if (bioLength.value != 120) {
    return brandStore.brandInfo.bio.substring(0);
  }
});

const toggleBio = () => {
  bioLength.value = 0;
};
const fetchProducts = async () => {
  fetchingProducts.value = true;

  let body = {
    brand_ids: [brandStore.brandInfo.id],
    page: page.value,
    ...filters.value,
  };
  let response = await getBrandPageProducts(body);
  if (response.data.length > 0) {
    brandStore.addProducts(response.data);
  } else {
    receivedAllInfo.value = true;
  }
  fetchingProducts.value = false;
};

const addingObserver = (target_ele, callbackFn) => {
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };
  observer.value = new IntersectionObserver(callbackFn, options);
  return observer.value.observe(target_ele);
};
onBeforeMount(() => {
  if (
    route.params.brandUsername == brandStore.brandInfo.username &&
    brandStore.products.length == 0
  ) {
    fetchProducts();
  } else {
    console.log("else");
  }
  nextTick(() => {
    target.value = document.getElementById("pagiation-footer");
    if (target.value) {
      observer.value = addingObserver(target.value, callback);
    }
  });
});

useSeoMeta({
  ogtitle: () => brandInfo.value?.payload?.name,
  description: () => brandInfo.value?.payload?.bio,
  ogImage: () => brandInfo.value?.payload?.cover_img?.src,
  ogDescription: () => brandInfo.value?.payload?.bio,
  ogImage: () => brandInfo.value?.payload?.cover_img?.src,
  ogUrl: () => brandInfo.value?.payload?.website,
  twitterTitle: () => brandInfo.value?.payload?.name,
  twitterDescription: () => brandInfo.value?.payload?.bio,
  twitterImage: () => brandInfo.value?.payload?.cover_img?.src,
  twitterCard: "summary",
});
</script>

<style scoped>
section {
  padding: 0 16px;
  max-width: 980px;
  margin: 0 auto;
}

.product-listing-wrapper {
  padding: 0;
}

.brand-profile {
  display: grid;
  grid-template-columns: 150px 4fr;
  grid-template-rows: 29px 100%;
  column-gap: 30px;
  max-width: 630px;
  margin: 24px auto;
}

.display-picture {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  overflow: hidden;
  grid-row: 1 / span 2;
  border: 1px solid #d8d8d8;
}

.display-picture img {
  height: 100%;
  width: 100%;
}

.name {
  color: #13141b;
  font-size: 24px;
  font-family: Urbanist-ExtraBold;
}

.bio {
  font-family: Urbanist-Medium;
  line-height: 1.5;
  color: #a9a9a9;
  font-size: 14px;
  white-space: pre-line;
  max-width: 430px;
  grid-column: 2 / 2;
}

h3 {
  color: #13141b;
  font-family: Urbanist-Bold;
  text-align: center;
}

@media screen and (min-width: 0) and (max-width: 480px) {
  .brand-profile {
    grid-template-columns: 104px 4fr;
    grid-template-rows: 104px auto;
    /* grid-template-rows: 29px auto; */

    column-gap: 20px;
    row-gap: 8px;
    margin: 24px 0;
    align-items: center;
    margin: 20px 0 12px;
  }

  .display-picture {
    height: 104px;
    width: 104px;
    grid-row: unset;
  }

  .display-picture img {
    height: 100%;
    width: 100%;
  }

  .name {
    color: #13141b;
    font-size: 18px;
    font-family: Urbanist-ExtraBold;
  }

  .bio {
    font-family: Urbanist-Medium;
    line-height: 1.5;
    color: #a9a9a9;
    font-size: 14px;
    white-space: pre-line;
    max-width: 430px;
    grid-column: 2 / 2;
    margin: 0px 0;
    grid-column: 1 / span 2;
  }
}
</style>