<template>
  <div class="cancel-order-popup">
    <div class="backdrop" @click="closePopup"></div>
    <div class="cancel-order">
      <div class="top-bar"></div>
      <div class="popup-title">
        <div class="title bold t-black">{{ title }}</div>
        <img src="~/assets/icons/misc/close.svg" class="icon pointer" @click="closePopup" style="justify-self: flex-end"
          width="30px" alt="" />
      </div>
      <div class="reasons" id="reasons">
        <div v-for="(reason, index) in reasons" :key="index" class="reason-container pointer"
          @click="selectReason(reason)">
          <div class="selector" :class="{ selected: selectedReason === reason }">
            <div class="selected-inside"></div>
          </div>
          <div class="reason pointer medium" :class="{
            't-black': selectedReason === reason,
            't-grey': selectedReason !== reason,
          }">
            {{ reason }}
          </div>
        </div>
        <div class="otherReason" v-if="selectedReason === 'Others (Please Specify)'">
          <textarea v-model="reasonForCancellation" placeholder="Please mention the reason to cancel your order." name=""
            id="otherReason" ref="otherReason" cols="30" rows="5"></textarea>
        </div>
      </div>

      <div class="no-refund-banner" v-if="order.payment_mode === 'cod'">
        <div class="no-refund-rectangle">
          <div class="no-refund-content">
            No refund as your order was Cash on delivery
          </div>
        </div>
      </div>

      <div class="refund-cancelation-wrapper">
        <div class="refund-details">
          <div class="refund-amount-label">Refund Details</div>
          <div class="refundable-amount">
            {{ convertToINR(refundableAmount) }}
          </div>
          <div @click="goToProduct" class="view-policy-btn">View Policy</div>
        </div>
        <div class="cancel-btn" @click="cancelOrder">
          <SubmitButton :loading="cancellingOrder" defaultText="Continue" :disabled="disabledState"
            :style="'width: 100%; color: rgb(255, 255, 255);'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SubmitButton from "@/components/SubmitButton.vue";

const config = useRuntimeConfig();

const title = "Reason for Cancellation"
const reasons = [
  "I want to change the payment method",
  "I want to change my Address/Phone no",
  "I want a different size/colour",
  "I think the delivery time mentioned is too late or early",
  "I've changed my mind, don't need the product anymore",
  "I forgot to apply the coupon code",
  "Others (Please Specify)",
]


const refundableAmount = ref(0);
const refundStatus = ref(null);

const reasonForCancellation = ref(null);
const selectedReason = ref(null);
const selected = ref(false);
const otherReason = ref(null);
const cancellingOrder = ref(false);

const emit = defineEmits(["close"]);
const props = defineProps({
  order: Object,
})

const orderDetails = computed(() => {
  return props.order
})

const disabledState = computed(() => {
  return (selectedReason.value == "Others (Please Specify)" && reasonForCancellation.value == "") || !selectedReason.value
})

function closePopup() {
  emit("close");
}

async function goToProduct() {
  let path = {
    name: "CreatorProduct",
    params: {
      creatorUsername: await getCreatorUserName(orderDetails.value.item?.source?.id),
      id: orderDetails.value?.item?.catalog_info?.id,
    },
    query: {
      title: orderDetails.value?.item?.catalog_info?.name,
    },
  };
  navigateTo(path);
}

function selectReason(input) {
  selectedReason.value = input;
  if (selectedReason.value === "Others (Please Specify)") {
    reasonForCancellation.value = "";
    setTimeout(() => {
      otherReason.value.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  }
}

async function cancelOrder() {
  try {
    if (selectedReason.value) {
      var reason = selectedReason.value;
      if (selectedReason.value === "Others (Please Specify)") {
        reason = reasonForCancellation.value;
      }
    }
    cancellingOrder.value = true;
    var response = await $fetch(`${config.public.orderURL}/api/order/item/cancel`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        item_id: orderDetails.value.item?.id,
        reason: reason,
      }
    })
    if (response.payload) {
      trackingRefund(orderDetails.value);
      emit("close");
    }
    cancellingOrder.value = false;
  } catch (error) {
    cancellingOrder.value = false;
    console.log("Error cancelling your order", error);
    alert("Sorry! we couldn't cancel your order");
  }
}

async function getRefundDetails() {
  try {
    var response = await $fetch(`${config.public.orderURL}/api/order/item/${orderDetails.value?.item?.id}/refund`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.payload) {
      refundableAmount.value = response.payload.amount;
      refundStatus.value = response.payload.status;
    }
  } catch (error) {
    console.log("Error fetching refund details using item_id", error);
  }
}

onMounted(async () => {
  if (orderDetails.value.item?.id) {
    await getRefundDetails();
  }
  document.body.style.overflow = "hidden";
})

onBeforeUnmount(() => {
  document.body.style.overflow = "scroll";
})
</script>

<style scoped>
.order-item-container {
  overflow: hidden;
}

.backdrop {
  width: 100%;
  height: 100%;
  background-color: #000000d0;
  top: 0px;
  position: fixed;
  z-index: 2147483001;
}

.cancel-order {
  display: grid;
  gap: 10px;
  text-align: center;
  align-items: center;
  max-width: 480px;
  height: auto;
  padding: 30px;
  width: 100%;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  z-index: 30000000000;
}

.popup-title {
  display: grid;
  grid-template-columns: 75% 25%;
  justify-content: center;
  align-items: center;
}

.title {
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.4px;
}

.otherReason {
  padding: 16px 0;
}

.otherReason textarea {
  padding: 20px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  width: calc(100% - 32px - 12px);
  outline: none;
  font: normal normal normal 14px/16px Urbanist-Medium;
  letter-spacing: 0;
  resize: none;
}

textarea::placeholder {
  color: #a9a9a9;
}

.policy {
  justify-self: flex-end;
  text-align: right;
  border-bottom: 1px dashed #fb6c23;
}

.reason-container {
  display: grid;
  grid-template-columns: 18px calc(100% - 18px - 10px);
  gap: 10px;
  align-items: flex-start;
  border-bottom: 0.5px solid #e0e0e0;
  padding: 16px 0;

  font: normal normal normal 16px/18px Urbanist-Medium;
  letter-spacing: 0;
  color: #585858;
}

.reasons .reason-container:last-of-type {
  border: none;
  padding-bottom: 20px;
}

.selector {
  width: 16px;
  height: 16px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition-duration: 0.15s;
}

.reason-container:hover>.selector {
  border: 1px solid #fb6c23;
}

.reason-container:hover>.reason {
  color: #13141b;
}

.selected-inside {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #fb6c23;
  display: none;
}

.selected {
  border: 1px solid #fb6c23;
}

.selected>.selected-inside {
  display: block;
}

.reason {
  text-align: left;
  transition-duration: 0.15s;
  font-size: 14px;
}

.no-refund-banner {
  width: calc(100%);
  box-sizing: border-box;
}

.no-refund-rectangle {
  width: 100%;
  position: relative;
  background: #f5f5f5;
  border-radius: 8px;
}

.no-refund-content {
  font-family: "Urbanist-Medium";
  font-size: 12px;
  padding: 8px;
  line-height: 16px;
  color: #13141b;
  opacity: 0.6;
}

.refund-cancelation-wrapper {
  display: flex;
  margin: 0 0 10px;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.refund-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.refund-amount-label {
  font-family: "Urbanist-Bold";
  font-size: 12px;
  line-height: 16px;
  color: #13141b;
  opacity: 0.6;
  text-transform: uppercase;
}

.refundable-amount {
  font: 17px/20px Edmondsans-Bold;
  color: #13141b;
}

.view-policy-btn {
  font-family: "Urbanist-Medium";
  font-size: 12px;
  line-height: 16px;
  color: #2597df;
  text-decoration: underline;
  cursor: pointer;
}

.cancel-btn {
  width: 60%;
  text-align: center;
  /* background: #fb6c23; */
  border-radius: 20px;
  justify-self: center;
  align-self: flex-end;
}

.disabled-cancel-btn {
  pointer-events: none !important;
  background: #eaeaea !important;
}

.top-bar {
  display: none;
  overflow-y: hidden;
}

.reasons {
  max-height: 510px;
  overflow-y: scroll;
  height: auto;
  overflow-x: hidden;
}

/* Mobile Design */
@media screen and (max-width: 520px) {
  .cancel-order {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    top: 30vh;
    bottom: 0;
    left: 0%;
    width: 100%;
    max-height: 70vh;
    margin: 0px auto;
    position: fixed;
    box-sizing: border-box;
    border-radius: 40px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    padding: 0px 20px;
    transform: translateX(0%);
    overflow: hidden;
  }

  .top-bar {
    width: 40px;
    height: 4px;
    opacity: 0.2;
    margin: 10px auto;
    background: #2c365a;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
  }

  .popup-title {
    grid-template-columns: 100%;
    justify-self: flex-start;
  }

  .title {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    display: none;
  }

  .reasons {
    height: 100%;
    overflow-y: scroll;
  }

  .cancel-btn {
    align-self: center;
  }
}

/* Helper Style */
.pointer {
  cursor: pointer;
}

.bold {
  font-family: Urbanist-Bold;
}

.medium {
  font-family: Urbanist-Medium;
}

.light {
  font-family: Urbanist-Light;
}

.f-24 {
  font-size: 24px;
}

.f-18 {
  font-size: 18px;
}

.f-16 {
  font-size: 16px;
}

.f-14 {
  font-size: 14px;
}

.t-black {
  color: #13141b;
}

.t-orange {
  color: #fb6c23;
}

.t-grey {
  color: #a9a9a9;
}

.t-white {
  color: #ffffff;
}

.icon {
  width: 18px;
}
</style>
