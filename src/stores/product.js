import { defineStore } from "pinia";

export const useProductStore = defineStore("product", () => {
  const info = ref({});

  function saveProductInfo(productInfo) {
    info.value = { ...productInfo };
  }
  function updateProductInfo(newInfo) {
    info.value = { ...newInfo };
  }

  return {
    info,
    saveProductInfo,
    updateProductInfo,
  };
});
