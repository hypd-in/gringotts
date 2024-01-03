import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const user = ref({});
  const wishlistedItems = ref({});
  const couponsMap = ref({});
  const bxgyCoupons = ref([]);
  const hotSellingProducts = ref([]);
  const exploreAnimation = ref(false);

  function saveUserInfo(userInfo) {
    user.value = { ...userInfo };
  }

  function saveWishlistedItems(wishlistedItems) {
    wishlistedItems.value = { ...wishlistedItems };
  }

  function saveCouponsMap(coupons) {
    couponsMap = { ...coupons };
  }

  function saveHotSellingProducts(products) {
    hotSellingProducts.value = [...products];
  }

  function toggleExploreAnimation(value) {
    exploreAnimation.value = value;
  }

  return {
    user,
    wishlistedItems,
    couponsMap,
    bxgyCoupons,
    hotSellingProducts,
    exploreAnimation,
    saveUserInfo,
    saveWishlistedItems,
    saveCouponsMap,
    saveHotSellingProducts,
    toggleExploreAnimation,
  };
});
