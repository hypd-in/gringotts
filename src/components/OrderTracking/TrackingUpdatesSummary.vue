<template>
  <div class="tracking-updates-wrapper">
    <div class="courier-info" v-if="trackingId && courierPartner">
      <div class="courier-partner-info" v-if="courierPartner">
        <span>Courier partner</span>
        <span> {{ courierPartner }} </span>
      </div>
      <div class="tracking-info" :class="{
        'disabled-tracking-info': exchangeTrackingId,
      }" v-if="trackingId">
        <span>Tracking ID</span>
        <span class="tracking-id">
          {{ trackingId }}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.66602 7.3333L14.1327 1.86664" stroke="#585858" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M14.6668 4.53331V1.33331H11.4668" stroke="#585858" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M7.33398 1.33331H6.00065C2.66732 1.33331 1.33398 2.66665 1.33398 5.99998V9.99998C1.33398 13.3333 2.66732 14.6666 6.00065 14.6666H10.0007C13.334 14.6666 14.6673 13.3333 14.6673 9.99998V8.66665"
              stroke="#585858" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
      <div class="tracking-info" v-if="exchangeTrackingId">
        <span>Exchange Tracking ID</span>
        <span class="tracking-id">
          {{ exchangeTrackingId }}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.66602 7.3333L14.1327 1.86664" stroke="#585858" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M14.6668 4.53331V1.33331H11.4668" stroke="#585858" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M7.33398 1.33331H6.00065C2.66732 1.33331 1.33398 2.66665 1.33398 5.99998V9.99998C1.33398 13.3333 2.66732 14.6666 6.00065 14.6666H10.0007C13.334 14.6666 14.6673 13.3333 14.6673 9.99998V8.66665"
              stroke="#585858" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <div class="order-info" v-else>
      <span>Order Id</span>
      <span>#{{ store.orderDetails?.order_id }}</span>
    </div>

    <div class="seperator"></div>

    <div class="tracking-updates-container">
      <div v-for="status in trackingInfo" :key="status?.code" class="tracking-updates-summary" :class="{
        'current-order-status':
          status?.code == checkOrderStatus()?.code &&
          status?.created_at == checkOrderStatus()?.created_at,
      }">
        <div class="tracking-status-container">
          <svg class="icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M0 13C0 5.8203 5.8203 0 13 0H19C26.1797 0 32 5.8203 32 13V19C32 26.1797 26.1797 32 19 32H13C5.8203 32 0 26.1797 0 19V13Z"
              fill="#23D087" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M9 16.4254L13.5659 21L22.3333 12.2413L21.0745 11L13.5659 18.4999L10.2413 15.1754L9 16.4254Z"
              fill="white" />
          </svg>

          <div class="order-status">
            {{ readableOrderStatus[status?.code] || status?.code }}
          </div>
          <div class="order-status-date" v-if="!status?.checkpoint || !showTrackingDetails">
            {{ formatDate(status?.created_at) }}
          </div>
        </div>
        <div class="status-checkpoints" v-if="status?.checkpoint && showTrackingDetails">
          <div class="checkpoint" v-for="checkpoint in status?.checkpoint" :key="checkpoint?.created_at">
            <div class="checkpoint-identifier"></div>
            <div class="checkpoint-info">
              <div class="checkpoint-status">
                <span>
                  {{
                    readableOrderStatus[checkpoint?.code] || checkpoint?.code
                  }}
                  -
                </span>
                <span>{{ formatDateWithTime(checkpoint.created_at) }}</span>
              </div>
              <div class="checkpoint-message">
                <span>
                  {{
                    checkpoint.code == "tracking-id-generated"
                    ? trackingId
                    : checkpoint.msg
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button v-if="!showTrackingDetails" class="updates-btn" @click="openTrackingInfo">
      <span> See all updates </span>
      <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M4.56024 4.00001C4.56024 4.14339 4.50549 4.28675 4.39625 4.39605L0.956379 7.83589C0.737571 8.0547 0.382782 8.0547 0.164054 7.83589C-0.0546846 7.61716 -0.0546846 7.26245 0.164054 7.04362L3.20784 4.00002L0.164163 0.956392C-0.0545653 0.737574 -0.0545653 0.382905 0.164163 0.164196C0.382892 -0.0547314 0.737671 -0.0547314 0.956489 0.164196L4.39636 3.60397C4.50564 3.71334 4.56025 3.85669 4.56025 4.00002L4.56024 4.00001Z"
          fill="#2597DF" />
      </svg>
    </button>
  </div>
</template>

<script setup>
// Imports

// Options declaration
const props = defineProps({
  trackingInfo: Object,
});
const store = useStore();
const route = useRoute();
const router = useRouter();

// Computed Properties
const courierPartner = computed(() => {
  return (
    store.orderDetails?.item?.exchange?.tracking_info?.courier_name ||
    store.orderDetails?.trackingInfo?.courier_name ||
    store.orderDetails?.courier_name
  );
});
const exchangeTrackingId = computed(() => {
  return store.orderDetails?.item?.exchange?.tracking_info?.tracking_id;
});

const trackingId = computed(() => {
  return (
    store.orderDetails?.trackingInfo?.tracking_id ||
    store.orderDetails?.tracking_id
  );
});

// Data variables
const readableOrderStatus = ref({
  initiated: "order placed",
  failed: "Awaiting Payment",
  confirmed: "processing",
  "tracking-id-generated": "order packed",
  "out-for-delivery": "out for delivery",
  "cancel-brand": "cancelled",
  "cancel-user": "cancelled",
  rto: "returned",
  "exchange-confirmed": "Exchange Confirmed",
  "return-declined": "Return declined",
  "return-approved": "Return approved",
});

const showTrackingDetails = ref(false);

defineExpose({
  showTrackingDetails,
});
// Lifecycle Hooks
onMounted(() => { });
// Methods
function formatDate(date) {
  var options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timezone: "Asia/Calcutta",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
}

function formatDateWithTime(date) {
  var options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timezone: "Asia/Calcutta",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
}

function openTrackingInfo() {
  showTrackingDetails.value = true;
}

function checkOrderStatus() {
  if (props.trackingInfo?.slice(-1)[0]?.code == "delivered") {
    return false;
  }
  return props.trackingInfo?.slice(-1)[0];
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .full-screen .tracking-updates-container {
    max-height: calc(100dvh - 238px) !important;
  }
}

.tracking-updates-wrapper {
  padding: 16px;
  box-sizing: border-box;
}

.tracking-updates-wrapper * {
  box-sizing: border-box;
  user-select: none;
}

.courier-info {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  align-items: center;
  gap: 16px;
  justify-content: flex-start;
  box-sizing: border-box;
}

.order-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.order-info span:last-of-type {
  color: var(--dark-blue);
  font-family: "Urbanist-Medium";
}

.courier-partner-info span:first-of-type,
.tracking-info span:first-of-type {
  color: var(--secondary-text, #585858);
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 16px;
}

.courier-partner-info,
.tracking-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
}

.courier-info span:last-of-type,
.tracking-info span:last-of-type {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-SemiBold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: -0.4px;
  cursor: pointer;
}

.tracking-info span:last-of-type {
  color: var(--dark-blue, #2597df);
}

.disabled-tracking-info span:last-of-type {
  color: var(--disabled-text);
  cursor: not-allowed;
}

.seperator {
  width: 100%;
  margin: 16px auto 0;
  box-sizing: border-box;
  height: 0.5px;
  background: #0000001a;
}

.tracking-updates-container {
  padding: 0 0 16px;
  overflow: hidden auto;
  max-height: calc(100dvh - 475px);
}

.tracking-updates-container::-webkit-scrollbar {
  width: 4px;
}

.tracking-updates-container::-webkit-scrollbar-thumb {
  background: var(--secondary-text, #a9a9a9);
}

.tracking-updates-summary {
  margin: 24px 0 0;
  position: relative;
}

.tracking-status-container {
  display: grid;
  grid-template-columns: 32px calc(100% - 80px - 64px) 80px;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.tracking-updates-summary::before {
  position: absolute;
  z-index: -1;
  content: "";
  height: 36px;
  width: 1px;
  background-color: var(--green);
  color: var(--green);
  bottom: 100%;
  left: 16px;
}

.tracking-updates-summary:first-of-type::before {
  display: none;
}

.order-status {
  text-transform: capitalize;
  color: #13141b;
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.4px;
}

.updates-btn {
  color: #2597df;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.4px;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0 0;
}

.updates-btn:hover span {
  text-decoration: underline;
}

.current-order-status .order-status {
  font-family: "Urbanist-Bold";
  color: var(--primary-orange);
}

.current-order-status svg path:first-of-type {
  fill: var(--primary-orange);
}

.current-order-status::before {
  background-color: var(--primary-orange);
}

.order-status-date {
  color: var(--secondary-text, #a9a9a9);
  text-align: right;
  font-family: Urbanist-Medium;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.325px;
}

.status-checkpoints {
  padding: 16px 0 0;
}

.checkpoint {
  text-transform: capitalize;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.325px;
  font-family: Urbanist-Medium;
  padding: 16px 12.5px;
  position: relative;

  display: flex;
  align-items: center;
  gap: 16px;
}

.checkpoint-info span {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.checkpoint:last-of-type {
  padding: 16px 12.5px 0;
}

.checkpoint-identifier {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  box-sizing: border-box;
}

.checkpoint::before {
  position: absolute;
  content: "";
  height: 60px;
  top: -30px;
  left: 16px;
  border-right: 1px dashed var(--green);
  z-index: -1;
}

.checkpoint-status span:first-of-type {
  color: #13141b;
  font-family: Urbanist-Bold;
}

.checkpoint-status span:nth-child(2) {
  color: #585858;
}

.checkpoint:last-of-type .checkpoint-identifier {
  border: 2px solid var(--green);
  background: var(--plain-white);
}

.checkpoint-info {
  width: calc(100% - 32px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.current-order-status .checkpoint-identifier {
  background: var(--primary-orange);
}

.current-order-status .checkpoint:last-of-type .checkpoint-identifier {
  border: 2px solid var(--primary-orange);
}

.current-order-status .checkpoint::before {
  border-color: var(--primary-orange);
}
</style>