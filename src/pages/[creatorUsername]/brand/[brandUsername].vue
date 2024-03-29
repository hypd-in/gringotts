<template>
  <div class="brand-wrapper">
    <ClientOnly>
      <section>
        <div class="brand-profile">
          <div class="display-picture" @click="trackClickBrandImg">
            <img :src="getReplacedSource(brandStore?.brandInfo?.cover_img?.src, 200)"
              :alt="brandStore?.brandInfo?.name" />
          </div>
          <div class="name">
            {{ brandStore?.brandInfo?.name }}
          </div>
          <div class="follow-section">
            <span @click="trackClickFollowers">
              <b style="font-family: Urbanist-Bold">{{
            !is_following
              ? brandStore.brandInfo?.followers_count || 0
              : brandStore.brandInfo?.followers_count || 0 + 1
          }}</b>
              Followers</span>
            <button @click="follow()" class="follow-btn" :class="{ active: is_following }">
              {{ is_following ? "Following" : "Follow" }}
            </button>
          </div>

          <p class="bio" v-if="brandStore.brandInfo?.bio">
            {{ brandBio }}
            <span style="color: #fb6c23; cursor: pointer" @click="toggleBio"
              v-show="bioLength == 120 && brandStore.brandInfo?.bio?.length > 120">
              View More
            </span>
          </p>
        </div>
      </section>

      <section style="margin-bottom: 40px">
        <div style="border-top: 2px solid #0000001a">
          <h3>All Products</h3>
          <div class="product-listing-wrapper" v-if="brandStore?.products?.length > 0">
            <Product v-for="product in brandStore.products" :key="product?.id" :itemInfo="product" src="brandPage" />
          </div>
          <div v-if="fetchingProducts" style="display: flex; justify-content: center">
            <div class="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </section>

      <FilterSortChip v-if="brandStore?.brandInfo" :source="true" :brand_id="brandStore.brandInfo.id"
        @openSorting="openSortFilter" @openFilters="openSortFilter" />

      <FilterSort v-if="showFilter" :filter_type="filter_type" :brand_id="brandStore.brandInfo.id"
        @applyFilterAndFetch="applyFilterAndFetch" @closeFilter="closeFilter" :filter="filters" />
    </ClientOnly>
    <div id="pagination-footer" ref="target"></div>
  </div>
</template>

<script setup>
import FilterSortChip from "~/components/SortFilterChip.vue";
import track from "~/utils/tracking-posthog";
import FilterSort from "~/components/FilterSort.vue";

definePageMeta({
  name: "BrandProfile",
  layout: "public",
});
import { getBrandPageProducts } from "~/utils/globalAPIs";
import { getReplacedSource } from "~/utils/helperMethods.js";
import Product from "~/components/ProductComponents/ProductCard.vue";

const runtimeConfig = useRuntimeConfig();
const brandStore = useBrandProfileStore();
const store = useStore();
const creatorStore = useCreatorStore();
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
const filter_type = ref("Category");
// const show_fliters = ref("");
const is_following = ref(false);
const bioLength = ref(120);
const filters = ref({});
const showFilter = ref(false);
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
      // if (brandStore.products?.length > 0) {
      await fetchProducts();
      // }
    }
  });
};
const follow = async () => {
  is_following.value = !is_following.value;
  track("brand:follow_button_click", {
    brand_id: brandInfo.value.payload?.id,
    creator_username: route.params?.creatorUsername,
  });
  let data = {
    customer_id: store.user.id,
    id: brandStore.brandInfo.id,
  };
  if (is_following.value) {
    await followBrand(data, "unfollow");
  } else {
    await followBrand(data, "follow");
  }
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
    page: brandStore.page,
    ...filters.value,
  };
  let response = await getBrandPageProducts(body);
  brandStore.addPage();
  if (response?.data?.length > 0) {
    var oosProducts = [];
    var inStockProducts = [];
    response.data.forEach((product) => {
      if (product.inventory_status == 'out_of_stock') {
        oosProducts.push(product);
      } else {
        inStockProducts.push(product);
      }
    });
    brandStore.addOosProducts(oosProducts);
    brandStore.addProducts(inStockProducts);
    if (response.data.length < 20) {
      brandStore.addProducts(brandStore.oosProducts);
      receivedAllInfo.value = true;
      brandStore.clearOosProducts();
    }
    if (oosProducts?.length == 20) {
      observer.value = addingObserver(target.value, callback);
    }
  } else {
    brandStore.addProducts(brandStore.oosProducts);
    receivedAllInfo.value = true;
    brandStore.clearOosProducts();
  }
  fetchingProducts.value = false;
};

const trackClickBrandImg = () => {
  track("brand:profile_image_click", {
    brand_id: brandInfo.value.payload?.id,
    creator_username: route.params?.creatorUsername,
  });
};
const trackClickFollowers = () => {
  track("brand:followers_click", {
    brand_id: brandInfo.value.payload?.id,
    creator_username: route.params?.creatorUsername,
  });
};
const closeFilter = () => {
  showFilter.value = false;
};
const openSortFilter = (type) => {
  showFilter.value = true;
  filter_type.value = type;
};
const applyFilterAndFetch = (filter) => {
  scrollTo(0, 0);
  brandStore.resetPage();
  brandStore.clearProducts();
  filters.value = filter;
  receivedAllInfo.value = false;
  fetchProducts();
  showFilter.value = false;
};

onMounted(() => {
  track("brand:visit", {
    brand_id: brandInfo.value?.payload?.id || "",
    creator_username: route?.params?.creatorUsername || "",
  });
  if (brandStore.products?.length > 0) {
    if (brandInfo.value.payload?.id !== brandStore?.products[0]?.brand_id) {
      brandStore.clearProducts();
      brandStore.resetPage();
    }
  }
  observer.value = addingObserver(target.value, callback);
});

useSeoMeta({
  title: `${brandInfo.value?.payload?.name} • ${creatorStore.info?.name} • HYPD`,
  ogtitle: `${brandInfo.value?.payload?.name} • ${creatorStore.info?.name} • HYPD`,
  description: brandInfo.value?.payload?.bio,
  ogDescription: brandInfo.value?.payload?.bio,
  ogImage: brandInfo.value?.payload?.cover_img?.src,
  ogUrl: brandInfo.value?.payload?.website,
  twitterTitle: `${brandInfo.value?.payload?.name} • ${creatorStore.info?.name} • HYPD`,
  twitterDescription: brandInfo.value?.payload?.bio,
  twitterImage: brandInfo.value?.payload?.cover_img?.src,
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
  grid-template-rows: 29px 32px calc(100% - 29px);
  column-gap: 30px;
  row-gap: 12px;
  max-width: 630px;
  margin: 24px auto;
}

.display-picture {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  overflow: hidden;
  grid-row: 1 / span 3;
  border: 1px solid #d8d8d8;
}

.follow-section {
  display: flex;
  font-size: 12px;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
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
  margin: 0;
}

h3 {
  color: #13141b;
  font-family: Urbanist-Bold;
  text-align: center;
}

.follow-btn {
  outline: none;
  border: 1px solid black;
  background: #fff;
  padding: 7px 12px;
  font-size: 12px;
  font-family: Urbanist-Bold;
  border-radius: 8px;
  color: #13141b !important;
}

.follow-btn.active {
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  color: #fff;
}

@media screen and (min-width: 0) and (max-width: 480px) {
  .brand-profile {
    grid-template-columns: 104px 4fr;
    grid-template-rows: 1fr 1fr auto;
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
    grid-row: 1 / span 2;
  }

  .display-picture img {
    height: 100%;
    width: 100%;
  }

  .name {
    color: #13141b;
    font-size: 18px;
    font-family: Urbanist-ExtraBold;
    align-self: end;
  }

  .follow-section {
    align-self: start;
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