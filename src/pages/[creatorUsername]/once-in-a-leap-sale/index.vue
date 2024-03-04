<template>
  <div class="explore-wrapper">
    <div>
      <CurationComponent v-for="curation in store.saleCurations.curations" :key="curation.id" :curation="curation"
        :categoryCuration="store.saleCurations.categoryCurations" />
    </div>
    <div class="target" ref="target"></div>
  </div>
</template>
  
<script setup>
import CurationComponent from "~/components/ExploreComponents/CurationComponent.vue";
import { addingObserver } from "~/utils/helperMethods";

definePageMeta({
  name: "HypdSale",
  layout: "public"
})
const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter()
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
  if (target.value) {
    observer.value = addingObserver(target.value, callback);
  }
});

useSeoMeta({
  title: `HYPD Sale • ${creatorStore.info?.name} `,
  ogTitle: `HYPD Sale • ${creatorStore.info?.name} `,
  twitterTitle: `HYPD Sale • ${creatorStore.info?.name} `,
  ogImage: `${creatorStore.info?.profile_image?.src || defaultProfileImage()}`,
  twitterImage: `${creatorStore.info?.profile_image?.src || defaultProfileImage()}`
})

async function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      if (store.saleCurations.curations?.length == 0) {
        await fetchExploreCurations();
      }
    }
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
      store.saveSaleCategoryCurations(categoryCatalogCuration.value);
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
    "show_on": "black_friday_sale",
    "page": store.saleCurations.page,
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
      store.saveSaleCurations(response.payload);
      store.updateSalePageCount(store.saleCurations.page + 1);
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