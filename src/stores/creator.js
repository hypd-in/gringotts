import { defineStore } from "pinia";

export const useCreatorStore = defineStore("creator", () => {
  const info = ref({});

  const collectionInfo = ref({
    collections: [],
    page: 0,
  });
  const spotlight = ref([]);

  const creatorCollectionInfo = ref({
    catalogSent:0,
    products:[]
  });

  function saveCreatorCollection(info) {
    creatorCollectionInfo.value = {...info};
  }

  function saveCreatorInfo(creatorInfo) {
    if (creatorInfo && !creatorInfo?.profile_image) {
      creatorInfo["profile_image"] = { src: defaultProfileImage() };
    }

    // runs everytime we save a creator
    info.value = { ...creatorInfo };
    let creators = {};
    let cookie = useCookie("creators");

    // cookie = { ...cookie.value };

    // expiry
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    let expires = d;
    let path = "/";

    // check if there's cookie already
    if (cookie.value && Object.keys(cookie.value).length > 0) {
      creators = { ...cookie.value };
    }

    // check if creator exists in that cookie
    if (
      creatorInfo &&
      !creators[creatorInfo.id] &&
      creatorInfo?.id &&
      creatorInfo?.name &&
      creatorInfo?.username
    ) {
      creators[creatorInfo.id] = {
        id: creatorInfo?.id,
        name: creatorInfo?.name,
        username: creatorInfo?.username,
      };
    }

    cookie.value = { ...creators };
    // overwrite cookie
    useCookie("creators", {
      expires,
      path,
    });
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
    creatorCollectionInfo,

    saveCreatorCollection,
    saveCollections,
    saveCollectionPage,
    saveSpotlight,
    saveCreatorInfo,
  };
});
