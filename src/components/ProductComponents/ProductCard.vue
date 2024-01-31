<template>
  <div class="product-card-wrapper" :class="{ 'oos-card': isOutOfStock }">
    <div class="image-tag-wrapper" v-if="productImage">
      <NuxtLink :to="goToProduct" v-if="!isAffiliate">
        <div class="tag out-of-stock" v-if="isOutOfStock">
          Out of Stock
        </div>
        <div class="tag bxgy" v-else-if="isBxGy">
          {{ isBxGy }}
        </div>
        <div class="tag hot-selling" v-else-if="isHotSelling">
          Hot Selling
        </div>
        <div class="tag low-in-stock" v-else-if="isLowInStock">
          Only Few Left
        </div>
      </NuxtLink>
      <div @click="toggleWishlist" class="wishlist-icon" v-if="!isAffiliate" v-html="wishlistIcon"></div>
      <NuxtLink :to="goToProduct">
        <NuxtImg class="featured-image" :src="optimizeImage(productImage, 550)" :placeholder="[50, 25, 75, 5]" />
        <!-- <ImageFrame /> -->
      </NuxtLink>
    </div>
    <NuxtLink :to="goToProduct">
      <div class="item-info-wrapper">
        <div class="info-container">
          <h3 class="brand-name">{{ brandName }}</h3>
          <p class="item-name line-clamp">{{ itemName }}</p>
        </div>

        <div class="pricing-info">
          <span id="retail-price">{{ convertToINR(retailPrice) }}</span>
          <span v-if="basePrice > retailPrice && !isAffiliate" id="base-price">{{
            convertToINR(basePrice)
          }}</span>
          <span v-if="basePrice > retailPrice && !isAffiliate" id="discount">({{ discount }}% off)</span>
        </div>
      </div>
    </NuxtLink>
    <div class="offer-section" v-if="!isAffiliate">
      <div class="offers-bar" v-if="noOfOffers > 0">
        <div class="flex-together" v-html="couponIcon"></div>
        {{ noOfOffers }} offers available
      </div>
    </div>
    <button :class="{ disabled: props.itemInfo.inventory_status == 'out_of_stock' }" @click="buttonAction"
      v-if="showButton && !isAffiliate" class="add-to-cart">
      <div class="flex-together" v-html="cartIcon"></div>
      Add To Cart
    </button>
  </div>
</template>

<script setup>
// import ImageFrame from "@/components/ImageFrame.vue";
import {
  convertToINR,
  optimizeImage,
} from "~/utils/helperMethods";

const props = defineProps({
  itemInfo: Object,
  showButton: Boolean,
  showOffers: Boolean,
  isAffiliate: Boolean,
  creator: Object,
});
const emit = defineEmits(["buttonAction"]);
const router = useRouter();
const store = useStore();
const creatorStore = useCreatorStore();

const cartIcon = computed(() => {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none"><path d="M1.6084 2.16663H3.0584C3.9584 2.16663 4.66673 2.94163 4.59173 3.83329V12.1333C4.47507 13.4916 5.55006 14.6583 6.91673 14.6583H15.7917C16.9917 14.6583 18.0417 13.675 18.1334 12.4833L18.2001 6.2333C18.3001 4.84996 17.2501 3.72496 15.8584 3.72496H13.5834" stroke="#FB6C23" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.625 18.8333C15.2003 18.8333 15.6667 18.367 15.6667 17.7917C15.6667 17.2164 15.2003 16.75 14.625 16.75C14.0497 16.75 13.5834 17.2164 13.5834 17.7917C13.5834 18.367 14.0497 18.8333 14.625 18.8333Z" stroke="#FB6C23" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.95829 18.8333C8.53359 18.8333 8.99996 18.367 8.99996 17.7917C8.99996 17.2164 8.53359 16.75 7.95829 16.75C7.383 16.75 6.91663 17.2164 6.91663 17.7917C6.91663 18.367 7.383 18.8333 7.95829 18.8333Z" stroke="#FB6C23" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.75 7.16663H17.75" stroke="#FB6C23" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
});

const couponIcon = computed(() => {
  return '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.33 3.16663H4.66334C2.11 3.16663 1.39667 3.77996 1.33667 6.16663C2.62334 6.16663 3.66334 7.21329 3.66334 8.49996C3.66334 9.78663 2.62334 10.8266 1.33667 10.8333C1.39667 13.22 2.11 13.8333 4.66334 13.8333H11.33C13.9967 13.8333 14.6633 13.1666 14.6633 10.5V6.49996C14.6633 3.83329 13.9967 3.16663 11.33 3.16663Z" stroke="#01C159" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.99548 3.16663V5.49996" stroke="#01C159" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.99548 11.5V13.8333" stroke="#01C159" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.0166 6.71994L10.43 7.55327C10.47 7.63327 10.55 7.69327 10.6366 7.70661L11.5566 7.83994C11.7833 7.87327 11.8766 8.15327 11.71 8.31327L11.0433 8.95994C10.9766 9.01994 10.95 9.11327 10.9633 9.20661L11.1233 10.1199C11.1633 10.3466 10.9233 10.5199 10.7233 10.4133L9.9033 9.97994C9.8233 9.93994 9.7233 9.93994 9.6433 9.97994L8.8233 10.4133C8.61664 10.5199 8.3833 10.3466 8.4233 10.1199L8.5833 9.20661C8.59664 9.11327 8.56997 9.02661 8.5033 8.95994L7.8433 8.31327C7.67664 8.15327 7.76997 7.87327 7.99664 7.83994L8.91664 7.70661C9.00997 7.69327 9.0833 7.63994 9.1233 7.55327L9.52997 6.71994C9.6233 6.51327 9.91664 6.51327 10.0166 6.71994Z" stroke="#01C159" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
});
const hotSellingProductsObject = computed(() => {
  return store.hotSellingProducts.reduce((obj, product) => {
    return {
      ...obj,
      [product.id]: product,
    };
  }, {});
});

const wishlistIcon = computed(() => {
  if (!!store.wishlistedItems[props.itemInfo.id]) {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" fill="#fc404d" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  } else {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
});

const isOutOfStock = computed(() => {
  return props.itemInfo?.inventory_status == "out_of_stock";
});

const noOfOffers = computed(() => {
  var availableOffers = [];
  if (store.couponsMap[props.itemInfo?.id]) {
    availableOffers = [
      ...availableOffers,
      ...store.couponsMap[props.itemInfo?.id],
    ];
  }

  if (
    store.couponsMap[props.itemInfo?.brand_id || props.itemInfo?.brand_info?.id]
  ) {
    availableOffers = [
      ...availableOffers,
      ...store.couponsMap[
      props.itemInfo?.brand_id || props.itemInfo?.brand_info?.id
      ],
    ];
  }

  if (store.couponsMap["cart"]) {
    availableOffers = [...availableOffers, ...store.couponsMap["cart"]];
  }
  return availableOffers.length;
});

const isBxGy = computed(() => {
  var couponInfo = {
    buy_count: 0,
    get_count: 0,
  };
  store.bxgyCoupons.forEach((coupon) => {
    if (
      (coupon.applicable_on.bxgy.sub_type == "catalog" &&
        coupon.applicable_on.bxgy.buy_ids.includes(props.itemInfo?.id)) ||
      coupon.applicable_on.bxgy.get_ids.includes(props.itemInfo?.id) ||
      (coupon.applicable_on.bxgy.sub_type == "brand" &&
        coupon.applicable_on.bxgy.buy_ids.includes(
          props.itemInfo?.brand_info?.id
        )) ||
      coupon.applicable_on.bxgy.get_ids.includes(props.itemInfo?.brand_info?.id)
    ) {
      if (
        couponInfo.buy_count < coupon.applicable_on.bxgy.buy_count ||
        couponInfo.get_count < coupon.applicable_on.bxgy.get_count
      ) {
        couponInfo.buy_count = coupon.applicable_on.bxgy.buy_count;
        couponInfo.get_count = coupon.applicable_on.bxgy.get_count;
      }
    }
  });
  if (couponInfo.buy_count > 0 && couponInfo.get_count > 0) {
    return `Buy ${couponInfo.buy_count} Get ${couponInfo.get_count}`;
  } else {
    return null;
  }
});

const isHotSelling = computed(() => {
  return hotSellingProductsObject.value[props.itemInfo?.id] || false;
});

const isLowInStock = computed(() => {
  return props.itemInfo?.inventory_status == "low_in_stock";
});

const productImage = computed(() => {
  return props.itemInfo?.featured_image?.src || props.itemInfo?.image || null;
});

const brandName = computed(() => {
  return props.itemInfo?.brand_info?.name || props.itemInfo?.affiliate_program?.name || "NA";
});

const itemName = computed(() => {
  return props.itemInfo?.name || "NA";
});

const retailPrice = computed(() => {
  return props.itemInfo?.retail_price?.value || props.itemInfo?.price;
});
const basePrice = computed(() => {
  return props.itemInfo?.base_price?.value;
});

const discount = computed(() => {
  if (basePrice.value > retailPrice.value) {
    var discount = basePrice.value - retailPrice.value;
    return Math.floor((discount / basePrice.value) * 100);
  } else {
    return 0;
  }
});

const goToProduct = computed(async () => {
  var obj = {};
  if (props.isAffiliate) {
    let link = props.itemInfo.hypd_link.split("/");
    obj = {
      name: "AfflinkRedirection",
      params: {
        'afflinkId': link[link.length - 1],
      }
    };
  } else if (creatorStore.info?.username) {
    obj = {
      name: "CreatorProduct",
      params: {
        id: props.itemInfo?.id,
        creatorUsername: creatorStore?.info?.username,
      },
      query: {
        title: props.itemInfo?.name,
      },
    }
  } else if (props.creator) {
    obj = {
      name: "CreatorProduct",
      params: {
        id: props.itemInfo?.id,
        creatorUsername: props.creator?.username,
      },
      query: {
        title: props.itemInfo?.name,
      },
    }
  }
  else {
    obj = {
      name: "CreatorProduct",
      params: {
        id: props.itemInfo?.id,
        creatorUsername: await getCreatorUserName()
      },
      query: {
        title: props.itemInfo?.name,
      },
    }
  }
  return obj;
})

function buttonAction() {
  if (props.itemInfo?.inventory_status == "out_of_stock") {
    return;
  }
  emit("buttonAction", props.itemInfo);
}

async function toggleWishlist() {
  if (!!store.wishlistedItems[props.itemInfo.id]) {
    removeItemFromWishlist(props.itemInfo);
  } else {
    await addItemToWishlist(props.itemInfo);
  }
}
</script>

<style scoped>
.product-card-wrapper {
  box-sizing: border-box;
  max-width: 180px;
}

.oos-card .featured-image {
  filter: grayscale(1);
}

.oos-card .item-info-wrapper {
  color: var(--inactive-text) !important;
  opacity: 50%;
}

.image-tag-wrapper {
  position: relative;
  z-index: 0;
}

.featured-image {
  width: 100%;
  min-width: 160px;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  object-fit: cover;
  cursor: pointer;
}

.wishlist-icon {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 2;
  cursor: pointer;
}

.item-info-wrapper {
  padding: 8px 0 0;
  cursor: default;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h3.brand-name {
  color: var(--primary-dark, #13141b);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
}

p.item-name {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Regular;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  height: 32px;
}

.pricing-info {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0 0;
}

span#retail-price {
  color: var(--dark-purple, #13141b);
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

span#base-price {
  color: var(--Disabled-text, #bebebe);
  font-family: Urbanist-Regular;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  text-decoration: line-through;
}

span#discount {
  color: var(--green, #01c159);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 18px;
  /* 150% */
  letter-spacing: 0.4px;
}

.featured-image::before {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  content: "";
  top: 0;
  left: 0;
  z-index: 1;
  background: transparent linear-gradient(52deg,
      transparent,
      rgba(0, 0, 0, 0.1) 82%,
      rgba(0, 0, 0, 0.1) 90%,
      rgba(0, 0, 0, 0.1) 100%,
      rgba(0, 0, 0, 0) 0) 0 0 no-repeat padding-box;
}

.tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  color: var(--plain-white, #fff);
  font-family: Urbanist-Bold;
  font-size: 10px;
  line-height: 10px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  z-index: 2;
  user-select: none;
  cursor: pointer;
}

.out-of-stock.tag {
  background: #13141b;
  border: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.hot-selling.tag {
  background: var(--red);
}

.low-in-stock.tag {
  background: var(--primary-orange, #ff4f28);
}

.bxgy.tag {
  background: var(--dark-blue);
}

.offers-section {
  height: 24px;
  width: 100%;
}

.offers-bar {
  width: 100%;
  height: 24px;
  background: var(--active-light, #d7ffe9);
  border: none !important;
  justify-content: flex-start !important;

  color: var(--active-positive, #01c159) !important;
  text-transform: uppercase;
  white-space: nowrap;

  font-size: 11px !important;
  line-height: 8px !important;
}

.offers-bar,
.add-to-cart {
  margin: 6px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 6px;
  box-sizing: border-box;

  color: var(--primary-orange, #fb6c23);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;

  border-radius: 8px;
  border: 1px solid var(--primary-orange, #fb6c23);
  width: 100%;
}

.add-to-cart img {
  width: 20px;
  height: 20px;
}

.disabled {
  border: 1px solid #a9a9a9;
  color: #a9a9a9;
  background: #fefefe;
}

.disabled :deep() svg path {
  stroke: #a9a9a9;
}
</style>