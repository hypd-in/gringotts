<template>
  <section class="buttons-section">
    <button @click="toggleWishlist" :class="{ wishlisted: isWishlisted }" class="wishlist-btn"
      v-html="wishlistIcon"></button>
    <Button class="add-to-cart-btn" :loading="addingToCart" :defaultText="addToCartText" @click="addToCart" />
    <Button @click="buyNow" class="buy-now-btn" :loading="buyingNow" defaultText="Buy Now" />
  </section>
</template>

<script setup>
import Button from "@/components/SubmitButton.vue";
// import { addItemToCart } from "@/customMethods/cartMethods";
// import { trackingAddToCart } from "@/eventTracking";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import track from "~/utils/tracking-posthog";

const route = useRoute();
const store = useStore();
const creatorStore = useCreatorStore();
const productStore = useProductStore();
const emit = defineEmits(["getVariant"]);

const isWishlisted = computed(() => {
  return !!store.wishlistedItems[productStore.info?.id];
  // return false;
});
const wishlistIcon = computed(() => {
  if (isWishlisted.value) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" fill="#fc404d" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  } else {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#13141b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
});

const addingToCart = ref(false);
const buyingNow = ref(false);
const router = useRouter();
const selectedVariantId = computed(() => {
  return productStore.info?.selected_variant?.id;
});
const addToCartText = computed(() => {
  if (!!store.cartItems[selectedVariantId.value]) {
    return "Go to cart";
  } else {
    return "Add to cart";
  }
});

async function toggleWishlist() {
  track('pdp:wishlist_button_click', {
    item_id: productStore.info?.id,
    brand_id: productStore.info?.brand_id,
    variant_id: productStore.info.selected_variant?.id ?? null,
  })

  if (!isWishlisted.value) {
    var itemInfo = {
      ...productStore.info,
      source: {
        id: creatorStore?.info?.id,
        type: "creator_store",
      },
    };
    track('wishlist:add', {
      location: 'pdp', catalog_name: productStore.info.name, catalog_id: productStore.info.id, brand_id: productStore.info.brand_id, brand_name: productStore.info.brand_info.name
    })
    await addItemToWishlist(itemInfo);
  } else {
    await removeItemFromWishlist(productStore.info);
  }
}
async function addToCart() {
  track('pdp:add_to_cart_click', {
    item_id: productStore.info.id,
    brand_id: productStore.info.brand_id,
    variant_id: productStore.info.selected_variant.id,
  })
  if (!productStore.info?.selected_variant?.id) {
    emit("getVariant");
    return;
  } else if (
    !!store.cartItems[productStore.info?.selected_variant?.id]
  ) {
    goToCart();
  }
  var itemInfo = {
    variant_id: productStore.info?.selected_variant?.id,
    catalog_id: productStore.info?.id,
    quantity: 1,
  };
  if (creatorStore.info?.id) {
    itemInfo["source"] = {
      id: creatorStore.info?.id,
      type: "creator_store",
    };
  }
  if (store.user?.id) {
    itemInfo["id"] = store.user.id;
    addingToCart.value = true;
    await addItemToCart(itemInfo);
    addingToCart.value = false;
  } else {
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
    // store.dispatch("addItemToCart", {
    //   ...itemInfo,
    //   ...productStore?.info,
    // });
  }
  // trackingAddToCart(
  //   productStore.info,
  //   creatoStore.info,
  //   productStore.info?.selected_variant?.id
  // );
}

function buyNow() {

  track(' pdp:buy_now_click', {
    item_id: productStore.info.id,
    brand_id: productStore.info.brand_id,
    variant_id: productStore.info.selected_variant.id,
  })


  if (!productStore.info?.selected_variant?.id) {
    emit("getVariant");
    return;
  }
  navigateTo({
    name: "CartItems",
    query: {
      isExpress: true,
      pid: productStore.info?.id,
      vid: productStore.info?.selected_variant?.id,
      creatorId: creatorStore.info?.id,
      creatorUsername: creatorStore.info?.username,
    },
  });
  // trackingAddToCart(
  //   productStore.info,
  //   creatorStore.info,
  //   productStore.info.selected_variant?.id
  // );
}

function goToCart() {
  navigateTo({
    name: "CartItems",
  })
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .buttons-section {
    position: sticky;
    z-index: 4;
    bottom: 0;
    border-top: 0;
    padding: 12px 16px !important;
  }

  .mobile-btns {
    display: flex !important;
  }

  .desktop-btns {
    display: none !important;
  }
}

.buttons-section.mobile-btns {
  display: none;
}

.buttons-section {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--primary-border-color);
}

.wishlist-btn {
  /* width: 54px;
  height: 54px; */
  padding: 10px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--primary-border-color);
  border-radius: 12px;
  flex-shrink: 0;
}

.wishlisted {
  border: 1px solid var(--primary-border-color);
}

.wishlist-btn:hover {
  border: 1px solid var(--secondary-text, #595959);
}

.add-to-cart-btn {
  border: 1px solid var(--primary-orange);
  background: none;
  color: var(--primary-orange);
  border-radius: 16px;
  white-space: nowrap;
}

.buy-now-btn {
  border-radius: 16px;
  white-space: nowrap;
}
</style>