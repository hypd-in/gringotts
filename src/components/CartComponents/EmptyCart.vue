<template>
    <div class="empty-cart-container">
      <img src="/_nuxt/assets/illustrations/no-orders.png" alt="" />
      <div class="heading">Your Cart Is Empty</div>
      <div class="sub-text">
        You have not added products to your cart, you can visit any creator store
        and add products to cart
      </div>
      <Button
        type="primary"
        style="width: 100%; max-width: 180px"
        defaultText="Go to store"
        @submit="goToInfluencerProfile"
      />
    </div>
  </template>
  
  <script setup>
  import Button from "@/components/Submit.vue";
  import { getCreatorUserName } from "@/utils/helperMethods.js";

  const router = useRouter();
  // Methods
  async function goToInfluencerProfile() {
    let creator_username = await getCreatorUserName();
    if (!creator_username) {
      return;
    }
    router.push({
      name: "creator_store",
      params: { creator_username: creator_username },
    });
  }
  </script>
  
  <style scoped>
  .empty-cart-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 24;
    text-align: center;
  
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 520px;
    width: calc(100% - 32px);
  }
  .heading {
    color: #292f33;
    text-align: center;
    font-family: Urbanist-Bold;
    font-size: 18px;
    line-height: 23px;
    padding: 24px 0 0;
  }
  .sub-text {
    color: var(--secondary-text, #5c5c5c);
    text-align: center;
    font-family: Urbanist-Medium;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.4px;
    padding: 0 0 24px;
  }
  </style>