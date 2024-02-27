import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const user = ref({});
  const wishlistedItems = ref({});
  const cartInfo = ref({});
  const cartItems = ref({});
  const addresses = ref({});
  const orders = ref({
    userOrders: [],
    page: 0,
  });
  const orderDetails = ref({});
  const exploreCurations = ref({
    curations: [],
    categoryCurations: {},
    page: 0,
  });

  const searchProducts = ref({
    products: [],
    page: 0,
  });

  const brandWiseGifts = ref({});

  const couponsMap = ref({});
  const bxgyCoupons = ref([]);
  const bxgyGetIds = ref([]);
  const cartCoupons = ref({});

  const allCoupons = ref([]);
  const brandWiseCartItems = ref({});

  const hotSellingProducts = ref([]);
  const exploreAnimation = ref(false);

  const brandTotalCartValue = ref();

  const giftsEligibleForCart = ref({});

  const cartItemsFailSuccess = ref([]);

  const cartDataToTrack = ref({});

  const cartLoader = ref(true)

  // functions

  function setCartloader(value){
    cartLoader.value = value
  }

  function saveCartDataToTrack(obj) {
    cartDataToTrack.value = { ...obj };
  }

  function saveCartItemsFailSuccess(items) {
    cartItemsFailSuccess.value = [...items];
  }

  function removeUserAddress(address) {
    if (address?.id) {
      delete addresses.value[address.id];
    }
  }

  function addItemToCart(item) {
    cartItems.value[item?.variant_id] = item;
  }

  function removeItemFromCart(item) {
    delete cartItems.value[item.variant_id];
  }

  function setGiftsEligibleForCart(gifts) {
    giftsEligibleForCart.value = { ...gifts };
  }

  function saveBrandTotalCartValue(value) {
    brandTotalCartValue.value = value;
  }

  function setBrandWiseGift(gifts) {
    brandWiseGifts.value = { ...gifts };
  }

  function saveBrandWiseCartItems(brandWiseCart) {
    brandWiseCartItems.value = { ...brandWiseCart };
  }

  function saveBxGyGetIds(ids) {
    bxgyGetIds.value = [...ids];
  }

  function saveAllCoupons(coupons) {
    allCoupons.value = [...coupons];
    bxgyCoupons.value = coupons.filter((coupon) => {
      return coupon.applicable_on.name == "bxgy";
    });
  }

  function saveCouponsObject(coupons) {
    cartCoupons.value = { ...coupons };
  }

  function saveUserInfo(userInfo) {
    user.value = { ...userInfo };
  }

  function saveWishlistedItems(items) {
    wishlistedItems.value = { ...items };
  }

  function saveCartInfo(info) {
    cartInfo.value = { ...info };
  }

  function updateCartInfo(info) {
    cartInfo.value = { ...cartInfo.value, ...info };
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

  function saveUserOrders(data) {
    orders.value.userOrders = [...orders.value.userOrders, ...data];
  }

  function resetUserOrders() {
    orders.value.userOrders = [];
    orders.value.page = 0;
  }

  function updateOrdersPageCount(newPage) {
    orders.value.page = newPage;
  }

  function saveOrderDetails(obj) {
    orderDetails.value = { ...obj };
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
    orders,
    orderDetails,
    exploreCurations,
    searchProducts,
    couponsMap,
    bxgyCoupons,
    hotSellingProducts,
    exploreAnimation,
    cartCoupons,
    allCoupons,
    brandWiseCartItems,
    bxgyGetIds,
    brandWiseGifts,
    brandTotalCartValue,
    giftsEligibleForCart,
    cartItemsFailSuccess,
    cartDataToTrack,
    cartLoader,

    setCartloader,
    saveCartDataToTrack,
    saveCartItemsFailSuccess,
    removeUserAddress,
    addItemToCart,
    removeItemFromCart,
    setGiftsEligibleForCart,
    saveBrandTotalCartValue,
    setBrandWiseGift,
    saveBxGyGetIds,
    saveBrandWiseCartItems,
    saveAllCoupons,
    saveCouponsObject,
    saveUserInfo,
    saveWishlistedItems,
    saveCartInfo,
    updateCartInfo,
    saveCartItems,
    updateCartInfo,
    saveUserAddresses,
    saveUserOrders,
    saveOrderDetails,
    updateOrdersPageCount,
    resetUserOrders,
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
