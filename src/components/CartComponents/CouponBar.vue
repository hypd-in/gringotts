<template>
    <div>
      <div
        class="coupon-bar-wrapper"
        @click="toggleCouponListing"
        :class="{ 'selected-coupon-bar': store.cartInfo?.coupon }"
      >
        <div class="coupon-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.98499 14.6604L2.465 13.1404C1.845 12.5204 1.845 11.5004 2.465 10.8804L3.98499 9.36039C4.24499 9.10039 4.45499 8.59038 4.45499 8.23038V6.08036C4.45499 5.20036 5.175 4.48038 6.055 4.48038H8.20499C8.56499 4.48038 9.075 4.27041 9.335 4.01041L10.855 2.49039C11.475 1.87039 12.495 1.87039 13.115 2.49039L14.635 4.01041C14.895 4.27041 15.405 4.48038 15.765 4.48038H17.915C18.795 4.48038 19.515 5.20036 19.515 6.08036V8.23038C19.515 8.59038 19.725 9.10039 19.985 9.36039L21.505 10.8804C22.125 11.5004 22.125 12.5204 21.505 13.1404L19.985 14.6604C19.725 14.9204 19.515 15.4304 19.515 15.7904V17.9403C19.515 18.8203 18.795 19.5404 17.915 19.5404H15.765C15.405 19.5404 14.895 19.7504 14.635 20.0104L13.115 21.5304C12.495 22.1504 11.475 22.1504 10.855 21.5304L9.335 20.0104C9.075 19.7504 8.56499 19.5404 8.20499 19.5404H6.055C5.175 19.5404 4.45499 18.8203 4.45499 17.9403V15.7904C4.45499 15.4204 4.24499 14.9104 3.98499 14.6604Z"
              stroke="#5C5C5C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9 15L15 9"
              stroke="#5C5C5C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14.4945 14.5H14.5035"
              stroke="#5C5C5C"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.49451 9.5H9.50349"
              stroke="#5C5C5C"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
  
        <div class="coupon-info">
          <div class="coupon-details" v-if="store.cartInfo?.coupon">
            <div class="coupon-name">
              "<span>{{ store.cartInfo?.coupon?.code }}</span
              >" applied
            </div>
            <div class="coupon-description">
              {{ store.cartInfo?.coupon?.description }}
            </div>
          </div>
          <div class="apply-coupon" v-else>Apply Coupon</div>
        </div>
  
        <div class="selector">
          <div class="arrow-icon" v-if="!store.cartInfo?.coupon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.96875 2.72003L10.3154 7.0667C10.8288 7.58003 10.8288 8.42003 10.3154 8.93336L5.96875 13.28"
                stroke="#13141B"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="cross-icon" @click.stop="removeCouponFromCart()" v-else>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.17188 5.17163L10.8287 10.8285"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.17127 10.8285L10.8281 5.17163"
                stroke="#292D32"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <CouponsComponent
        @close="toggleCouponListing"
        v-if="showCouponListing"
        :coupons_list="coupons_list"
      />
    </div>
  </template>
  
  <script setup>
  import CouponsComponent from "@/components/CartComponents/CouponsComponent.vue";
  import { removeCouponFromCart, fetchAllCoupons } from "@/utils/globalAPIs";
  import { onMounted, ref } from "vue";
  import {
    synthesizingCoupon,
  } from "@/utils/globalAPIs";
  import { useRoute } from "vue-router";
  
  const emit = defineEmits(["goToLogin"]);
  const route = useRoute();
  const showCouponListing = ref(false);
  const coupons_list = ref([]);

  const store  = useStore()

  onMounted(() => {
    // if (store?.cartInfo?.id) {
    //   setTimeout(() => {
    //     autoApplyCart("bxgy");
    //   }, 500);
    // }
    sortCoupons();
  });
  async function toggleCouponListing() {
    if (
      !store.user?.id ||
      !store.user?.full_name ||
      !store.user?.email ||
      store.user?.full_name == "" ||
      store.user?.email == ""
    ) {
      emit("goToLogin");
      return;
    }
    if (showCouponListing.value == false) {
      await fetchAllCoupons();
      sortCoupons();
      showCouponListing.value = true;
    } else {
      showCouponListing.value = false;
    }
  }
  
  function sortCoupons() {
    let sorted_Coupons = [];
    for (let i = 0; i < Object.keys(store.cartCoupons).length; i++) {
      let coupon_id = Object.keys(store.cartCoupons)[i];
  
      let discount = 0;
      let coupon_msg = "";
      let disabled = false;
      let priorty_lvl = 0;
      let temp = synthesizingCoupon(store.cartCoupons[coupon_id]);
      discount = temp.discount;
      coupon_msg = temp.coupon_msg;
      disabled = temp.disabled;
      priorty_lvl = temp.priorty_lvl;
  
      sorted_Coupons.push({
        ...store.cartCoupons[coupon_id],
        discount,
        coupon_msg,
        disabled,
        priorty_lvl,
      });
    }
    let elegible_bxgy = [];
    let not_applicable_coupons_list = [];
    let applicable_coupons_list = [];
    let eligibleBundle = [];
  
    sorted_Coupons.sort((x, y) => {
      return y.discount - x.discount;
    });
  
    not_applicable_coupons_list = sorted_Coupons.filter((c) => c.disabled);
    applicable_coupons_list = sorted_Coupons.filter(
      (c) => c.discount != 0 && c.type != "bxgy"
    );
    elegible_bxgy = sorted_Coupons.filter((c) => !c.disabled && c.type == "bxgy");
    eligibleBundle = sorted_Coupons.filter(
      (c) => !c.disabled && c.type == "bundle"
    );
  
    not_applicable_coupons_list.sort((x, y) => {
      return x.priorty_lvl - y.priorty_lvl;
    });
  
    coupons_list.value = [
      ...eligibleBundle,
      ...elegible_bxgy,
      ...applicable_coupons_list,
      ...not_applicable_coupons_list,
    ];
    if (
      store.cartInfo?.coupon?.id &&
      !route.query.isExpress &&
      store.user?.id
    ) {
      let index = coupons_list.value.findIndex((coupon) => {
        return coupon.id == store.cartInfo?.coupon?.id;
      });
      if (index > -1) {
        let a = coupons_list.value.splice(index, 1);
        coupons_list.value.unshift(a[0]);
      }
    }
  }
  </script>
  
  <style scoped>
  .coupon-bar-wrapper {
    display: grid;
    grid-template-columns: 24px auto 24px;
    gap: 12px;
    padding: 12px 16px;
    background: none;
    align-items: center;
    user-select: none;
    cursor: pointer;
  }
  
  .selected-coupon-bar {
    background: #fff5f0 !important;
  }
  
  .apply-coupon {
    color: var(--secondary-text, #5c5c5c);
    font-family: Urbanist-Bold;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.4px;
  }
  
  .coupon-icon,
  .arrow-icon,
  .cross-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cross-icon svg {
    width: 21px;
    height: 21px;
  }
  
  .coupon-name {
    color: var(--dark-purple, #13141b);
    font-family: Urbanist-Bold;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.4px;
  }
  
  .coupon-description {
    color: var(--secondary-text, #5c5c5c);
    font-family: Urbanist-Regular;
    font-size: 12px;
    line-height: 16px;
  }
  .coupon-name span {
    color: var(--links, #4791ff);
  }
  </style>