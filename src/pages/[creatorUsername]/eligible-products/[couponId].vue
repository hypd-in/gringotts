<template>
  <div class="eligible-products">
    <h2 class="heading">Eligible {{ isGift ? 'Gift' : isBundle ? 'Bundle' : isBxgy ? 'Bxgy' : '' }} Products</h2>
    <div class="variant-selector-wrapper" v-if="showVariantSelector">
      <div class="backdrop" @click="toggleVariantSelector"></div>
      <div class="variant-selector">
        <VariantSelector />
        <SubmitButton class="add-to-cart" :disabled="!productStore.info?.selected_variant?.id" :loading="addingToCart"
          @submit="addToCart" :defaultText="defaultText" />
      </div>
    </div>
    <div class="product-listing-wrapper" v-if="products.length > 0">
      <ProductCard :showButton="true" :itemInfo="product" v-for="product in products" :key="product.id"
        @buttonAction="toggleVariantSelector" />
    </div>

    <div v-if="fetchingProducts" style="display: flex; justify-content: center">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="pagination-target" ref="target"></div>
  </div>
</template>

<script setup>
import ProductCard from "@/components/ProductComponents/ProductCard.vue";
import VariantSelector from "@/components/ProductComponents/VariantSelector.vue";
import { onMounted } from "vue";
import SubmitButton from "~/components/SubmitButton.vue";
definePageMeta({
  name: "EligibleProducts",
  layout: "default",
});

const route = useRoute();
const config = useRuntimeConfig();

const observer = ref(null);
const target = ref(null);
const fetchingProducts = ref(false);

const store = useStore();
const productStore = useProductStore();
const creatorStore = useCreatorStore();
const giftInfo = ref({});
const couponInfo = ref({});
const eligibleProductsIds = ref([]);

const products = ref([]);
const totalCatalogs = ref(0);
const catalogsSent = ref(0);
const page = ref(0);

const showVariantSelector = ref(false);
const defaultText = computed(() => !!store.cartItems[productStore?.info?.selected_variant?.id] ? 'Go To Cart' : 'Add To Cart');
const addingToCart = ref(false);

const isGift = computed(() => route.query.isGift);
const isBundle = computed(() => route.query.isBundle);
const isBxgy = computed(() => route.query.isBxgy);
const giftType = computed(() => giftInfo.value?.type);

const allCoupons = computed(() => store.allCoupons);

// Fetch Gift Info
if (route.query.isGift && route.params.couponId) {
  var { data, error } = await useFetch(`${config.public.couponURL}/api/app/gift?gift_id=${route.params.couponId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  })
  if (data.value.payload) {
    giftInfo.value = { ...data.value.payload };
    if (giftType.value == 'catalog') {
      eligibleProductsIds.value = [...giftInfo.value.buy_catalog_ids];
    }
    totalCatalogs.value = eligibleProductsIds.value.length;
  }
  else if (error) {
    console.error(error);
  }
}

function toggleVariantSelector(itemInfo) {
  if (itemInfo?.id) {
    productStore.saveProductInfo(itemInfo);
    if (itemInfo?.Variants?.length == 1 && itemInfo?.Variants[0]?.inventory_info?.status?.value !== "out_of_stock") {
      productStore.updateProductInfo({
        ...itemInfo,
        selected_variant: itemInfo.Variants[0],
      })
    } else if (itemInfo?.variants?.length == 1 && itemInfo?.variants[0]?.inventory_info?.status?.value !== "out_of_stock") {
      productStore.updateProductInfo({
        ...itemInfo,
        selected_variant: itemInfo.variants[0],
      })
    }
  }
  showVariantSelector.value = !showVariantSelector.value;
}

function addItemToLocalStorage(itemInfo) {
  if (localStorage.getItem("cart_items") != null) {
    var cartItems = JSON.parse(localStorage.getItem("cart_items"));
    cartItems.push(itemInfo);

    localStorage.removeItem("cart_items");
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  } else {
    var cartItems = [];
    cartItems.push(itemInfo);
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }

  store.addItemToCart({
    ...itemInfo, ...productStore.info
  });
}

async function addToCart() {
  if (store.cartItems[productStore.info?.selected_variant?.id]) {
    navigateTo({
      name: "CartItems",
    });
    return;
  }

  try {
    addingToCart.value = true;
    var itemInfo = {
      catalog_id: productStore.info?.id,
      variant_id: productStore.info?.selected_variant?.id,
      quantity: 1,
    };
    if (creatorStore.info) {
      itemInfo["source"] = {
        id: creatorStore.info?.id,
        type: "creator_store",
      };
    }
    if (store.user?.id) {
      itemInfo = {
        ...itemInfo,
        id: store.user?.id,
      };
      await addItemToCart(itemInfo);
      addingToCart.value = false;
      toggleVariantSelector();
    } else {
      addItemToLocalStorage(itemInfo);
      addingToCart.value = false;
      toggleVariantSelector();
    }
  } catch (error) {
    console.log("Error adding item to cart", error);
    addingToCart.value = false;
    toggleVariantSelector();
  }
}

async function fetchCatalogInfoByIds() {
  var maxLimit = 20;
  if (totalCatalogs.value < 20) {
    maxLimit = totalCatalogs.value;
  }
  try {
    fetchingProducts.value = true;
    var params = new URLSearchParams();
    for (var i = catalogsSent.value; i < catalogsSent.value + maxLimit; i++) {
      params.append("id", eligibleProductsIds.value[i]);
      totalCatalogs.value -= 1;
    }
    var response = await $fetch(`${config.public.catalogURL}/api/app/catalog/basic${params.size > 0 ? '?' + params.toString() : ''}`, {
      method: "GET",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    catalogsSent.value += maxLimit;
    if (response.payload && response.payload?.length > 0) {
      products.value = [...products.value, ...response.payload];
      if (totalCatalogs.value < 1) {
        observer.value.unobserve(target.value);
      }
    }
  } catch (error) {
    console.log("Error fetching catalog info");
  }
  fetchingProducts.value = false;
}

async function fetchBrandCatalogs(id) {
  try {
    fetchingProducts.value = true;
    var requestBody = {
      brand_ids: [id],
      page: page.value,
    };
    var response = await $fetch(`${config.public.catalogURL}/api/catalog/category`, {
      method: "POST",
      // url: proxy.$catalogURL + "/api/catalog/category",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (response.payload?.data) {
      products.value = [...products.value, ...response.payload.data];
      page.value++;
      fetchingProducts.value = false;
    } else {
      if (observer.value && target.value) {
        await observer.value?.unobserve(target.value);
      }
    }
  } catch (err) {
    console.log("Error fetching brand Products", err);
  }
  fetchingProducts.value = false;
}

watch(allCoupons, (newV) => {
  if (newV?.length > 0 && couponInfo.value?.id != route.params.couponId) {
    var coupon = newV.filter((coupon) => {
      return coupon.id == route.params.couponId;
    });
    if (coupon.length > 0) {
      couponInfo.value = { ...coupon[0] };
      observer.value = addingObserver(target.value, callback);
    }
  }
})
function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting && !fetchingProducts.value) {
      if (isGift.value) {
        if (giftType.value == 'catalog') {
          await fetchCatalogInfoByIds();
        } else if (giftInfo.value?.brand_id) {
          await fetchBrandCatalogs(giftInfo.value?.brand_id);
        }
      }

      else if (
        isBundle.value &&
        couponInfo.value?.applicable_on?.name === "bundle" &&
        couponInfo.value?.applicable_on?.bundle
      ) {
        if (
          couponInfo.value?.applicable_on?.bundle?.catalog_ids &&
          couponInfo.value?.applicable_on?.bundle?.catalog_ids?.length > 0
        ) {
          if (
            totalCatalogs.value == 0 &&
            catalogsSent.value !=
            couponInfo.value?.applicable_on?.bundle?.catalog_ids?.length
          ) {
            totalCatalogs.value =
              couponInfo.value?.applicable_on?.bundle?.catalog_ids?.length;
          }
          eligibleProductsIds.value = [...couponInfo.value?.applicable_on?.bundle?.catalog_ids];
          totalCatalogs.value = eligibleProductsIds.value?.length;
          await fetchCatalogInfoByIds();
        } else if (
          couponInfo.value?.applicable_on?.bundle?.brand_id &&
          !couponInfo.value?.applicable_on?.bundle?.catalog_ids
        ) {
          await fetchBrandCatalogs(couponInfo.value.applicable_on?.bundle?.brand_id);
        }
      }
      else if (isBxgy.value) {
        if (couponInfo.value?.applicable_on?.bxgy?.sub_type == 'brand') {
          await fetchBrandCatalogs(couponInfo.value?.applicable_on?.bxgy?.get_ids[0]);
        } else if (couponInfo.value?.applicable_on?.bxgy?.sub_type == 'catalog') {
          eligibleProductsIds.value = [...couponInfo.value?.applicable_on?.bxgy?.get_ids];
          totalCatalogs.value = eligibleProductsIds.value?.length;
          await fetchCatalogInfoByIds();
        }
      }
    }
  });
}


onMounted(async () => {
  if (allCoupons.value?.length > 0 && couponInfo.value?.id != route.params.couponId) {
    var coupon = allCoupons.value.filter((coupon) => {
      return coupon.id == route.params.couponId;
    });
    if (coupon.length > 0) {
      couponInfo.value = { ...coupon[0] }
    }
  }
  if (target.value) {
    observer.value = addingObserver(target.value, callback);
  }
})
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .variant-selector {
    transform: translate(-50%, 0) !important;
    top: auto !important;
    bottom: 0;
    left: 0;
  }
}

.eligible-products {
  max-width: 1180px;
  margin: 0 auto;
}

h2.heading {
  margin: 0;
  padding: 16px 16px 0;
  font-size: 21px;
  line-height: 28px;
  letter-spacing: 0.4px;
}

.variant-selector {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 72;
  background: #fff;
  max-width: 420px;
  width: 100%;
  border-radius: 12px;
  box-sizing: border-box;
}

.variant-selector .add-to-cart {
  margin: 0 16px 16px;
  box-sizing: border-box;
  width: calc(100% - 32px);
}
</style>