<template>
  <div class="popup-container">
    <div class="backdrop" @click="closePopup"></div>

    <div class="bottom-sheet-container">
      <div class="upper-section">
        <ImageFrame class="item-image" border_radius="8px" v-if="itemInfo?.catalog_info?.featured_image"
          :src="itemInfo?.catalog_info?.featured_image?.src" />

        <div class="alertbox-content">
          <span id="alert-heading">
            Are you sure you want to remove this product?
          </span>
          <div class="item-info">
            <span> Name: {{ itemInfo?.catalog_info?.name }} </span>
            <span>
              Variant:
              {{ itemInfo?.variants[itemInfo?.variant_id].attribute }}</span>
          </div>
        </div>
      </div>

      <div class="button-flex">
        <Submit :loading="removingItem" @submit="removeItemFromCart" defaultText="Delete" class="delete-btn" />

        <Submit @submit="moveItemToWishlist" :loading="wishlistingItem" defaultText="Move to Wishlist"
          class="move-to-wishlist-btn" />
      </div>

      <div @click="closePopup" class="close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Close">
            <g id="add">
              <path id="Union 1" fill-rule="evenodd" clip-rule="evenodd"
                d="M16.2004 18.0007L11.9998 13.8001L7.8001 17.9998C7.30279 18.4971 6.49713 18.4971 6 18C5.50342 17.5034 5.50342 16.6978 6.00073 16.2004L10.2004 12.0007L5.99981 7.80011C5.50342 7.30371 5.50342 6.49658 6 6C6.49731 5.50269 7.30371 5.50342 7.8001 5.99982L12.0007 10.2004L16.2004 6.00074C16.6978 5.50342 17.5034 5.50341 18 5.99999C18.4971 6.49713 18.4971 7.30279 17.9998 7.80011L13.8001 11.9998L18.0007 16.2004C18.4973 16.697 18.4973 17.5027 18 18C17.5034 18.4966 16.697 18.4973 16.2004 18.0007Z"
                fill="#13141B" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports
import ImageFrame from "../ImageFrame.vue";
import { ref } from "vue";
import {
  getCartItemsFromLocalStorage,
  imitateCartInfo,
} from "@/utils/cartMethods.js";
import {
  addItemToWishlist,
  fetchCartInfo,
  removeCouponFromCart,
  saveBrandWiseCart,
} from "@/utils/globalAPIs";
import Submit from "@/components/SubmitButton.vue";
import track from "~/utils/tracking-posthog";

// import { trackingRemoveFromCart } from "@/eventTracking";

// Initialisation
const props = defineProps({
  itemInfo: Object,
});
const emit = defineEmits(["close"]);
const store = useStore();
const route = useRoute();
const runtimeConfig = useRuntimeConfig()

// Data Variables
const wishlistingItem = ref(false);
const removingItem = ref(false);
// Methods
async function removeItemFromCart() {
  if (!wishlistingItem.value) {
    removingItem.value = true;
  }
  if (route.query.isExpress) {
    store.removeItemFromCart(props.itemInfo);
    removingItem.value = false;
    closePopup();
    return;
  }
  if (!store.user?.id && localStorage.getItem("cart_items") != null) {
    var localCartItems = JSON.parse(localStorage.getItem("cart_items"));
    var updatedCartItems = localCartItems.filter((item) => {
      return item.variant_id !== props.itemInfo?.variant_id;
    });
    if (updatedCartItems.length > 0) {
      localStorage.setItem("cart_items", JSON.stringify(updatedCartItems));
    } else {
      localStorage.removeItem("cart_items");
    }
    store.removeItemFromCart(props.itemInfo);
    removingItem.value = false;
    closePopup();
    imitateCartInfo(Object.values(store.cartItems));
    saveBrandWiseCart(Object.values(store.cartItems));

    track('cart:item_delete', {
        ...store.cartDataToTrack, removed_item: { ...props.itemInfo, variants : {...props.itemInfo.variants} }
      })

    return;
  } else {
    try {
      var formData = {
        catalog_id: props.itemInfo?.catalog_info?.id,
        id: store.user?.id,
        quantity: 0,
        variant_id: props.itemInfo?.variant_id,
      };
      var response = await $fetch(runtimeConfig.public.entityURL + "/api/app/cart/item", {
        method: "PUT",
        credentials: 'include',
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.payload) {
        if (store.cartInfo.coupon) {
          if (
            store.cartInfo?.coupon.applicable_on?.bxgy?.get_ids &&
            ([
              ...store.cartInfo?.coupon.applicable_on?.bxgy?.get_ids,
              ...store.cartInfo?.coupon.applicable_on?.bxgy?.buy_ids,
            ].includes(props.itemInfo?.catalog_info?.id) ||
              [
                ...store.cartInfo?.coupon.applicable_on?.bxgy?.get_ids,
                ...store.cartInfo?.coupon.applicable_on?.bxgy?.buy_ids,
              ].includes(props.itemInfo?.brand_info?.id))
          ) {
            await removeCouponFromCart();
          } else {
            await removeCouponFromCart();
          }
        } else {
          await fetchCartInfo();
        }
        removingItem.value = false;
        closePopup();
        // trackingRemoveFromCart(props.itemInfo);
      }
      track('cart:item_delete', {
        ...store.cartDataToTrack, removed_item: { ...props.itemInfo, variants : {...props.itemInfo.variants} }
      })
    } catch (err) {
      await fetchCartInfo();
      removingItem.value = false;
      console.log("Error removing item from cart", err);
      closePopup();
    }
  }

}

async function closePopup() {
  emit("close");
}

async function moveItemToWishlist() {
  wishlistingItem.value = true;
  if (!store.wishlistedItems[props.itemInfo?.catalog_id]?.catalog_id) {
    track('wishlist:add', {
      location: 'cart-move-to-wishlist', catalog_name: props.itemInfo.catalog_info.name, catalog_id: props.itemInfo.id, brand_id: props.itemInfo.brand_info.id, brand_name: props.itemInfo.brand_info.name
    })
    await addItemToWishlist(props.itemInfo);
  }
  await removeItemFromCart();
  wishlistingItem.value = false;
}
</script>

<style scoped>

.upper-section {
  display: grid;
  grid-template-columns: 72px auto;
  gap: 16px;
  align-items: flex-start;
}

.alertbox-content {
  width: calc(100% - 32px);
}

.alertbox-content span#alert-heading {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 22px;
}

.item-info {
  padding: 6px 0 0;
}

.item-info span {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

.item-info span:first-of-type {
  display: -webkit-box;
  height: 42px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.button-flex {
  margin: 16px 0 0;
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  gap: 16px;
}

button {
  display: flex;
  padding: 14px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 14px;

  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  background: #f9f9f9;
  width: 100%;
}

.delete-btn {
  color: #13141b;
  background: none;
  border: 1px solid #13141b;
}

.move-to-wishlist-btn {
  border: 1px solid var(--primary-orange, #fb6c23);
  color: var(--primary-orange, #fb6c23);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 18px;
  z-index: 24;
  cursor: pointer;
}
</style>