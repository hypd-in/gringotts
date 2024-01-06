import { defineStore } from "pinia";

export const useProductStore = defineStore("product", () => {
  const info = ref({});
  const brandInfo = ref({});

  function saveProductInfo(productInfo) {
    info.value = { ...productInfo };
  }

  function updateProductInfo(newInfo) {
    info.value = { ...info.value, ...newInfo };
  }

  function saveBrandInfo(brandInfo) {
    brandInfo.value = { ...brandInfo };
  }

  return {
    info,
    brandInfo,
    saveProductInfo,
    updateProductInfo,
    saveBrandInfo,
  };
});
