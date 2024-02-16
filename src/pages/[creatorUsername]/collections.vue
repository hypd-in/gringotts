<template>
  <div>
    <!-- loading -->
    <div class="center-loader" v-if="loading">
      <div class="small-rolling-spinner rolling-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <!-- empty data -->
    <div class="no-collections" v-else-if="!loading && collections.length == 0">
      <img src="@/assets/illustrations/no-orders.png" alt="">
      No collections found.
    </div>

    <!-- collections -->
    <div v-else-if="!loading && collections.length > 0" class="collections">
      <CollectionComponent src="creator-store-collections" v-for="collection in creatorStore.collectionInfo.collections"
        :key="collection.id" :item="collection" />
    </div>

    <div class="target" ></div>
  </div>
</template>

<script setup>

import CollectionComponent from '~/components/CollectionComponent.vue';
import { addingObserver } from "~/utils/helperMethods";
import track from '~/utils/tracking-posthog';

const collectionPage = ref(0)
const collections = ref([])
const target = ref();

const loading = ref(false)

let observer

const runtimeConfig = useRuntimeConfig()
const creatorStore = useCreatorStore()


async function getCollections() {
  if (collectionPage.value == 0) {
    loading.value = true
  }

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
      if (observer.value && target.value) {
        observer.value.unobserve(target.value);
      }
    }
    loading.value = false
  }
  catch (err) {
    loading.value = false
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
  
  target.value = document.querySelector('.target')

  if (creatorStore.collectionInfo.collections) {
    collectionPage.value = creatorStore.collectionInfo.page
    collections.value = [...creatorStore.collectionInfo.collections]
  }

  if (target.value) {
    observer = addingObserver(target.value, callback);
  }

  track('creator_store_collection:visit', {
    creator_name: creatorStore.info.name,
    creator_username: creatorStore.info.username,
  })
})

</script>

<style scoped>
.no-collections {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  font-family: Urbanist-Medium;
  font-size: 18px;
  height: 50vh;
}

.collections {
  min-height: calc(100dvh - 334px);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(283px, 1fr));
  gap: 15px;
  row-gap: 16px;
  padding-bottom: 20px;
  justify-items: center;
  max-width: 1180px;
  margin: 16px 0 0 0;
  width: 100dvw;
}
</style>