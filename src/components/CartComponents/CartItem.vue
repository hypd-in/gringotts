<template>
  <div class="cart-item-wrapper" :class="{
    'bxgy-item': bxGyFreeItem,
    'oos-item': isVariantOutOfStock || isUnitsOutOfStock,
  }">
    <section class="image-section">
      <ImageFrame @click="goToProductPage" v-if="itemInfo?.catalog_info?.featured_image" class="cart-item-image"
        border_radius="8px" :src="optimizeImage(itemInfo?.catalog_info?.featured_image?.src, 300)" />
    </section>
    <section class="item-info-section">
      <div class="item-info">
        <div class="brand-name">{{ itemInfo?.brand_info?.name }}</div>
        <div class="product-name">
          {{ itemInfo?.catalog_info?.name }}
        </div>
        <div class="pricing-info">
          <span id="retail-price" :class="{ 'bxgy-text': bxGyFreeItem }">
            {{
              convertToINR(
                bxGyFreeItem
                  ? itemInfo?.coupon_applied?.quantity ||
                  itemInfo?.gift_item?.value ||
                  1
                  : itemInfo?.retail_price?.value
              )
            }}
          </span>
          <span id="base-price" v-if="itemInfo?.retail_price?.value < itemInfo?.base_price?.value">
            {{ convertToINR(itemInfo?.base_price?.value) }}
          </span>
          <span id="base-price" v-else-if="itemInfo?.retail_price?.value && bxGyFreeItem">
            {{ convertToINR(itemInfo?.retail_price?.value) }}
          </span>
          <span id="discount" v-if="itemInfo?.base_price?.value > itemInfo?.retail_price?.value &&
            !bxGyFreeItem
            ">
            ({{
              Math.floor(
                ((itemInfo?.base_price?.value - itemInfo?.retail_price?.value) /
                  itemInfo?.base_price?.value) *
                100
              )
            }}% off)
          </span>
          <span class="bxgy-text" v-else-if="bxGyFreeItem"> 99% off </span>
        </div>
      </div>

      <div class="size-quantity-selector">
        <div class="selector variant-selector" :class="{
          'oos-variant': isVariantOutOfStock,
          'disabled-selector': isItemOutOfStock,
        }" @click="toggleVariantSelector">
          <span> {{ itemInfo?.catalog_info?.variant_type }}: </span>
          <span>{{ itemInfo?.variants[itemInfo?.variant_id]?.attribute }}</span>
          <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.30312 4.22913L5.58646 6.94579C5.26562 7.26663 4.74062 7.26663 4.41979 6.94579L1.70312 4.22913"
              stroke="#13141B" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <div v-if="!route.query.isExpress" @click="toggleQuantitySelector" :class="{
          'oos-units': isUnitsOutOfStock,
          'disabled-selector': isItemOutOfStock || isVariantOutOfStock,
        }" class="selector quantity-selector">
          <span>Qty: </span>
          <span v-if="bxGyFreeItem">{{
            itemInfo?.coupon_applied &&
            itemInfo.quantity - itemInfo?.coupon_applied?.quantity > 0
            ? itemInfo.quantity - itemInfo?.coupon_applied?.quantity
            : itemInfo?.quantity
          }}</span>
          <span v-else>
            {{ itemInfo.quantity }}
          </span>
          <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.30312 4.22913L5.58646 6.94579C5.26562 7.26663 4.74062 7.26663 4.41979 6.94579L1.70312 4.22913"
              stroke="#13141B" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <div v-if="isVariantOutOfStock || isUnitsOutOfStock" class="oos-tag">
        <span> Out of stock </span>
        <div class="info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.0026 14.6667C11.6693 14.6667 14.6693 11.6667 14.6693 8.00004C14.6693 4.33337 11.6693 1.33337 8.0026 1.33337C4.33594 1.33337 1.33594 4.33337 1.33594 8.00004C1.33594 11.6667 4.33594 14.6667 8.0026 14.6667Z"
              stroke="#5C5C5C" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 5.33337V8.66671" stroke="#5C5C5C" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10.6666H8.00599" stroke="#5C5C5C" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>

          <span class="oos-message">
            {{ oosMessage }}
          </span>
        </div>
      </div>

      <div v-if="(store.cartInfo?.coupon &&
        isCouponApplied &&
        !(isVariantOutOfStock || isUnitsOutOfStock)) ||
        bxGyFreeItem
        " class="coupon-info-section" :class="{ 'free-coupon': bxGyFreeItem }">
        <!-- Bxgy free -->
        <svg v-if="bxGyFreeItem && !isGiftFree" width="16" height="16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.65926 9.77358L1.64594 8.76024C1.2326 8.3469 1.2326 7.6669 1.64594 7.25356L2.65926 6.24022C2.8326 6.06688 2.9726 5.72688 2.9726 5.48688V4.05353C2.9726 3.46686 3.4526 2.98688 4.03927 2.98688H5.4726C5.7126 2.98688 6.0526 2.8469 6.22593 2.67357L7.23926 1.66022C7.65259 1.24689 8.3326 1.24689 8.74593 1.66022L9.75928 2.67357C9.93261 2.8469 10.2726 2.98688 10.5126 2.98688H11.9459C12.5326 2.98688 13.0126 3.46686 13.0126 4.05353V5.48688C13.0126 5.72688 13.1526 6.06688 13.3259 6.24022L14.3393 7.25356C14.7526 7.6669 14.7526 8.3469 14.3393 8.76024L13.3259 9.77358C13.1526 9.94692 13.0126 10.2869 13.0126 10.5269V11.9602C13.0126 12.5469 12.5326 13.0269 11.9459 13.0269H10.5126C10.2726 13.0269 9.93261 13.1669 9.75928 13.3402L8.74593 14.3536C8.3326 14.7669 7.65259 14.7669 7.23926 14.3536L6.22593 13.3402C6.0526 13.1669 5.7126 13.0269 5.4726 13.0269H4.03927C3.4526 13.0269 2.9726 12.5469 2.9726 11.9602V10.5269C2.9726 10.2803 2.8326 9.94025 2.65926 9.77358Z"
            :stroke="couponColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 10L10 6" :stroke="couponColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9.66561 9.66671H9.6716" :stroke="couponColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M6.32967 6.33333H6.33566" :stroke="couponColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>

        <!-- Gift free -->
        <svg v-else-if="bxGyFreeItem && isGiftFree" width="16" height="16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.6667 13.8211C14.6667 14.7989 13.8667 15.5989 12.8889 15.5989H3.11115C2.13337 15.5989 1.33337 14.7989 1.33337 13.8211V6.26557C1.33337 5.28779 2.13337 4.48779 3.11115 4.48779H12.8889C13.8667 4.48779 14.6667 5.28779 14.6667 6.26557V13.8211Z"
            fill="#FDD888" />
          <path
            d="M16 4.93256C16 5.91034 15.2 6.71034 14.2222 6.71034H1.77778C0.8 6.71034 0 5.91034 0 4.93256C0 3.95479 0.8 3.15479 1.77778 3.15479H14.2222C15.2 3.15479 16 3.95479 16 4.93256Z"
            fill="#FDD888" />
          <path d="M1.33337 6.70996H14.6667V7.59885H1.33337V6.70996Z" fill="#FCAB40" />
          <path
            d="M8.44439 1.37695H7.5555C6.81906 1.37695 6.22217 1.97384 6.22217 2.71029V15.5992H9.77772V2.71029C9.77772 1.97429 9.18083 1.37695 8.44439 1.37695Z"
            fill="#DA2F47" />
          <path
            d="M7.11112 3.1546C7.60001 3.1546 7.67245 2.92527 7.27156 2.64482L4.28401 0.553266C3.88312 0.272822 3.35734 0.390599 3.11468 0.815044L2.21868 2.38304C1.97601 2.80749 2.17779 3.1546 2.66668 3.1546H7.11112ZM8.8889 3.1546C8.40001 3.1546 8.32756 2.92527 8.72845 2.64482L11.7165 0.553266C12.1169 0.272822 12.6431 0.390599 12.8858 0.815044L13.7818 2.3826C14.024 2.80749 13.8222 3.1546 13.3333 3.1546H8.8889Z"
            fill="#DA2F47" />
        </svg>

        <span v-if="bxGyFreeItem && !isGiftFree"> Free </span>
        <span v-else-if="bxGyFreeItem && isGiftFree"> Free Gift </span>
        <span v-else-if="isCouponApplied">
          {{ store.cartInfo?.coupon?.code }} Applied
          <span id="applied-on" v-if="itemInfo.quantity - itemInfo?.coupon_applied?.quantity <=
            itemInfo.quantity &&
            itemInfo.quantity - itemInfo?.coupon_applied?.quantity >= 0
            ">
            {{ `on ${itemInfo?.coupon_applied?.quantity} items` }}
          </span>
        </span>
      </div>
    </section>

    <button @click="toggleWishlistItemPopup" class="delete-icon" v-if="!bxGyFreeItem">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.0036 6.72998C20.9836 6.72998 20.9536 6.72998 20.9236 6.72998C15.6336 6.19998 10.3536 5.99998 5.12358 6.52998L3.08358 6.72998C2.66358 6.76998 2.29358 6.46998 2.25358 6.04998C2.21358 5.62998 2.51358 5.26998 2.92358 5.22998L4.96358 5.02998C10.2836 4.48998 15.6736 4.69998 21.0736 5.22998C21.4836 5.26998 21.7836 5.63998 21.7436 6.04998C21.7136 6.43998 21.3836 6.72998 21.0036 6.72998Z"
          fill="#5A5B5F" />
        <path
          d="M8.50074 5.72C8.46074 5.72 8.42074 5.72 8.37074 5.71C7.97074 5.64 7.69074 5.25 7.76074 4.85L7.98074 3.54C8.14074 2.58 8.36074 1.25 10.6907 1.25H13.3107C15.6507 1.25 15.8707 2.63 16.0207 3.55L16.2407 4.85C16.3107 5.26 16.0307 5.65 15.6307 5.71C15.2207 5.78 14.8307 5.5 14.7707 5.1L14.5507 3.8C14.4107 2.93 14.3807 2.76 13.3207 2.76H10.7007C9.64074 2.76 9.62074 2.9 9.47074 3.79L9.24074 5.09C9.18074 5.46 8.86074 5.72 8.50074 5.72Z"
          fill="#5A5B5F" />
        <path
          d="M15.2104 22.75H8.79039C5.30039 22.75 5.16039 20.82 5.05039 19.26L4.40039 9.18995C4.37039 8.77995 4.69039 8.41995 5.10039 8.38995C5.52039 8.36995 5.87039 8.67995 5.90039 9.08995L6.55039 19.16C6.66039 20.68 6.70039 21.25 8.79039 21.25H15.2104C17.3104 21.25 17.3504 20.68 17.4504 19.16L18.1004 9.08995C18.1304 8.67995 18.4904 8.36995 18.9004 8.38995C19.3104 8.41995 19.6304 8.76995 19.6004 9.18995L18.9504 19.26C18.8404 20.82 18.7004 22.75 15.2104 22.75Z"
          fill="#5A5B5F" />
        <path
          d="M13.6581 17.25H10.3281C9.91813 17.25 9.57812 16.91 9.57812 16.5C9.57812 16.09 9.91813 15.75 10.3281 15.75H13.6581C14.0681 15.75 14.4081 16.09 14.4081 16.5C14.4081 16.91 14.0681 17.25 13.6581 17.25Z"
          fill="#5A5B5F" />
        <path
          d="M14.5 13.25H9.5C9.09 13.25 8.75 12.91 8.75 12.5C8.75 12.09 9.09 11.75 9.5 11.75H14.5C14.91 11.75 15.25 12.09 15.25 12.5C15.25 12.91 14.91 13.25 14.5 13.25Z"
          fill="#5A5B5F" />
      </svg>
    </button>

    <MoveToWishlistPopup @close="toggleWishlistItemPopup" :itemInfo="itemInfo" v-if="showMoveToWishlistPopup" />
    <VariantSelector v-if="showVariantSelector" @close="toggleVariantSelector" :itemInfo="itemInfo" />
    <QuantitySelector v-if="showQuantitySelector" @close="toggleQuantitySelector" :itemInfo="itemInfo" />
  </div>
</template>
  
<script setup>
import ImageFrame from "../ImageFrame.vue";
import { convertToINR, getCreatorUserName, optimizeImage } from "@/utils/helperMethods.js";
import { computed, reactive, ref } from "vue";
import MoveToWishlistPopup from "./MoveToWishlistPopup.vue";
import VariantSelector from "./VariantSelector.vue";
import QuantitySelector from "./QuantitySelector.vue";

const props = defineProps({
  itemInfo: Object,
  bxGyFreeItem: Boolean,
  isGiftFree: Boolean,
  showAvailableCoupons: Boolean,
});

const store = useStore();
const router = useRouter();
const route = useRoute();
const couponColor = ref("01C159");
const applicableCoupons = ref({});
const bundleCoupons = ref([]);
couponColor.value = props.bxGyFreeItem ? "#ffffff" : "#01C159";
// Popup navigation guard
onBeforeRouteLeave((to, from) => {
  if (
    (from.name == "CartItems" || from.name == "CartPayment") &&
    (showVariantSelector.value ||
      showQuantitySelector.value ||
      showMoveToWishlistPopup.value)
  ) {
    showVariantSelector.value = false;
    showQuantitySelector.value = false;
    showMoveToWishlistPopup.value = false;
    return false;
  }

  return true;
});

const selectedVariant = reactive({});
const variants = ref({});
const showMoveToWishlistPopup = ref(false);
const showVariantSelector = ref(false);
const showQuantitySelector = ref(false);
const isCouponApplied = computed(() => {
  if (route.query.isExpress) {
    return checkCoupon();
  }
  return !!props.itemInfo?.coupon_applied?.name;
});
const oosMessage = computed(() => {
  if (isItemOutOfStock.value) {
    return "This item is currently out of stock, please delete this item";
  } else if (isVariantOutOfStock.value) {
    return `The ${props.itemInfo?.catalog_info?.variant_type} that you have selected is currently not available, please select a different ${props.itemInfo?.catalog_info?.variant_type}`;
  } else if (isUnitsOutOfStock) {
    return "We don't have enough units of this item, please reduce the quantity";
  }
});

const isItemOutOfStock = computed(() => {
  for (let key in props.itemInfo?.variants) {
    if (
      props.itemInfo?.variants[key]?.inventory_info?.status?.value == "in_stock"
    ) {
      return false;
    }
  }
  return true;
});
const isVariantOutOfStock = computed(() => {
  return (
    props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info?.status
      ?.value === "out_of_stock"
  );
});

const isUnitsOutOfStock = computed(() => {
  return (
    props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info
      ?.unit_in_stock < props.itemInfo?.quantity ||
    !props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info
      ?.unit_in_stock
  );
});
function toggleVariantSelector() {
  if (props.isGiftFree) {
    return
  }
  showVariantSelector.value = !showVariantSelector.value;
}

function toggleQuantitySelector() {
  if (props.bxGyFreeItem) {
    return;
  }
  showQuantitySelector.value = !showQuantitySelector.value;
}

function toggleWishlistItemPopup() {
  showMoveToWishlistPopup.value = !showMoveToWishlistPopup.value;
}

async function goToProductPage() {
  if (props.isGiftFree) {
    return
  }
  let creator_username = await getCreatorUserName(props.itemInfo?.source?.id);
  router.push({
    name: "CreatorProduct",
    params: {
      creatorUsername: creator_username,
      id: props.itemInfo?.catalog_info?.id,
    },
    query: {
      title: props.itemInfo?.catalog_info?.name,
    },
  });
}

function checkCoupon() {
  if (store.cartInfo?.coupon) {
    var flag = false;
    if (store.cartInfo?.coupon?.applicable_on?.name == "cart") {
      flag = true;
    } else if (store.cartInfo?.coupon?.applicable_on?.name == "brand") {
      if (
        store.cartInfo?.coupon?.applicable_on.ids.includes(
          props.itemInfo?.brand_info?.id
        )
      ) {
        flag = true;
      }
    } else if (store.cartInfo?.coupon?.applicable_on?.name == "catalog") {
      if (
        store.cartInfo.coupon.applicable_on.ids.includes(
          props.itemInfo?.catalog_info?.id
        )
      ) {
        flag = true;
      }
    }
  }
  return flag;
}
</script>
  
<style scoped>
@media only screen and (max-width: 520px) {
  .cart-item-wrapper {
    border-radius: 0 !important;
  }
}

.cart-item-wrapper {
  display: grid;
  grid-template-columns: 72px calc(100% - 32px - 72px - 24px) 24px;
  gap: 16px;
  padding: 16px;
  align-items: flex-start;
  background: var(--plain-white, #fff);
}

.free-coupon {
  border-radius: 5px;
  background: var(--active-positive, #01c159) !important;
  color: #ffffff !important;
}

.cart-item-image {
  width: 100%;
  height: 105px;
  cursor: pointer;
}

.item-info div {
  padding: 4px 0 0;
  user-select: none;
}

.brand-name {
  color: var(--dark-purple, #13141b);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
}

.variant-selector {
  text-transform: capitalize;
}

.product-name {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-SemiBold;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;

  display: -webkit-box;
  height: 30px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-transform: none;
}

.pricing-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: Urbanist-SemiBold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pricing-info #retail-price {
  color: var(--dark-purple, #13141b);
}

.pricing-info #base-price {
  color: var(--disabled-text, #bebebe);
  font-family: "Urbanist-Medium";
  text-decoration: line-through;
}

.pricing-info #discount {
  color: #01c159;
  font-family: "Urbanist-Bold";
}

.size-quantity-selector {
  display: flex;
  /* grid-template-columns: repeat(auto-fill, minmax(83px, 1fr)); */
  align-items: center;
  gap: 10px;
  margin: 4px 0 0;
}

.selector {
  display: flex;
  padding: 2px 6px;
  justify-content: center;
  align-items: center;
  gap: 6px;

  border-radius: 6px;
  background: #f9f9f9;
  cursor: pointer;
  width: auto;
}

.selector span {
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  user-select: none;
  white-space: nowrap;
}

.selector span:first-of-type {
  color: var(--secondary-text, #5c5c5c);
}

.selector span:last-of-type {
  color: var(--accent-purple, #342546);
  font-family: Urbanist-Bold;
}

.delete-icon {
  cursor: pointer;
}

.coupon-info-section {
  margin: 8px 0 0;
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 5px;
  background: rgba(1, 193, 89, 0.1);
  white-space: nowrap;
  width: fit-content;

  color: var(--active-positive, #01c159);
  text-align: right;
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
}

.bxgy-item {
  background: rgba(1, 193, 89, 0.1);
}

.oos-item .cart-item-image {
  filter: grayscale(100%);
}

.oos-item .product-name,
.oos-item .brand-name,
.oos-item .pricing-info span {
  color: var(--disabled-text, #bebebe) !important;
}

.oos-item .oos-tag {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin: 8px 0 0;

  font-family: Urbanist-Bold;
  font-size: 9px;
  line-height: 7px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--plain-white);
  position: relative;
}

.wiggle {
  animation: wiggle 2s linear 2;
}

.oos-item .oos-tag span {
  background: var(--black, #000);
  border-radius: 4px;
  padding: 4px 6px;
  user-select: none;
  white-space: nowrap;
}

.info:hover .oos-message {
  visibility: visible !important;
}

.oos-item .oos-tag .oos-message {
  visibility: hidden;
  position: absolute;
  z-index: 21;
  bottom: calc(-100% + 42px);
  left: 0;
  background: var(--plain-white);
  color: var(--primary-black);
  text-transform: none;

  color: #585858;
  font-family: Urbanist-Regular;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
  padding: 8px;
  white-space: pre-wrap;
  text-align: center;
}

.oos-message::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 90px;
  transform: rotate(45deg);
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: var(--plain-white);
}

.oos-item .oos-tag svg {
  cursor: pointer;
}

.oos-variant span:nth-child(2) {
  opacity: 0.5;
}

.oos-units span:nth-child(2) {
  opacity: 0.5;
}

.disabled-selector {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.bxgy-text {
  color: #01c159 !important;
}

.show-coupon {
  display: flex !important;
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(0deg);
  }

  75% {
    transform: rotate(10deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.buy-item .applied-on {
  display: none;
}
</style>