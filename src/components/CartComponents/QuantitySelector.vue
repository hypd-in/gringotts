<template>
  <div class="quantity-selector-wrapper">
    <div @click="closePopup" class="backdrop"></div>
    <div class="quantity-selector-container bottom-sheet-container">
      <div class="heading">Update Quantity</div>
      <!-- <div class="sub-heading">Units in stock: {{itemQuantity}}</div> -->
      <div class="quantity-listing" :class="{ wiggle: showError != '' }">
        <!-- <div
          class="quantity-container"
          @click="updateItemQuantity(i)"
          :class="{ 'selected-quantity': i == itemInfo?.quantity }"
          v-for="i in itemQuantity"
          :key="i"
        >
          {{ i }}
        </div> -->

        <div v-if="!decreasingQuantity" @click="updateItemQuantity(-1)"
          :class="{ 'disabled-btn': itemInfo?.quantity <= 1 }" class="quantity-container decrease-quantity">
          <svg v-if="!decreasingQuantity" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div v-else class="small-rolling-spinner rolling-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div class="item-quantity">{{ itemInfo?.quantity }}</div>

        <div @click="updateItemQuantity(1)" v-if="!increasingQuantity" :class="{
          'disabled-btn':
            !itemInfo?.variants[itemInfo?.variant_id]?.inventory_info
              ?.unit_in_stock ||
            itemInfo?.quantity ==
            itemInfo?.variants[itemInfo?.variant_id]?.inventory_info
              ?.unit_in_stock,
        }" class="quantity-container increase-quantity">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.82837 12H18.8284" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M12.8284 18V6" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div v-else class="small-rolling-spinner rolling-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div class="error">
        <transition name="slide-fade-in">
          <span v-if="showError != ''">
            {{ showError }}
          </span>
        </transition>
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
import { updateCartItemQuantity } from "@/utils/cartMethods";
import { ref } from "vue";
import { removeCouponFromCart } from "@/utils/globalAPIs.js";

const props = defineProps({
  itemInfo: Object,
});
const emit = defineEmits(["close"]);

const increasingQuantity = ref(false);
const decreasingQuantity = ref(false);
const errorTimeout = ref(null);
const showError = ref("");
const store = useStore();

// const itemQuantity = computed(() => {
//   if (
//     props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info
//       ?.unit_in_stock
//   ) {
//     if (
//       props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info
//         ?.unit_in_stock <= 100 &&
//       props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info
//         ?.unit_in_stock > 0
//     ) {
//       return props.itemInfo?.variants[props.itemInfo?.variant_id]
//         ?.inventory_info?.unit_in_stock;
//     } else {
//       return 100;
//     }
//   } else {
//     return 0;
//   }
// });

async function updateItemQuantity(newQuantity) {
  if (showError.value?.length > 0) {
    clearTimeout(errorTimeout.value);
    showError.value = "";
  }
  if (
    props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info?.status
      ?.value == "out_of_stock" ||
    (newQuantity == 1 &&
      props.itemInfo?.variants[props.itemInfo?.variant_id]?.inventory_info
        ?.unit_in_stock <= props.itemInfo?.quantity) ||
    (newQuantity == -1 && props.itemInfo?.quantity <= 1)
  ) {
    showError.value = `Sorry! that's all we have right now!`;
    errorTimeout.value = setTimeout(() => {
      showError.value = "";
    }, 1300);
    return;
  }

  switch (newQuantity) {
    case 1: {
      increasingQuantity.value = true;
      break;
    }
    case -1: {
      decreasingQuantity.value = true;
      break;
    }
    default: {
      return;
    }
  }
  if (
    store.cartInfo?.coupon?.applicable_on.name == "bxgy" &&
    ([
      ...store.cartInfo.coupon.applicable_on.bxgy.get_ids,
      ...store.cartInfo.coupon.applicable_on.bxgy.buy_ids,
    ].includes(props.itemInfo.catalog_id) ||
      [
        ...store.cartInfo.coupon.applicable_on.bxgy.get_ids,
        ...store.cartInfo.coupon.applicable_on.bxgy.buy_ids,
      ].includes(props.itemInfo.brand_id))
  ) {
    removeCouponFromCart();
  }
  await updateCartItemQuantity(props.itemInfo?.variant_id, newQuantity);
  increasingQuantity.value = false;
  decreasingQuantity.value = false;
  emit("close");
}

function closePopup() {
  emit("close");
}
</script>

<style scoped>
.heading {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 22px;
  padding: 32px 32px 0;
}

.backdrop {
  z-index: 41;
}

.bottom-sheet-container {
  padding: 0;
  z-index: 42;
}

.error {
  position: absolute;
  bottom: 10px;
  left: 32px;
}

.error span {
  display: block;
  color: var(--red);
  font-family: "Urbanist-Regular";
  font-size: 12px;
  letter-spacing: 0.2px;
  line-height: 16px;
}

.wiggle {
  animation: wiggle 0.35s linear;
}

.quantity-listing {
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: auto hidden;
  padding: 16px 32px;
  margin: 0 auto 24px;
}

.quantity-container {
  display: flex;
  min-width: 48px;
  height: 48px;
  padding: 14px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  border-radius: 14px;
  background: #f9f9f9;
  box-sizing: border-box;

  white-space: nowrap;

  color: var(--primary-black, #13141b);
  text-align: right;
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  user-select: none;
  cursor: pointer;
}

.quantity-listing::-webkit-scrollbar {
  height: 2px;
}

.quantity-listing::-webkit-scrollbar-thumb {
  background: var(--dark-hover);
}

.item-quantity {
  font-family: "Urbanist-Bold";
  font-size: 24px;
  line-height: 28px;
  letter-spacing: 0.2px;
}

.disabled-btn svg {
  opacity: 0.25;
}

/* .disabled-btn::after{
  content: "";
  position: absolute;
  transform: rotate(-45deg);
  z-index: 1;
  background: var(--secondary-text);
  top: 0;
  width: 1px;
  height: 100%;
} */
</style>