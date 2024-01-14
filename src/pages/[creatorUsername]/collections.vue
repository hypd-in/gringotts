<template>
  <div class="collections">
    <CollectionComponent v-for="collection in collections" :key="collection.id" :item="collection" />
    <div class="observer-footer"></div>
  </div>
</template>

<script setup>
definePageMeta({
  name: "CreatorCollections",
});

import CollectionComponent from '~/components/CollectionComponent.vue';

const collectionPage = ref(0)
const collections = ref([])


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
      collections.value = [...collections.value, ...response.payload]
      console.log(collections.value)
    }
  }
  catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getCollections()
  setTimeout(() => {
    collectionPage.value++
    console.log("fuck", collectionPage.value)
  }, 1000);
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