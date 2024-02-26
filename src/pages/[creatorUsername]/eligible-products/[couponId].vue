<template>
  <div class="eligible-products">
    <h2 class="heading">Eligible Products</h2>
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

const store = useStore();
const productStore = useProductStore();
const creatorStore = useCreatorStore();
const giftInfo = ref({});
const eligibleProductsIds = ref([]);

const products = ref([]);
const totalCatalogs = ref(0);
const catalogsSent = ref(0);
const page = ref(0);
const showVariantSelector = ref(false);
const defaultText = computed(() => !!store.cartItems[productStore?.info?.selected_variant?.id] ? 'Go To Cart' : 'Add To Cart');
const addingToCart = ref(false);

const isGift = computed(() => route.query.isGift);
const giftType = computed(() => giftInfo.value?.type);

function toggleVariantSelector(itemInfo) {
  if (itemInfo?.id) {
    productStore.saveProductInfo(itemInfo);
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
async function getGiftInfo() {
  try {
    var response = await $fetch(`${config.public.couponURL}/api/app/gift?gift_id=${route.params.couponId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })
    if (response.payload) {
      giftInfo.value = { ...response.payload };
      if (giftType.value == 'catalog') {
        eligibleProductsIds.value = [...giftInfo.value.buy_catalog_ids];
      }
      totalCatalogs.value = eligibleProductsIds.value.length;
    }
  } catch (error) {
    alert("Error fetching Gift Eligible Products");
  }
}
async function fetchCatalogInfoByIds() {
  var maxLimit = 20;
  if (totalCatalogs.value < 20) {
    maxLimit = totalCatalogs.value;
  }
  try {
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
}

function fetchBrandCatalogs() {
  console.log("Fetching Brands", products.value);
}

function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      if (isGift.value) {
        if (giftType.value == 'catalog') {
          fetchCatalogInfoByIds();
        } else {
          fetchBrandCatalogs();
        }
      }
    }
  });
}

onMounted(async () => {
  if (route.query.isGift) {
    await getGiftInfo();
  }
  if (target.value) {
    observer.value = addingObserver(target.value, callback);
  }
})
</script>

<style scoped>
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