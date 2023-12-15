import { defineStore } from "pinia";

export const useCreatorStore = defineStore("creator", () => {
  const info = ref({});

  function saveCreatorInfo(creatorInfo) {
    info.value = { ...creatorInfo };
  }
  function updateCreatorInfo(newInfo) {
    info.value = { ...newInfo };
  }

  return {
    info,
    saveCreatorInfo,
    updateCreatorInfo,
  };
});
