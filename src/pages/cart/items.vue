<template>
  <div class="cart-items-container">
    <!-- Gift eligible items -->
    <div v-show="!route.query.isExpress &&
      getObjectLength(list_items.giftEligibleItems) > 0
      " class="gift-eligible-items cart-items-wrapper">
      <div v-for="(giftItems, key) in list_items.giftEligibleItems" :key="key">
        <CartItem :bxGyFreeItem="true" :isGiftFree="true" class="cart-item" :itemInfo="item"
          v-for="item in giftItems.gift" :key="item.variant_id" :showAvailableCoupons="!store.cartInfo.coupon" />
      </div>
    </div>

    <div v-if="list_items.couponItems.length > 0" class="bxgy-items cart-items-wrapper">
      <div v-for="item in list_items.couponItems" :key="item.id" class="cart-item">
        <CartItem v-if="item.coupon_applied && !checkBxgy(item)" :itemInfo="item" class="cart-item" />
        <CartItem v-else-if="item.coupon_applied &&
          checkBxgy(item) &&
          item.quantity - item.coupon_applied.quantity > 0
          " :itemInfo="{
    ...item,
    quantity: item.quantity - item.coupon_applied?.quantity,
  }" class="cart-item buy-item" />
        <CartItem v-if="item.coupon_applied && checkBxgy(item)"
          :itemInfo="{ ...item, quantity: item.coupon_applied?.quantity }" class="cart-item get-item"
          :bxGyFreeItem="true" />
      </div>
    </div>

    <div v-if="!route.query.isExpress &&
      getObjectLength(list_items.eligibleBundleItems) > 0
      " class="eligible-coupon-items cart-items-wrapper">
      <div v-for="(eligibleItems, key) in list_items.eligibleBundleItems" :key="key">
        <CartItem class="cart-item" :itemInfo="item" v-for="item in eligibleItems" :key="item.variant_id"
          :showAvailableCoupons="!store.cartInfo.coupon" />
        <div v-if="!!store.cartCoupons[key] && !store.cartInfo?.coupon" class="applicable-coupons-listing">
          <div class="applicable-coupon">
            <img src="@/assets/icons/common/coupon-tag.svg" alt="" />

            <div class="coupon-info">
              <h5>
                Coupon Available:
                <span class="code">
                  {{ store.cartCoupons[key].code }}
                </span>
              </h5>
              <p>{{ bundleText(store.cartCoupons[key]) }}</p>
              <button v-if="buttonText(store.cartCoupons[key]).length > 0" @click="
                buttonAction(
                  store.cartCoupons[key],
                  buttonText(store.cartCoupons[key])
                )
                ">
                {{ buttonText(store.cartCoupons[key]) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="list_items.inStockItems.length > 0" class="in-stock-items cart-items-wrapper">
      <CartItem class="cart-item" :itemInfo="item" v-for="item in list_items.inStockItems" :key="item.variant_id"
        :showAvailableCoupons="!store.cartInfo.coupon" />
    </div>

    <div v-if="list_items.outOfStockItems.length > 0" class="out-of-stock-items cart-items-wrapper">
      <CartItem class="oos-item cart-item" :itemInfo="item" v-for="item in list_items.outOfStockItems"
        :key="item.variant_id" />
    </div>
  </div>
</template>

<script setup>

definePageMeta({
  name: "CartItems",
});

import CartItem from "@/components/CartComponents/CartItem.vue";
import { computed } from "vue";
import { getObjectLength } from "@/utils/helperMethods";
import { applyCartCoupon } from "@/utils/globalAPIs";

const route = useRoute();
const router = useRouter();
const store = useStore();

const creatorStore = useCreatorStore();

function checkBxgy(item) {
  return (
    item.retail_price?.value * item.coupon_applied?.quantity -
    item.coupon_applied?.value ==
    item.coupon_applied?.quantity &&
    item.quantity - item.coupon_applied?.quantity >= 0
  );
}
// Not in use method
const bxgy_item_list = () => {
  let bxgy_items = {
    x_ids: {},
    y_ids: {},
  };
  let coupon = store?.cartInfo?.coupon;
  let x_count = 0;
  let y_count = 0;
  let cart_items = getObjectLength(store.cartItems);
  for (let i = 0; i < cart_items.length; i++) {
    if (cart_items[i].bxgy) {
      bxgy_items.y_ids[cart_items[i].variant_id] += bxgy.quantity;
    } else if (
      coupon.applicable_on.bxgy.buy_ids.includes(cart_items[i].catalog_info.id)
    ) {
      bxgy_items.x_ids[cart_items[i].variant_id] += cart_items[i].quantity;
    }
  }
};

function bundleEligibility(coupon) {
  var totalEligibleItemsInCart = list_items.value?.eligibleBundleItems[
    coupon.id
  ].reduce((count, item) => count + item?.quantity, 0);
  if (totalEligibleItemsInCart >= coupon.applicable_on.bundle.quantity) {
    return coupon.applicable_on.bundle.quantity;
  }
  return totalEligibleItemsInCart;
}

function buttonText(coupon) {
  var bundle = coupon?.applicable_on?.bundle;
  var totalEligibleItemsInCart = bundleEligibility(coupon);
  if (bundle?.quantity - totalEligibleItemsInCart == 0) {
    return `Apply Coupon`;
  } else if (
    bundle.type == "single-sku" &&
    bundle?.quantity - totalEligibleItemsInCart !== 0
  ) {
    return "";
  } else {
    return `View eligible items`;
  }
}

function bundleText(coupon) {
  var bundle = coupon?.applicable_on?.bundle;
  var totalEligibleItemsInCart = bundleEligibility(coupon);
  if (bundle?.quantity - totalEligibleItemsInCart == 0) {
    return `Click on 'Apply Coupon' to avail this coupon`;
  }
  if (bundle.type != "single-sku") {
    return `Add ${bundle?.quantity - totalEligibleItemsInCart
      } more products to avail this offer.`;
  } else {
    return `Increase product quantity by ${bundle?.quantity - totalEligibleItemsInCart
      } to avail this offer.`;
  }
}
function buttonAction(coupon, buttonText) {
  if (buttonText == "Apply Coupon") {
    if (store.user?.id) {
      applyCartCoupon(coupon.code);
    } else {
      let ans = confirm("Let's get you logged in first?");
      if (ans) {
        router.push({
          name: "login",
          query: {
            redirection_url: route.fullPath,
          },
        });
      }
    }
  } else {
    goToEligibleProducts(coupon);
  }
}
function goToEligibleProducts(coupon) {
  router.push({
    name: "CouponEligibleProducts",
    params: {
      creator_username: creatorStore?.info?.username,
      id: coupon.id,
    },
  });
}

const list_items = computed(() => {
  let inStockItems = [];
  let bxgyItems = [];
  let eligibleBundleItems = {};
  let couponItems = [];
  let outOfStockItems = [];
  let giftEligibleItems = {};
  store.setGiftsEligibleForCart({});

  if (getObjectLength(store.cartItems) > 0) {
    Object.values(store.cartItems).forEach((item) => {
      let itemInfo = item.variants[item?.variant_id];
      let applicableCoupon = getAvailableCoupons(item);

      // Condition for Out of Stock Item
      if (
        itemInfo?.inventory_info?.status?.value == "out_of_stock" ||
        item?.quantity > itemInfo?.inventory_info?.unit_in_stock
      ) {
        outOfStockItems.push(item);
      }

      // Condition for Coupon Applied Items
      else if (item.coupon_applied) {
        // checking gift with other coupons
        if (
          (store.brandWiseGifts[item.brand_id] &&
            store.brandWiseCartItems[item.brand_id]) ||
          (store.brandWiseGifts[item.brand_id] &&
            !store.brandWiseCartItems[item.brand_id] &&
            item.gift_item &&
            item.quantity == 1)
        ) {
          // if gift on this brnad exists, add to offer list
          if (!giftEligibleItems[item.brand_id]) {
            giftEligibleItems[item.brand_id] = {};
            couponItems.push(item);
          } else {
            couponItems.push(item);
          }

          // if item in coupon is gift, mark as gift
          if (item.gift_item && item.quantity > 1) {
            // not all are gift
            if (item.quantity - item.gift_item.quantity != 0) {
              couponItems.push({
                ...item,
                quantity: item.quantity - item.gift_item.quantity,
              });
            }
            giftEligibleItems[item.brand_id] = {
              gift: giftEligibleItems[item.brand_id]?.gift ?  [...giftEligibleItems[item.brand_id]?.gift] : [],
            };
            giftEligibleItems[item.brand_id].gift.push({
              ...item,
              quantity: item.gift_item.quantity,
            });
          }
          store.setGiftsEligibleForCart({ ...giftEligibleItems });
          // else push in normal coupons array
        } else {
          couponItems.push(item);
        }
      }

      // Condition for eligible Bundle Coupons
      // else if (applicableCoupon?.length > 0 && !route.query.isExpress) {
      //   applicableCoupon.forEach((coupon) => {
      //     if (!eligibleBundleItems[coupon?.id]) {
      //       eligibleBundleItems[coupon?.id] = [];
      //     }
      //     eligibleBundleItems[coupon?.id].push(item);
      //   });
      // }

      // Condition for instock item
      else if (
        itemInfo?.inventory_info?.status?.value != "out_of_stock" &&
        item?.quantity <= itemInfo?.inventory_info?.unit_in_stock
      ) {
        // Condition for Gift eligible items
        if (
          (store.brandWiseGifts[item.brand_id] &&
            store.brandWiseCartItems[item.brand_id]) ||
          (store.brandWiseGifts[item.brand_id] &&
            !store.brandWiseCartItems[item.brand_id] &&
            item.gift_item &&
            item.quantity == 1)
        ) {
          if (!giftEligibleItems[item.brand_id]) {
            giftEligibleItems[item.brand_id] = {
              items: [],
            };
          }

          // if the item is also the gift and quantity is 1
          if (item.gift_item && item.quantity == 1) {
            giftEligibleItems[item.brand_id] = {
              ...giftEligibleItems[item.brand_id],
              gift: giftEligibleItems[item.brand_id]?.gift ?  [...giftEligibleItems[item.brand_id]?.gift] : [],
            };
            giftEligibleItems[item.brand_id].gift.push(item);
          }
          // if the item is also the gift and quantity is >1
          else if (item.gift_item && item.quantity > 1) {
            giftEligibleItems[item.brand_id] = {
              ...giftEligibleItems[item.brand_id],
              gift: giftEligibleItems[item.brand_id]?.gift ?  [...giftEligibleItems[item.brand_id]?.gift] : [],
            };
            giftEligibleItems[item.brand_id].gift.push({
              ...item,
              quantity: item.gift_item.quantity,
            });

            // not all are gift
            if (item.quantity - item.gift_item.quantity != 0) {
              inStockItems.push({
                ...item,
                quantity: item.quantity - item.gift_item.quantity,
              });
            }
          } else {
            inStockItems.push(item);
          }
          store.setGiftsEligibleForCart({ ...giftEligibleItems });
        } else {
          inStockItems.push(item);
        }
      }
    });
  }
  return {
    inStockItems,
    bxgyItems,
    couponItems,
    outOfStockItems,
    eligibleBundleItems,
    giftEligibleItems,
  };
});

function getAvailableCoupons(item) {
  var availableCoupons = [];
  if (store.couponsMap[item.catalog_id]?.length > 0) {
    availableCoupons = store.couponsMap[item.catalog_id].filter(
      (coupon) => {
        return coupon.applicable_on.name === "bundle";
      }
    );
    return availableCoupons;
  } else if (store.couponsMap[item.brand_id]?.length > 0) {
    availableCoupons = store.couponsMap[item.brand_id].filter(
      (coupon) => {
        return coupon.applicable_on.name === "bundle";
      }
    );
  }
  return availableCoupons;
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .cart-items-container {
    width: 100%;
    border: none !important;
    border-radius: 0 !important;
    background: none !important;
  }

  .cart-items-wrapper {
    border-radius: 0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
  }

  .eligible-coupon-items {
    background: #fff;
  }

  .gift-eligible-items {
    background: #fff;
  }
}

.cart-items-wrapper {
  border: 1px solid var(--primary-border-color);
  border-radius: 12px;
  overflow: hidden;
  margin: 12px auto;
}

.cart-items-container {
  max-width: 520px;
}

.cart-item {
  border-top: 1px solid var(--primary-border-color);
}

.cart-items-wrapper .cart-item-wrapper:first-of-type {
  border-top: 0px !important;
}

.applicable-coupons-listing {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  grid-column: 1 / span 3;
  overflow: scroll hidden;
  padding: 16px;
}

.applicable-coupons-listing::-webkit-scrollbar {
  height: 0;
  width: 0;
}

.scrollable-coupon-element .applicable-coupon {
  min-width: calc(100% - 64px);
}

.applicable-coupon {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #e6f9ee;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  position: relative;
}

h5 {
  color: var(--primary-dark, #13141b);
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.2px;
  margin: 2px 0 0;
}

p {
  margin: 2px 0 4px;
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Regular;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.2px;
}

button {
  color: var(--primary-orange, #fb6c23);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.2px;
}

button:hover {
  text-decoration: underline;
}

.applicable-coupon .code {
  display: inline-flex;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;

  border-radius: 2px;
  border: 1px dashed #004d23;
  background: #01c159;

  color: #fff;
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
}
</style>
