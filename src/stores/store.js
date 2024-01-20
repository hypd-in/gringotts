import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const user = ref({});
  const wishlistedItems = ref({});
  const cartInfo = ref({});
  const cartItems = ref({});
  const addresses = ref([]);
  const exploreCurations = ref({
    curations: [],
    categoryCurations: {},
    page: 0,
  });

  const searchProducts = ref({
    products: [],
    page: 0,
  });
  const couponsMap = ref({});
  const bxgyCoupons = ref([]);
  const hotSellingProducts = ref([]);
  const exploreAnimation = ref(false);

  function saveUserInfo(userInfo) {
    user.value = { ...userInfo };
  }

  function saveWishlistedItems(items) {
    wishlistedItems.value = { ...items };
  }

  function saveCartInfo(info) {
    cartInfo.value = { ...info };
  }

  function saveCartItems(items) {
    cartItems.value = { ...items };
  }

  function updateCartInfo(newObj) {
    cartInfo.value = { ...cartInfo.value, ...newObj };
  }

  function saveUserAddresses(userAddresses) {
    addresses.value = { ...userAddresses };
  }

  function saveExploreCurations(newCurations) {
    exploreCurations.value.curations = [
      ...exploreCurations.value.curations,
      ...newCurations,
    ];
  }

  function saveExploreCategoryCurations(curations) {
    exploreCurations.value.categoryCurations = {
      ...curations,
    };
  }

  function updateExplorePageCount(pageNo) {
    exploreCurations.value.page = pageNo;
  }

  function resetExploreCurations() {
    exploreCurations.value = {
      curations: [],
      categoryCurations: {},
      page: 0,
    };
  }

  function saveSearchProducts(newProducts) {
    searchProducts.value.products = [
      ...searchProducts.value.products,
      ...newProducts,
    ];
  }

  function updateSearchPageCount(page) {
    searchProducts.value.page = page;
  }

  function resetSearchProducts() {
    searchProducts.value = {
      products: [],
      page: 0,
    };
  }

  function saveCouponsMap(coupons) {
    couponsMap.value = { ...coupons };
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
    cartInfo,
    cartItems,
    addresses,
    exploreCurations,
    searchProducts,
    couponsMap,
    bxgyCoupons,
    hotSellingProducts,
    exploreAnimation,
    saveUserInfo,
    saveWishlistedItems,
    saveCartInfo,
    saveCartItems,
    updateCartInfo,
    saveUserAddresses,
    saveExploreCurations,
    saveExploreCategoryCurations,
    updateExplorePageCount,
    resetExploreCurations,
    saveSearchProducts,
    updateSearchPageCount,
    resetSearchProducts,
    saveCouponsMap,
    saveHotSellingProducts,
    toggleExploreAnimation,
  };
});
