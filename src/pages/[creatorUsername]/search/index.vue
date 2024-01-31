<template>
  <div class="explore-wrapper">
    <section class="search-section">
      <div class="search-bar">
        <svg @click="goBack" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_593_6079)">
            <path d="M15.3333 8L1.33325 8" stroke="#13141B" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M1.33325 8C3.49992 7.33333 4.83325 6 5.33325 4" stroke="#13141B" stroke-width="1.5"
              stroke-linecap="round" />
            <path d="M1.33325 8C3.49992 8.66667 4.83325 10 5.33325 12" stroke="#13141B" stroke-width="1.5"
              stroke-linecap="round" />
          </g>
        </svg>

        <input @keydown.enter="search" type="text" v-model="searchQuery" placeholder="Search Brand, Products"
          autocomplete="off" />

        <svg v-if="searchQuery?.length > 0" @click="clearInput" class="clear" width="20" height="20" viewBox="0 0 20 20"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M13.5004 15.0006L9.99984 11.5001L6.50009 14.9998C6.08566 15.4143 5.41428 15.4143 5 15C4.58618 14.5862 4.58618 13.9148 5.00061 13.5004L8.50037 10.0006L4.99984 6.50009C4.58618 6.08643 4.58618 5.41382 5 5C5.41443 4.58557 6.08642 4.58619 6.50009 4.99985L10.0006 8.50037L13.5004 5.00061C13.9148 4.58619 14.5862 4.58618 15 5C15.4143 5.41427 15.4143 6.08566 14.9998 6.50009L11.5001 9.99985L15.0006 13.5004C15.4144 13.9142 15.4144 14.5856 15 15C14.5862 15.4138 13.9142 15.4144 13.5004 15.0006Z"
            fill="#342546" />
        </svg>
      </div>
    </section>

    <TrendingSearches v-if="store.searchProducts?.products?.length == 0" @goToSearch="search" class="trending-searches" />
    <SearchResults v-if="store.searchProducts.products?.length > 0" :products="store.searchProducts.products"
      :searchQuery="searchQuery" />

    <div v-else-if="!fetchingSearchResults &&
      store.searchProducts.products?.length == 0
      ">
      <CurationComponent v-for="curation in store.exploreCurations.curations" :key="curation.id" :curation="curation"
        :categoryCuration="store.exploreCurations.categoryCurations" />
    </div>

    <div class="target" ref="target"></div>
  </div>
</template>

<script setup>
import CurationComponent from "~/components/ExploreComponents/CurationComponent.vue";
import SearchResults from "~/components/ExploreComponents/SearchResults.vue";
import TrendingSearches from "~/components/ExploreComponents/TrendingSearches.vue";
import { addingObserver } from "~/utils/helperMethods";
// import { trackingSearch } from "@/eventTracking";

definePageMeta({
  name: "HypdExplore",
  layout: "public"
})
const config = useRuntimeConfig();
const route = useRoute();
const store = useStore();

const page = ref(0);
const exploreCurations = ref([]);
const categoryCatalogCuration = ref({});
const searchQuery = ref("");
const creatorStore = useCreatorStore();

const target = ref(null);
const observer = ref(null);
const fetchingSearchResults = ref(false);
// const oosItems = ref([]);

onMounted(() => {
  if (route.query.query == "") {
    store.resetSearchProducts();
  } else if (route.query.query !== "") {
    searchQuery.value = route.query.query;
  }
  if (target.value) {
    observer.value = addingObserver(target.value, callback);
  }
});

useSeoMeta({
  title: `HYPD Explore | ${creatorStore.info?.name} `
})
onBeforeRouteLeave((to, from) => {
  if (
    from.query.query?.length > 0 &&
    !["CreatorProduct", "HypdExplore", "CartItems"].includes(to.name)
  ) {
    return {
      name: "HypdExplore",
      params: from.params,
      query: {
        query: "",
      },
    };
  } else {
    return true;
  }
});

// onBeforeRouteUpdate(async (to, from) => {
//   if (to.query.query != from.query.query) {
//     searchQuery.value = to.query.query;
//     if (searchQuery.value?.trim() != "") {
//       store.resetSearchProducts();
//       await searchInput();
//     }
//   }
// });

onUpdated(async () => {
  if (route.query.query != searchQuery.value) {
    searchQuery.value = route.query.query;
    if (route.query.query?.trim() != '') {
      store.resetSearchProducts();
      await searchInput();
    }
  }
})

async function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      if (searchQuery.value?.length > 0) {
        await searchInput();
      } else {
        if (store.exploreCurations.curations?.length == 0) {
          await fetchExploreCurations();
        }
      }
    }
  });
}
async function search(query) {
  if (query?.length > 0) {
    searchQuery.value = query;
  }
  if (searchQuery.value.trim() != "") {
    // trackingSearch(searchQuery.value)
    await navigateTo({
      name: "HypdExplore",
      params: {
        creatorUsername: route.params.creatorUsername,
      },
      query: {
        query: searchQuery.value,
      },
      replace: true,
    });
    await searchInput();
  }
}

async function searchInput() {
  if (fetchingSearchResults.value) {
    return;
  }
  fetchingSearchResults.value = true;
  var params = {};
  if (searchQuery.value?.length > 0) {
    params = {
      "query": searchQuery.value.trim(),
    };
  }
  params = {
    ...params,
    "page": store.searchProducts.page,
  }
  await $fetch(`${config.public.catalogURL}/api/app/search/catalog`, {
    method: "GET",
    credentials: "include",
    query: params,
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    if (
      response.payload?.catalog &&
      response.payload.catalog?.length > 0
    ) {
      store.saveSearchProducts(response.payload.catalog);
      store.updateSearchPageCount(
        store.searchProducts.page + 1
      );
      fetchingSearchResults.value = false;
    } else {
      if (observer.value && target.value) {
        unobserveTarget();
      }
      fetchingSearchResults.value = false;
    }
  }).catch((err) => {
    console.log("Error fetching search", err);
  })
}

async function clearInput() {
  searchQuery.value = "";
  store.resetExploreCurations();
  await navigateTo({
    name: "HypdExplore",
    params: {
      creatorUsername: route.params.creatorUsername,
    },
    query: {
      search: "",
    },
    replace: true,
  });
}

async function goBack() {
  await navigateTo({
    name: "CreatorStore",
    params: { creatorUsername: route.params.creator_username },
    replace: true,
  });
}

async function getCategoryInfoById(subCollection, collectionId) {
  let formData = {
    id: [],
  };
  subCollection.forEach((item) => {
    formData["id"].push(item.lvl3_ids[0]);
  });
  await $fetch(`${config.public.catalogURL}/api/categories`, {
    method: "POST",
    credentials: "include",
    body: formData,
    headers: {
      "Content-Type": "application/json"
    }
  }).then((response) => {
    if (response.payload) {
      categoryCatalogCuration.value[collectionId] = response.payload;
      store.saveExploreCategoryCurations(categoryCatalogCuration.value);
    }
  }).catch((err) => {
    console.log("Error fetching category info", err);
  });
}
function unobserveTarget() {
  if (observer.value && target.value) {
    observer.value.unobserve(target.value);
  }
}

async function fetchExploreCurations() {
  var params = {};
  params = {
    "show_on": "ecommerce-collections",
    "page": store.exploreCurations.page,
  }

  await $fetch(`${config.public.catalogURL}/api/v2/app/collections`, {
    method: "GET",
    credentials: "include",
    query: params,
    headers: {
      "Content-Type": "application/json",
    }
  }).then(async (response) => {
    if (response.payload && response.payload.length > 0) {
      response.payload.forEach(async (curation) => {
        if (curation.type === "category" && curation.sub_type === "catalog") {
          await getCategoryInfoById(curation.sub_collections, curation.id);
        }
      });
      exploreCurations.value = [
        ...exploreCurations.value,
        ...response.payload,
      ];
      store.saveExploreCurations(response.payload);
      store.updateExplorePageCount(store.exploreCurations.page + 1);
    } else {
      if (observer.value && target.value) {
        unobserveTarget();
      }
    }
  }).catch((err) => {
    console.log("Error fetching Explore curations", err);
  })
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .search-section {
    display: block !important;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 72;
    background: var(--plain-white, #fff);
    width: calc(100dvw);
  }

  .desktop-header {
    display: none;
  }

  .explore-wrapper {
    margin: 0 auto !important;
  }
}

.title {
  padding: 16px;
}

h2 {
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 0.2px;
  margin: 0;
}

.explore-wrapper {
  max-width: 1180px;
  margin: 0 auto;
  height: calc(100% - 90px);
  padding: 0 0 32px !important;
}

.search-section {
  display: none;
  padding: 12px 16px;
  box-sizing: border-box;
}

.search-bar {
  gap: 16px;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  box-sizing: border-box;
  border: 1px solid var(--primary-border-color);
  border-radius: 12px;
  width: 100%;
}

input {
  background: none;
  outline: none;
  border: none;
  width: 100%;
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: 0.4px;
}

input::placeholder {
  color: #bebebe;
  font-family: Urbanist-Medium;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.4px;
}

.dial.curation-wrapper .sub-curation-wrapper img {
  width: 90px;
  height: 90px;
}

.dial.curation-wrapper .sub-curation#title {
  display: block;
  white-space: nowrap;
}

.sub-curation-wrapper {
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 16px;
}
</style>