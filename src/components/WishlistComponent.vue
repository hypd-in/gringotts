<template>
  <div class="wishlist-wrapper">
    <div @click="close" class="overlay"></div>
    <div class="wishlist-container">
      <div class="heading-container">
        <h2 class="heading">
          Wishlist
          <span v-if="noOfWishlistedProducts > 0">({{ noOfWishlistedProducts }})</span>
        </h2>
        <button @click="close" class="close-btn">
          <img src="~/assets/icons/misc/close.svg" alt="" />
        </button>
      </div>

      <div class="wishlisted-products" v-if="noOfWishlistedProducts > 0">
        <div class="product-listing-wrapper">
          <ProductCard v-for="product in wishlistedProducts" :itemInfo="product" :key="product?.id" src="wishlist"
            @closeWishlist="close" />
        </div>
      </div>

      <div v-else-if="loading" style="display: flex; justify-content: center">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div v-else-if="!loading && noOfWishlistedProducts == 0" class="empty-cart">
        <h5>Looks Like you haven't wishlisted any products...</h5>
        <p>Use the heart icon to wishlist a product</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "~/components/ProductComponents/ProductCard.vue";
import { getObjectLength } from "~/utils/helperMethods";
import track from "~/utils/tracking-posthog";

const config = useRuntimeConfig();
const emit = defineEmits(["close"]);
const store = useStore();
// const fetchingWishlistProducts = ref(false);
const wishlistedProducts = ref([]);

const loading = ref(true)

const wishlistedItems = computed(() => {
  return store.wishlistedItems;
});

const noOfWishlistedProducts = computed(() => {
  return wishlistedProducts.value?.length;
});
// watch(wishlistedItems, async (newV, oldV) => {
//   if (getObjectLength(newV) > 0) {
//     await fetchWishlistedProducts();
//   }
// });

onUnmounted(() => {
  track('wishlist:close')
})

onMounted(async () => {
  if (getObjectLength(wishlistedItems) > 0) {
    await fetchWishlistedProductsInfo();
  } else {
    loading.value = false
  }
  setTimeout(() => {
    let wishlisted = []
    for (let i of wishlistedProducts.value) {
      wishlisted.push({
        id: i.id, name: i.name, price: i.retail_price.value, is_oos: i.inventory_status == 'out_of_stock' ? true : false
      })
    }
    track('wishlist:visit', {
      wishlist_items: [...wishlisted]
    })
  }, 500);

  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.body.style.overflow = "scroll";
})
function close() {
  track('wishlist:close_btn_click')
  emit("close");
}

async function fetchWishlistedProductsInfo() {
  loading.value = true
  // fetchingWishlistProducts.value = true;
  var ids = '';
  Object.keys(wishlistedItems.value).forEach((id, index) => {
    ids += `${index > 0 ? '&' : '?'}id=${id}`;
  });
  await $fetch(`${config.public.catalogURL}/api/app/catalog/basic${ids}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    loading.value = false
    if (response.payload && response.payload.length > 0) {
      wishlistedProducts.value = [...response.payload];
    }
  }).catch((error) => {
    loading.value = false
    console.log("Error fetching Wishlisted Products Info", error);
  })
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
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
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
  background: none;
}

.product-listing-wrapper::-webkit-scrollbar-thumb {
  background: none;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: calc(100% - 40px);
  text-align: center;
}

h5 {
  font-family: Urbanist-SemiBold;
  font-size: 18px;
  letter-spacing: 0.4px;
  padding: 0;
  margin: 0;
}

p {
  font-family: Urbanist-Regular;
  font-size: 14px;
  letter-spacing: 0.4px;
  margin: 0;
  padding: 0;
}
</style>