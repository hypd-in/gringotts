<template>
    <div
      class="address-bar-wrapper"
      :class="{ missing: !store.cartInfo?.shipping_address?.id }"
    >
      <div class="home-icon">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.3786 7.95663L16.6586 3.25497C14.827 1.97163 12.0153 2.04163 10.2536 3.40663L4.40865 7.9683C3.24198 8.8783 2.32031 10.745 2.32031 12.215V20.265C2.32031 23.24 4.73531 25.6666 7.71031 25.6666H20.287C23.262 25.6666 25.677 23.2516 25.677 20.2766V12.3666C25.677 10.7916 24.662 8.85497 23.3786 7.95663ZM14.8736 21C14.8736 21.4783 14.477 21.875 13.9986 21.875C13.5203 21.875 13.1236 21.4783 13.1236 21V17.5C13.1236 17.0216 13.5203 16.625 13.9986 16.625C14.477 16.625 14.8736 17.0216 14.8736 17.5V21Z"
            fill="#342546"
          />
        </svg>
      </div>
  
      <div
        class="selected-address-section"
        v-if="store.cartInfo?.shipping_address"
      >
        <div class="delivery-details">
          <span id="heading">Deliver to: </span>
          <span id="details">
            {{ store.cartInfo?.shipping_address?.display_name }},
            {{ store.cartInfo?.shipping_address?.postal_code }}
          </span>
        </div>
        <div class="plain-address">
          <span>
            {{ store.cartInfo?.shipping_address?.plain_address }}
          </span>
        </div>
      </div>
  
      <div class="heading" @click="openAddress" v-else>Add Address</div>
  
      <div class="change-address-btn">
        <button @click="openAddress">
          {{ store.cartInfo?.shipping_address ? "Change" : "Add address" }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>

  const store = useStore();
  const emit = defineEmits(["goToLogin", "openAddresses"]);
  
  function openAddress() {
    if (
      !store.user?.id ||
      !store.user?.full_name ||
      !store.user?.email ||
      store.user?.full_name == "" ||
      store.user?.email == ""
    ) {
      emit("goToLogin");
    } else {
      emit("openAddresses");
    }
  }
  </script>
  
  <style scoped>
  @media only screen and (max-width: 520px) {
    .address-bar-wrapper.missing {
      border-top: 1px solid;
      border-bottom: 1px solid;
    }
  }
  .address-bar-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    box-sizing: border-box;
    width: 100%;
    /* background: var(--plain-white, #fff); */
    user-select: none;
  }
  .address-bar-wrapper.missing {
    border-color: rgb(255, 160, 160);
  }
  .address-bar-wrapper * {
    box-sizing: border-box;
  }
  .home-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }
  .delivery-details #heading {
    color: var(--primary-purple, #342546);
    font-family: Urbanist-Regular;
    font-size: 11px;
    line-height: 15px;
    letter-spacing: 0.4px;
  }
  .delivery-details #details {
    color: var(--primary-black, #13141b);
    font-family: Urbanist-Bold;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: 0.4px;
  }
  .plain-address span {
    color: var(--primary-black, #13141b);
    font-family: Urbanist-Regular;
    font-size: 11px;
    line-height: 15px;
    letter-spacing: 0.4px;
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .selected-address-section div {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100%);
  }
  
  .selected-address-section,
  .heading {
    width: calc(100% - 28px - 16px - 84px);
  }
  
  button {
    text-transform: capitalize;
    color: var(--dark-blue, #2597df);
    font-family: Urbanist-Medium;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.2px;
    border-bottom: 0.5px dotted var(--dark-blue, #2597df);
    width: fit-content;
    white-space: nowrap;
    cursor: pointer;
  }
  
  .change-address-btn {
    width: 84px;
    text-align: center;
    background: var(--plain-white, #fff);
  }
  </style>