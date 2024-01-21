<template>
  <div class="collections">
    <CollectionComponent v-for="collection in creatorStore.collectionInfo.collections" :key="collection.id" :item="collection" />
    <div class="target" ref="target"></div>
  </div>
</template>

<script setup>
definePageMeta({
  name: "CreatorCollections",
});

import CollectionComponent from '~/components/CollectionComponent.vue';
import { addingObserver } from "~/utils/helperMethods";

const collectionPage = ref(0)
const collections = ref([])
const target = ref();
let observer


const runtimeConfig = useRuntimeConfig()
const creatorStore = useCreatorStore()

async function getCollections() {
  try {
    let response = await $fetch(runtimeConfig.public.catalogURL + "/api/app/influencer/collections/active", {
      query: {
        influencer_id: creatorStore.info.id,
        page: collectionPage.value,
        collection_type: 'affiliate'
      },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',

    })
    if (response.payload) {
      collectionPage.value++
      collections.value = [...collections.value, ...response.payload]

      creatorStore.saveCollections(collections.value)
      creatorStore.saveCollectionPage(collectionPage.value)
    }
    else if (response.payload == null) {
      if (observer && target.value) {
        observer.unobserve(target.value);
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

async function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      getCollections()
    }
  });
}

onMounted(() => {
  if (creatorStore.collectionInfo.collections) {
    collectionPage.value = creatorStore.collectionInfo.page
    collections.value = [...creatorStore.collectionInfo.collections]
  }

  if (target.value) {
    observer = addingObserver(target.value, callback);
  }
})

</script>

<style scoped>
.collections {
  min-height: calc(100dvh - 334px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(283px, 1fr));
  gap: 15px;
  row-gap: 16px;
  padding-bottom: 20px;
  justify-items: center;
  max-width: 980px;
  margin: 16px 0 0 0;
  width: 100dvw;
}
</style>