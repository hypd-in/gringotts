<template>
  <div class="wishlist-wrapper">
    <div @click="close" class="overlay"></div>
    <div class="wishlist-container">
      <div class="heading-container">
        <h2 class="heading">
          Wishlist
          <span v-if="noOfWishlistedProducts > 0"
            >({{ noOfWishlistedProducts }})</span
          >
        </h2>
        <button @click="close" class="close-btn">
          <img src="@/assets/icons/common/cross.svg" alt="" />
        </button>
      </div>

      <div class="wishlisted-products" v-if="noOfWishlistedProducts > 0">
        <div class="product-listing-wrapper">
          <ProductCard
            v-for="product in wishlistedProducts"
            :itemInfo="product"
            :key="product?.id"
            origin="wishlist"
          />
        </div>
      </div>
      <div v-else class="empty-cart">
        <h5>Looks Like you haven't wishlisted any products..</h5>
        <p>Use the heart icon to wishlist a product</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "@/components/ProductComponents/ProductCard.vue";
// import { getObjectLength } from "@/customMethods/globalMethods";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["close"]);
const fetchingWishlistProducts = ref(false);
const wishlistedProducts = ref([]);

const wishlistedItems = computed(() => {
  return store.getters.wishlistedItems;
});

const noOfWishlistedProducts = computed(() => {
  return wishlistedProducts.value?.length;
});
watch(wishlistedItems, async (newV, oldV) => {
  if (getObjectLength(newV) > 0) {
    await fetchWishlistedProducts();
  }
});

onMounted(async () => {
  if (getObjectLength(wishlistedItems) > 0) {
    await fetchWishlistedProducts();
  }
});
function close() {
  emit("close");
}

async function fetchWishlistedProducts() {
  fetchingWishlistProducts.value = true;
  try {
    var params = new URLSearchParams();
    Object.keys(wishlistedItems.value).forEach((id) => {
      params.append("id", id);
    });
    var response = await axios({
      method: "GET",
      url: proxy.$catalogURL + "/api/app/catalog/basic",
      params: params,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.payload && response.data.payload.length > 0) {
      wishlistedProducts.value = [...response.data.payload];
    }
  } catch (err) {
    console.log("Error fetching wishlisted products info", err);
  }
}
</script>

<style scoped>
h2.heading {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 21px;
  line-height: 24px;
  letter-spacing: 0.2px;
  margin: 0;
}
.wishlist-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  box-sizing: border-box;
  z-index: 59;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.wishlist-container {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  background: var(--plain-white, #fff);
  max-width: 640px;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  width: 36px;
  height: 36px;
}

.close-btn img {
  width: 100%;
  height: 100%;
}

h2 {
  margin: 0;
  text-align: center;
  padding: 0 0 16px;
}

h2 span {
  font-family: "Urbanist-Regular";
  font-size: 16px;
  line-height: 21px;
  color: var(--secondary-text);
}

.product-listing-wrapper {
  box-sizing: border-box;
  height: calc(100dvh - 32px - 12px - 16px);
  overflow: hidden auto;
  width: 100%;
  padding: 16px 0;
}

.product-listing-wrapper::-webkit-scrollbar {
  background: var(--light-hover);
}

.product-listing-wrapper::-webkit-scrollbar-thumb {
  background: var(--dark-hover);
}
</style>