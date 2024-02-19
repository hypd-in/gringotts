<template>
  <div class="order-card">
    <OrderTrackingComponent :isPopup="true" :itemId="selectedItemId" v-if="showOrderTracking"
      @close="toggleTrackingPopup" />
    <div class="order-details-bar">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 24px;">
        <span id="order-id">Order: #{{ orderInfo.order_id }}</span>
        <span id="order-date">Date: {{ formatDate(orderInfo.created_at) }}</span>
      </div>
      <!-- <div class="bar-buttons">
        <button @click="goToOrderDetails" id="details">Order Details</button>
        |
        <button v-if="!['initiated', 'failed'].includes(orderStatus)" @click="downloadOrderReceipt" id="download">Download
          Receipt</button>
      </div> -->
    </div>

    <div class="order-items">
      <div class="order-item" v-for="item in orderInfo.items" :key="item.id">
        <div class="order-status-chip" v-if="item?.item_status?.code || orderInfo?.order_status?.code"
          :class="item?.item_status?.code || orderInfo?.order_status?.code">
          <span class="label">{{ readableOrderStatus[item?.item_status?.code] ||
            readableOrderStatus[orderInfo?.order_status?.code] }}</span>: <span v-if="item?.item_status?.created_at">
            {{ formatDateWithTime(item?.item_status?.created_at) }}
          </span> <span v-else-if="orderInfo.order_status.created_at">{{
            formatDateWithTime(orderInfo.order_status.created_at)
          }}</span>
        </div>
        <div class="order-item-info">
          <div class="item-info-wrapper">
            <NuxtImg width="78" height="110" :placeholder="[78, 110, 75, 20]" style="border-radius: 12px;"
              :src="item?.catalog_info?.featured_image?.src" />
            <div class="item-details">
              <div class="item-info">
                <h5 class="brand-name">
                  {{ orderInfo?.brand_info?.name }}
                </h5>
                <h3 class="product-name">
                  {{ item?.catalog_info?.name }}
                </h3>
              </div>

              <div class="item-specifications">
                <div class="variant-info">
                  <label for="">{{ item?.catalog_info?.variant_type }}</label>
                  <p>{{ item?.catalog_info?.variant?.attribute }}</p>
                </div>
                <div class="price-info">
                  <label for="">Price</label>
                  <p v-if="!item.gift_item">{{ convertToINR(item?.total_price?.value) }}</p>
                  <p v-else-if="item.gift_item?.value">{{ convertToINR(item?.gift_item?.value) }}</p>
                </div>
                <div class="variant-info">
                  <label for="">Qty.</label>
                  <p>{{ item?.quantity }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="button-section">
            <button @click="goToOrderDetails(item?.id)" class="order-details">Item Details</button>
            <button v-if="showTrackOrder(item)" class="track-order" @click="toggleTrackingPopup(item?.id)">Track
              Order</button>
            <SubmitButton v-else @click="reorder(item)" defaultText="Re Order" :loading="addingToCart" class="reorder" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import OrderTrackingComponent from '~/components/OrderTracking/OrderTrackingComponent.vue';

import track from "../../utils/tracking-posthog"
import SubmitButton from '../SubmitButton.vue';


const props = defineProps({
  orderInfo: Object,
})
const store = useStore();
const creatorStore = useCreatorStore();

const addingToCart = ref(false);
const selectedItemId = ref(null);
const showOrderTracking = ref(false);
const readableOrderStatus = ref({
  initiated: "Awaiting Payment",
  failed: "Order Failed",
  confirmed: "Confirmed",
  "tracking-id-generated": "Order packed",
  "out-for-delivery": "Out for delivery",
  "cancel-brand": "Cancelled",
  "cancel-user": "Cancelled",
  rto: "Returned",
  shipped: "In Transit",
  // "exchange-confirmed": "Exchange Confirmed",
  // "return-declined": "Return declined",
  // "return-approved": "Return approved",
  "delivered": "Delivered"
});

const orderStatus = computed(() => {
  return props.orderInfo?.order_status?.code;
})

const showReorder = computed(() => {
  if (['delivered', 'cancel-brand', 'cancel-user', 'rto', 'failed'].includes(orderStatus.value)) {
    return true;
  } else {
    return false;
  }
})
function showTrackOrder(item) {
  if (['cancel-user', 'cancel-brand'].includes(item?.item_status?.code)) {
    return false;
  } else if (['confirmed', 'tracking-id-generated', 'shipped', 'out-for-delivery'].includes(orderStatus.value)) {
    return true;
  } else {
    return false;
  }
}

function toggleTrackingPopup(id) {
  if (id) {
    selectedItemId.value = id;
  }
  showOrderTracking.value = !showOrderTracking.value;
  if (showOrderTracking.value) {
    track("order:item_track_order_click", {
      order_no: props.orderInfo?.order_id,
      item_id: id,
      brand_id: props.orderInfo?.brand_info?.id
    })
  }
}

function formatDate(orderDate) {
  var date = new Date(orderDate);
  return new Intl.DateTimeFormat('en-IN', {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function formatDateWithTime(statusDate) {
  var date = new Date(statusDate);
  return new Intl.DateTimeFormat('en-IN', {
    month: "short",
    day: "numeric",
    hour: "numeric",
    year: "2-digit",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

async function reorder(item) {
  if (
    !!store.cartItems[item?.variant_id]
  ) {
    navigateTo({
      name: "CartItems",
    })
    return;
  }

  var itemInfo = {
    variant_id: item?.variant_id,
    catalog_id: item?.catalog_info?.id,
    brand_id: props.orderInfo?.brand_info?.id,
    brand_name: props.orderInfo?.brand_info?.name,
    name: item?.catalog_info.name,
    price: item?.retail_price.value,
    quantity: 1,
  };
  if (creatorStore.info?.id) {
    itemInfo["source"] = {
      id: creatorStore.info?.id,
      type: "creator_store",
    };
  }
  if (store.user?.id) {
    itemInfo["id"] = store.user.id;
    addingToCart.value = true;
    await addItemToCart(itemInfo);
    addingToCart.value = false;
    navigateTo({
      name: "CartItems",
    })
  }
}

function goToOrderDetails(id) {
  track('order:item_detail_click', {
    order_no: props.orderInfo?.order_id,
    item_id: id,
    brand_id: props.orderInfo?.brand_info?.id
  })
  navigateTo({
    name: "OrderDetails",
    params: {
      itemId: id,
    }
  })
}

// onMounted(() => {
//   console.log("Order Info", props.orderInfo);
// })
</script>


<style scoped>
@media only screen and (max-width: 520px) {
  /* .order-details-bar {
    grid-template-columns: 100% !important;
    grid-template-rows: repeat(2, auto);
  } */

  .order-item-info {
    width: 100% !important;
    grid-template-columns: 100% !important;
    grid-template-rows: repeat(2, auto);
  }

  .order-item {
    padding: 16px 0;
  }

  .button-section {
    box-sizing: border-box;
    width: 100% !important;
    flex-direction: row !important;
    padding: 16px 24px !important;
    justify-content: center;
  }

  .button-section button {
    min-width: calc(50% - 16px) !important;
  }

  /* .bar-buttons{
    justify-content: flex-start !important;
  } */

  button#download {
    display: none;
  }

  .order-status-chip {
    margin: 0 0 0 16px !important;
  }
}

.order-card {
  min-height: 200px;
  box-sizing: border-box;
  border: 1px solid var(--primary-border-color);
  border-radius: 16px;
  margin: 16px auto 32px;
  overflow: hidden;
}

.order-details-bar {
  /* display: grid;
  grid-template-columns: repeat(2, 50%);
  justify-content: center;
  align-items: center; */
  font-family: Urbanist-Medium;
  font-size: 14px;
  color: var(--secondary-text);
  background: #f5f5f5;
  padding: 16px 24px;
}

.bar-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-end;
}

button#download {
  color: #349ee1;
}

button {
  text-decoration: underline;
}

.order-items {
  font-family: Urbanist-Regular;
  font-size: 16px;
  color: var(--primary-black);
}

.order-item {
  border-bottom: 1px solid var(--primary-border-color);
}

.order-item-info {
  display: grid;
  grid-template-columns: 60% 40%;
  box-sizing: border-box;
  width: 100%;
}

.order-status-chip {
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.25px;
  min-width: 120px;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 12px 0 0 24px;
  color: #2597df;
  background: #2597df1a;
}

.order-status-chip .label {
  font-family: Urbanist-SemiBold;
}

.delivered {
  background: #23d0871a !important;
  color: #23d087 !important;
}

.cancel-user,
.cancel-brand,
.failed {
  color: #fc404d !important;
  background: #fc404d1a !important;
}

.confirmed {
  color: #2597df;
  background: #2597df1a;
}

.initiated {
  color: #df9e25;
  background: #df9e251a;
}

.order-items .order-item:last-of-type {
  border-bottom: none;
}

.order-item .item-info-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 24px;
  cursor: default;
  user-select: none;
}


h5,
h3 {
  padding: 0;
  margin: 0;
}

.brand-name {
  font-family: Urbanist-Medium;
  font-size: 14px;
  color: #a9a9a9;
}

.product-name {
  font-family: Urbanist-Medium;
  font-size: 16px;
  padding: 4px 0 0;
}


.item-specifications {
  padding: 12px 0 0;
  display: grid;
  grid-template-columns: 60px 60px 40px;
  align-items: center;
  gap: 18px;
}

.item-specifications label {
  font-size: 14px;
  text-transform: capitalize;
  font-family: Urbanist-Medium;
  color: #a9a9a9;
}

.item-specifications p {
  margin: 0;
  font-family: Urbanist-Bold;
  font-size: 14px;
  padding: 4px 0 0;
}


.button-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
}

.button-section button {
  font-family: 'Urbanist-Bold';
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  text-decoration: none;
  color: var(--primary-black);
  padding: 12px 16px;
  min-width: 180px;
  border-radius: 12px;
}

button.track-order {
  color: var(--plain-white);
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  box-sizing: border-box;
  user-select: none;
}

button.order-details {
  border: 1px solid var(--inactive-text);
}

button.reorder {
  color: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  background: none !important;
  max-width: 180px;
}

button:hover {
  text-decoration: underline;
}
</style>