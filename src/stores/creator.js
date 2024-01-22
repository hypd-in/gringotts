import { defineStore } from "pinia";

export const useCreatorStore = defineStore("creator", () => {
  const info = ref({});

  const collectionInfo = ref({
    collections: [],
    page: 0,
  });
  const spotlight = ref([]);

  function saveCreatorInfo(creatorInfo) {
    info.value = { ...creatorInfo };
  }

  function saveCollections(collections) {
    collectionInfo.value.collections = [...collections];
  }
  function saveCollectionPage(page) {
    collectionInfo.value.page = page;
  }

  function saveSpotlight(products) {
    spotlight.value = [...products];
  }

  return {
    info,
    collectionInfo,
    spotlight,
    saveCollections,
    saveCollectionPage,
    saveSpotlight,
    saveCreatorInfo,
  };
});
