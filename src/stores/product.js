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
    console.log("Brand Info", brandInfo);
    brandInfo.value = { ...brandInfo };
    console.log("Product Brand Info", brandInfo.value);
  }

  return {
    info,
    brandInfo,
    saveProductInfo,
    updateProductInfo,
    saveBrandInfo,
  };
});
