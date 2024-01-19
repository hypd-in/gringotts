<template>
    <div class="pricing-info-wrapper" :key="store.cartInfo.shipping_charges">
      <div class="heading">Price Details</div>
      <div class="seperator"></div>
  
      <div class="pricing-info-container">
        <div
          class="pricing-container total-price"
          v-if="store.cartInfo?.total_price"
        >
          <span>Total Price</span>
          <span>{{
            convertToINR(store.cartInfo?.total_price?.value)
          }}</span>
        </div>
  
        <div
          class="pricing-container retail-discount"
          v-if="store.cartInfo?.total_discount"
        >
          <span>Discount On MRP</span>
          <span>
            -
            {{ convertToINR(store.cartInfo?.total_discount?.value) }}</span
          >
        </div>
  
        <div
          class="pricing-container retail-discount"
          v-if="store.cartInfo?.coupon_value?.value > 0"
        >
          <span>Coupon Discount</span>
          <span>
            - {{ convertToINR(store.cartInfo?.coupon_value?.value) }}</span
          >
        </div>
  
        <div
          class="pricing-container delivery-charges"
          v-if="store.cartInfo?.shipping_charges_value >= 0"
        >
          <span>Shipping Charges</span>
          <span>{{
            convertToINR(store.cartInfo.shipping_charges_value)
          }}</span>
        </div>
  
        <div class="pricing-container convenience-fee">
          <span>Convenience Fee</span>
          <div>
            <span style="text-decoration: line-through">₹100</span>
            <span style="padding-left: 4px; color: #01c159">Free</span>
          </div>
        </div>
      </div>
  
      <div class="seperator"></div>
      <div
        class="pricing-container grand-total"
        v-if="store.cartInfo?.grand_total"
      >
        <span>Grand Total</span>
        <span>
          {{ convertToINR(store.cartInfo?.grand_total?.value) }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { convertToINR } from "@/utils/helperMethods";
  // variables
  const store = useStore();
  
  </script>
  
  <style scoped>
  .pricing-info-wrapper {
    padding: 16px;
    background: var(--plain-white, #fff);
    color: var(--secondary-text, #5c5c5c);
    font-family: Urbanist-Medium;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.2px;
    user-select: none;
  }
  
  .heading {
    color: var(--dark-purple, #13141b);
    font-family: Urbanist-Bold;
    font-size: 16px;
    line-height: 21px;
    letter-spacing: 0.2px;
  }
  
  .seperator {
    background: #e3e3e3;
    height: 0.5px;
    width: 100%;
    margin: 12px 0;
  }
  
  .pricing-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  
    padding: 6px 0;
    box-sizing: border-box;
  }
  
  .grand-total span {
    color: var(--dark-purple, #13141b);
    font-family: Urbanist-Bold;
    font-size: 16px;
    line-height: 21px;
    letter-spacing: 0.2px;
  }
  </style>