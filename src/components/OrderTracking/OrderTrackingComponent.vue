<template>
  <div class="order-tracking-wrapper" :class="{
    'full-screen': trackingUpdatesSummary?.showTrackingDetails,
  }">
    <OrderTrackingHeader @goBack="goBack" title="Order Updates" />
    <div class="backdrop" @click="goBack"></div>
    <div class="order-tracking-container">
      <div class="close-btn" @click="goBack">
        <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Close">
            <g id="add">
              <path id="Union 1" fill-rule="evenodd" clip-rule="evenodd"
                d="M21.6006 24.562L15.9997 19.0172L10.4001 24.5608C9.73705 25.2173 8.66284 25.2173 8 24.5611C7.33789 23.9056 7.33789 22.8421 8.00098 22.1856L13.6006 16.642L7.99975 11.0971C7.33789 10.4418 7.33789 9.37639 8 8.72089C8.66308 8.06443 9.73827 8.0654 10.4001 8.72065L16.001 14.2655L21.6006 8.72186C22.2637 8.0654 23.3379 8.06539 24 8.72088C24.6628 9.37711 24.6628 10.4406 23.9997 11.0971L18.4001 16.6407L24.001 22.1856C24.6631 22.8411 24.6631 23.9046 24 24.5611C23.3379 25.2166 22.2627 25.2176 21.6006 24.562Z"
                fill="#13141B" stroke="#FAFAFA" stroke-width="0.6" />
            </g>
          </g>
        </svg>
      </div>
      <div class="pill"></div>
      <div class="heading">Delivery Status</div>
      <div class="delivery-description">
        <div class="sub-heading">Estimated Delivery Time</div>

        <div class="estimated-date">
          {{ estimatedDate }}
        </div>
      </div>
      <div class="tracking-details-container">
        <TrackingUpdatesSummary ref="trackingUpdatesSummary" :trackingInfo="trackingInfo" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Imports
import OrderTrackingHeader from "./OrderTrackingHeader.vue";
import TrackingUpdatesSummary from "./TrackingUpdatesSummary.vue";

// Declarations
const router = useRouter();
const route = useRoute();
const store = useStore();
const config = useRuntimeConfig();
const orderDetails = ref({});

// Data variables
const trackingInfo = ref({});
const trackingUpdatesSummary = ref(null);
// Computed Properties
const estimatedDate = computed(() => {
  const options = {
    day: "numeric",
    weekday: "short",
    month: "short",
  };
  var finalDate = new Date();
  var addDays = 0;
  if (store?.orderDetails?.created_at) {
    var initialDate = new Date(store?.orderDetails?.created_at);
  }
  if (store?.orderDetails?.item?.item_status?.code === "exchange") {
    initialDate = new Date(
      store?.orderDetails?.item?.item_status?.created_at
    );
  }
  if (route.params.item_id && store.orderDetails?.items) {
    addDays =
      store.orderDetails.items[route.params.item_id]?.catalog_info?.eta
        ?.max;
  }

  if (initialDate && addDays) {
    finalDate.setDate(initialDate.getDate() + addDays);
  }
  return new Intl.DateTimeFormat("en-IN", options).format(finalDate);
});

// Lifecycle Hooks
onMounted(async () => {
  if (!store.orderDetails?.id) {
    await getOrderByItemId();
  }
  saveTrackingInfo();
});


async function getOrderByItemId() {
  try {
    var response = await $fetch(`${config.public.orderURL}/api/order/item/${route.params.itemId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response.payload) {
      orderDetails.value = { ...response.payload };
      store.saveOrderDetails(orderDetails.value);
    }
  } catch (error) {
    alert("Error fetching order details");
    console.log("Error fetching order details", error);
  }
}

// Methods
function goBack() {
  router.go(-1);
}

function saveTrackingInfo() {
  let trackingDetails = [];
  var exchangeOrderStatus = [];
  if (store.orderDetails?.order_status_history) {
    var trackingHistory = {};
    store.orderDetails?.order_status_history?.forEach((status) => {
      if (trackingHistory[status?.code]) {
        if (!trackingHistory[status?.code]["checkpoint"]) {
          trackingHistory[status?.code]["checkpoint"] = [];
        }
        trackingHistory[status?.code]["checkpoint"].push(status);
      } else {
        trackingHistory[status?.code] = status;
      }
    });
    trackingDetails = [...trackingDetails, ...Object.values(trackingHistory)];
  }
  if (store.orderDetails?.item?.item_status_history) {
    store.orderDetails?.item?.item_status_history?.forEach((status) => {
      if (status.code == "exchange-confirmed") {
        var checkpointsArray =
          store.orderDetails?.item?.exchange?.status_history?.filter(
            (status) => {
              return ![
                "cancel-user",
                "cancel-brand",
                "rto",
                "delivered",
                "out-for-delivery",
                "attempt-fail",
                "shipped",
              ].includes(status.code);
            }
          );

        exchangeOrderStatus =
          store.orderDetails?.item?.exchange?.status_history?.filter(
            (status) => {
              return [
                "cancel-user",
                "cancel-brand",
                "rto",
                "delivered",
                "out-for-delivery",
                "attempt-fail",
                "shipped",
              ].includes(status.code);
            }
          );

        if (checkpointsArray.length > 0) {
          status.checkpoint = [...checkpointsArray];
        }
      }
    });

    var itemTrackingHistory = {};
    store.orderDetails?.item?.item_status_history.forEach((status) => {
      if (itemTrackingHistory[status?.code]) {
        if (!itemTrackingHistory[status?.code]["checkpoint"]) {
          itemTrackingHistory[status?.code]["checkpoint"] = [];
        }
        itemTrackingHistory[status?.code]["checkpoint"].push(status);
      } else {
        itemTrackingHistory[status?.code] = status;
      }
    });

    trackingDetails = [
      ...trackingDetails,
      ...Object.values(itemTrackingHistory),
    ];

    if (exchangeOrderStatus?.length > 0) {
      trackingDetails = [...trackingDetails, ...exchangeOrderStatus];
    }
  }
  trackingInfo.value = trackingDetails;
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .order-tracking-container {
    border-radius: 24px 24px 0 0 !important;
    bottom: 0 !important;
    transform: translate(-50%, 0%) !important;
  }

  .full-screen .order-tracking-container {
    height: calc(100dvh - 49px) !important;
    max-height: 100% !important;
    margin: 49px auto 0;
    border-radius: 0px !important;
    padding: 0 !important;
  }

  .full-screen .delivery-description {
    padding: 16px;
    border-bottom: 1px solid #0000001A;
  }

  .full-screen .tracking-details-container {
    border: none !important;
  }


  .full-screen .pill,
  .full-screen .heading,
  .close-btn {
    display: none !important;
  }

  .pill {
    display: block !important;
  }
}

.backdrop {
  z-index: 2147483001;
}

.order-tracking-wrapper * {
  box-sizing: border-box;
}

.order-tracking-container {
  background: var(--plain-white, #fff);
  width: 100%;
  padding: 16px;
  position: fixed;
  min-height: 16dvh;
  z-index: 2147483002;
  max-width: 520px;
  max-height: 80dvh;

  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  border-radius: 24px;
}

.pill {
  display: none;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: #2c365a;
  opacity: 0.2;
}

.heading {
  color: #13141b;
  text-align: center;
  font-family: Urbanist-Bold;
  font-size: 24px;
  line-height: 32px;
  padding: 16px 0 0;
  letter-spacing: -0.6px;
}

.delivery-description {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.delivery-description .sub-heading {
  color: var(--secondary-text, #585858);
  text-align: center;
  font-family: Urbanist-Regular;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.45px;
}

.delivery-description .estimated-date {
  color: var(--primary-orange, #fb6c23);
  text-align: center;
  font-family: Urbanist-Bold;
  font-size: 30px;
  line-height: 44px;
  letter-spacing: -0.75px;
}

.delivery-description .estimated-time {
  color: #13141b;
  text-align: center;
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: -0.4px;
}

.tracking-details-container {
  border: 1px solid var(--primary-border-color);
  border-radius: 16px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}
</style>