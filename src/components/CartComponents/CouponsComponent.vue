<template>
  <div class="coupons-wrapper">
    <div class="backdrop" @click="closePopup"></div>
    <div class="coupons-container">
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
      <div class="heading">Coupons</div>
      <div class="coupon-input-container">
        <input @click="trackCouponInputClick" type="text" v-model="coupon_code" placeholder="Enter Coupon Code..."
          v-on:keyup.enter="applyCoupon" />
        <span class="apply-btn" @click="applyCoupon"
          :class="{ 'disabled-apply-btn': (coupon_code.length < 3) }">APPLY</span>
      </div>
      <div class="search-bar" v-if="getObjectLength(store.cartCoupons) > 0"></div>
      <div class="sub-heading" v-if="getObjectLength(store.cartCoupons) > 0">
        Available Coupons:
      </div>

      <section class="coupons-section">
        <CouponCard v-for="coupon in coupons_list" :key="coupon.id" :couponInfo="coupon" @close="closePopup" />
        <div class="empty-screen" v-if="getObjectLength(store.cartCoupons) == 0">
          Sorry! There are no offers available for this cart
        </div>
      </section>
    </div>
  </div>
</template>
  
<script setup>
import CouponCard from "./CouponCard.vue";
import { applyExpressCoupon, applyCartCoupon } from "@/utils/globalAPIs";
import { ref } from "vue";
import { getObjectLength } from "@/utils/helperMethods";
import track from "~/utils/tracking-posthog";

const props = defineProps({
  coupons_list: Object,
});

const emit = defineEmits(["close"]);
const store = useStore();
const closePopup = () => {
  emit("close");
};
const coupon_code = ref("");
const route = useRoute();
const applyCoupon = async () => {
  track("cart_coupon:coupon_code_submit", {
    coupon_code: coupon_code.value
  })

  let payload = null;
  if (route.query.isExpress) {
    payload = await applyExpressCoupon(coupon_code.value);
  } else {
    payload = await applyCartCoupon(coupon_code.value);
  }
  if (payload) {
    track('cart_coupon:code_add', { ...store.cartDataToTrack, coupon: { ...store.cartDataToTrack.coupon, discount_added: payload.coupon_value.value, discount_removed: 0 } })
  }

  emit("close");
};

function trackCouponInputClick() {
  track('cart_coupon:enter_coupon_click')
}

</script> 
  
<style scoped>
.apply-btn {
  color: #fb6c23;
  font-size: 14px;
  cursor: pointer;
}

.coupon-input-container {
  border: 1px solid #c7c7c7;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  font-family: "Urbanist-Bold";
  margin-bottom: 12px;
}

.coupon-input-container input {
  border: none;
  outline: none;
  width: calc(100%);
}

.disabled-apply-btn {
  opacity: 0.6;
}

.coupons-container {
  background: var(--plain-white, #fff);
  max-width: 520px;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 55;
  padding: 0 16px;
  box-sizing: border-box;
}

.coupons-container * {
  box-sizing: border-box;
}

.heading {
  margin: 24px auto 18px;
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 0.2px;
  width: 100%;
  text-align: center;
}

.sub-heading {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.2px;
  width: 100%;
  margin: 0 auto 12px;
}

.coupons-section {
  height: calc(100vh - 23px - 24px - 18px - 18px - 12px - 59.5px);
  height: calc(100dvh - 23px - 24px - 18px - 18px - 12px - 59.5px);
  overflow: hidden scroll;
}

.coupons-section::-webkit-scrollbar {
  width: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 18px;
  z-index: 24;
  cursor: pointer;
}
</style>