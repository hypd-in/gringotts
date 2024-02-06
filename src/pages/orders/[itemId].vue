<template>
  <div class="order-details-wrapper">
    <div class="order-details" v-if="orderDetails?.id">
      <div class="left-section">
        <h2 class="heading">Order Details</h2>
        <NuxtLink :to="creatorProduct">
          <div class="item-details">
            <NuxtImg v-if="orderDetails.item?.catalog_info?.featured_image" width="125" height="180"
              style="border-radius: 12px;" :src="orderDetails.item?.catalog_info?.featured_image?.src"
              :placeholder="[125, 180, 50, 20]" />
            <div class="item-info">
              <h4 class="brand-name">
                {{ orderDetails?.brand_info?.name }}
              </h4>
              <h3 class="item-name">
                {{ orderDetails?.item?.catalog_info?.name }}
              </h3>
              <div class="variant-info">
                <label>{{ orderDetails?.item?.catalog_info?.variant_type }}</label>: <span>{{
                  orderDetails?.item?.catalog_info?.variant?.attribute }}</span>
              </div>
              <div class="quantity-info">
                <label>Quantity</label>: <span>{{
                  orderDetails?.item?.quantity }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="right-section">
        <div class="card order-status-card">
          <section class="order-status-wrapper">
            <div class="order-status">
              <label>Current Order Status:</label>
              <h6 class="status" :class="orderStatus">{{
                readableOrderStatus[orderStatus] || readableOrderStatus[itemStatus?.code] }}</h6>
              <p class="status-date" v-if="orderDetails?.order_status">on {{
                formatDateWithTime(orderDetails?.order_status?.created_at) || formatDateWithTime(itemStatus?.created_at)
              }}</p>
            </div>
            <button v-if="showReorder" class="reorder">Re Order</button>
            <button v-else-if="showTrackOrder" @click="openTracking" class="track-order">Track Order</button>
          </section>
          <section :class="orderStatus"
            v-if="!['cancel-user', 'cancel-brand'].includes(orderStatus) && !['cancel-user', 'cancel-brand'].includes(itemStatus?.code)"
            class="order-status-info">
            <h6 class="status-heading">{{ statusBasedText[orderStatus]?.heading }}</h6>
            <p class="status-subheading">{{ statusBasedText[orderStatus]?.text }}</p>
          </section>
          <section class="help">
            <button @click="cancelOrderPopup">Cancel</button>
            <div class="seperator"></div>
            <button @click="navigateToContactUs">Need Help</button>
          </section>
        </div>

        <div class="card order-details-card">
          <section class="order-section">
            <div class="order-id">
              <label>Order Id:</label><span>{{ orderDetails?.order_id }}</span>
            </div>
            <div class="order-date">
              <label>Order Placed On:</label><span v-if="orderDetails?.created_at">{{ formatDate(orderDetails?.created_at)
              }}</span>
            </div>
            <div class="payment-mode">
              <label>Payment Mode:</label><span style="color: var(--green);">{{ paymentMode }}</span>
            </div>
          </section>
          <section class="order-price-info">
            <div class="savings">
              <h6>You saved <span>{{ savings }}</span> on this
                order</h6>
            </div>
            <div class="total-amount">
              <label>Total Amount</label>
              <h5 class="amount">{{ convertToINR(finalPrice) }}</h5>
            </div>
            <div class="buttons">
              <button v-if="!['initiated', 'rto', 'failed'].includes(orderStatus) && checkOrderDate"
                @click="downloadReceipt" class="download">Download Receipt</button>
              <button class="price-details">Price Details</button>
            </div>
          </section>
        </div>

        <div class="card delivery-details">
          <section class="delivery-info">
            <label>Delivery Address</label>
            <h5 class="address">
              {{ orderDetails?.shipping_address?.display_name }} ({{ orderDetails?.shipping_address?.phone_number?.prefix
              }} {{ orderDetails?.shipping_address?.phone_number?.number }})
            </h5>
            <span style="font-family: Urbanist-Regular;"> {{ orderDetails?.shipping_address?.plain_address }}</span>
          </section>
          <section class="contact-info">
            <label>User Info</label>
            <h5 class="contact">
              {{ orderDetails?.user_info?.full_name }} ({{ orderDetails?.user_info?.phone_no?.prefix }} {{
                orderDetails?.user_info?.phone_no?.number }}) <br>
              {{ orderDetails?.user_info?.email }}
            </h5>
          </section>
        </div>

        <div class="card brand-creator-card">
          <section class="brand-info" @click="navigateToBrandPage" v-if="orderDetails?.brand_info">
            <NuxtImg width="48" height="48" style="border-radius: 8px; object-fit: cover;"
              v-if="orderDetails?.brand_info?.logo?.src" :src="orderDetails?.brand_info?.logo?.src" />
            <div class="brand-name">
              <label>Fullfilled By</label>
              <h5 style="font-family: Urbanist-Bold;">{{ orderDetails?.brand_info?.name }}</h5>
            </div>
            <img class="go-to" src="~/assets/icons/misc/arrow-right.svg" alt="" srcset="">
          </section>
          <section v-if="creatorInfo?.id" class="creator-info" @click="navigateToCreatorStore">
            <NuxtImg width="48" height="48" style="border-radius: 8px; object-fit: cover;"
              v-if="creatorInfo?.profile_image?.src" :src="creatorInfo?.profile_image?.src" />
            <div class="brand-name">
              <label>Curated for you by</label>
              <h5 style="font-family: Urbanist-Bold;">{{ creatorInfo?.name }}</h5>
            </div>
            <img class="go-to" src="~/assets/icons/misc/arrow-right.svg" alt="" srcset="">
          </section>
        </div>
      </div>
    </div>

    <section class="similar-products" v-if="similarProducts?.length">
      <h2 class="section-heading">Products you might like</h2>
      <div class="product-listing horizontal-listing">
        <ProductCard src="order-detail-page" :itemInfo="product" v-for="product in similarProducts" :creator="creatorInfo" :key="product.id" />
      </div>
    </section>

    <NuxtPage />
  </div>
</template>

<script setup>
import ProductCard from '~/components/ProductComponents/ProductCard.vue';

import track from "../../utils/tracking-posthog"

definePageMeta({
  name: "OrderDetails",
  layout: "default",
})

const route = useRoute();
const store = useStore();
const config = useRuntimeConfig();
const orderDetails = ref({});
const creatorInfo = ref({});
const similarProducts = ref([]);
const downlaodingInvoice = ref(false);
const orderStatus = computed(() => {
  return orderDetails.value?.order_status?.code;
})

const itemStatus = computed(() => {
  return orderDetails.value?.item?.item_status;
})

const checkOrderDate = computed(() => {
  if (new Date("3 December 2021").toJSON() < orderDetails.value.order_date) {
    return false;
  } else {
    return true;
  }
});

const showReorder = computed(() => {
  if (['delivered', 'cancel-brand', 'cancel-user', 'rto', 'failed'].includes(orderStatus.value) || ['cancel-brand', 'cancel-user'].includes(itemStatus.value?.code)) {
    return true;
  } else {
    return false;
  }
})

const showTrackOrder = computed(() => {
  if (['confirmed', 'tracking-id-generated', 'shipped', 'out-for-delivery'].includes(orderStatus.value)) {
    return true;
  } else {
    return false;
  }
})

const creatorProduct = computed(() => {
  if (orderDetails.value?.item?.catalog_info?.id) {
    if (creatorInfo.value?.username) {
      return {
        name: "CreatorProduct",
        params: {
          creatorUsername: creatorInfo.value?.username,
          id: orderDetails.value.item.catalog_info.id,
        },
        query: {
          title: orderDetails.value.item.catalog_info.name
        }
      }
    } else {
      return {
        name: "CreatorProduct",
        params: {
          creatorUsername: 'hypd_store',
          id: orderDetails.value.item.catalog_info.id,
        },
        query: {
          title: orderDetails.value.item.catalog_info.name
        }
      }
    }
  }
})

const savings = computed(() => {
  return convertToINR(orderDetails.value?.offer_value?.value || 0 + (orderDetails.value?.item?.base_price.value - orderDetails.value?.item?.retail_price.value) * orderDetails.value.item?.quantity);
})
const finalPrice = computed(() => {
  return (orderDetails.value?.item?.total_price?.value - (orderDetails?.value?.item?.offer_value?.value || 0));
})
const paymentMode = computed(() => {
  if (orderDetails.value?.payment_mode == 'cod') {
    return "Cash on Delivery";
  } else {
    return "Prepaid"
  }
})

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

const statusBasedText = ref({
  initiated: {
    'heading': "Your order is yet to be confirmed",
    'text': 'Verifying your payment status...'
  },
  failed: {
    'heading': "Uh-Oh, Your Payment was Declined",
    'text': 'We have not received the payment for your order'
  },
  confirmed: {
    "heading": "Your order has been confirmed",
    'text': "You'll be notified as soon as your order is packed"
  },
  "tracking-id-generated": {
    'heading': "Your order has been packed.",
    'text': "You'll be notified once your order is shipped."
  },
  "out-for-delivery": {
    'heading': "Your order is out for delivery",
    'text': "It will be delivered soon",
  },
  rto: {
    "heading": "Your order was returned",
    "text": "Your order has been marked as returned in our system"
  },
  shipped: {
    heading: "Hooray! your order has been shipped",
    text: "Click on Track Order to know track your order."
  },
  "delivered": {
    heading: "Your order has been delivered",
    text: "Thanks for ordering."
  }
})

onMounted(() => {
  track('order_item:visit', {
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id
  })
})

function cancelOrderPopup() {
  track("order_item:item_cancel_click", {
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id,
    current_status: store.orderDetails.order_status.code
  })
}

function openTracking() {
  track('order_item:item_track_order', {
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id
  })

  navigateTo({
    name: "OrderTracking",
  })
}

function navigateToContactUs() {
  track('order_item:item_need_help', {
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id,
    current_status: store.orderDetails.order_status.code
  })
  navigateTo({
    name: "ContactUs",
  })
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

async function downloadReceipt() {

  track('order_item:download_receipt_click',{
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id,
  })

  try {
    downlaodingInvoice.value = true;
    var response = await $fetch(`${config.public.orderURL}/v2/order/invoice/download`, {
      method: "GET",
      credentials: "include",
      responseType: "blob",
      params: {
        order_id: orderDetails.value?.id
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response) {
      downloadFile(URL.createObjectURL(response), orderDetails.value?.order_id);
    }
  } catch (error) {
    downlaodingInvoice.value = false;
    console.log("Error downloading receipt", error);
    alert("There was an error downloading your receipt..");
  }
}

function downloadFile(data, fileName) {
  var link = document.createElement("a");
  link.href = data;
  link.download = fileName;
  link.style.display = "none";
  link.target = "_blank";
  link.click();
}

function navigateToBrandPage() {
  track('order_item:visit_brand_click', {
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id,
  })

  navigateTo({
    name: "BrandPage",
    params: {
      brandUsername: orderDetails.value?.brand_info?.username
    }
  })
}

function navigateToCreatorStore() {

  track('order_item:visit_creator_click', {
    order_no: store.orderDetails.order_id,
    item_id: store.orderDetails.item.id,
    brand_id: store.orderDetails.brand_id,
  })

  navigateTo({
    name: "CreatorStore",
    params: {
      creatorUsername: creatorInfo.value?.username
    }
  })
}

async function fetchOrderDetails() {
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
      if (orderDetails.value.item?.source?.id) {
        var creator = await getInfluencerById(orderDetails.value.item?.source?.id);
        if (creator) {
          creatorInfo.value = { ...creator };
        }
      }
      await fetchSimilarProducts(orderDetails.value?.item?.catalog_info?.id);
    }
  } catch (error) {
    alert("Error fetching order details");
    console.log("Error fetching order details", error);
  }
}

async function fetchSimilarProducts(id) {
  try {
    var response = await $fetch(`${config.public.catalogURL}/api/app/catalog/similar`, {
      method: "GET",
      params: {
        query: id,
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response.payload) {
      similarProducts.value = [...response.payload];
    }
  } catch (error) {
    console.log("Error fetching errors", error);
  }
}

onBeforeMount(async () => {
  await fetchOrderDetails();
})
</script>

<style scoped>
@media only screen and (max-width: 720px) {
  .order-details {
    grid-template-columns: 100% !important;
    grid-template-rows: auto;
  }

  .left-section {
    width: 100%;
    text-align: center;
    position: relative !important;
    top: 0 !important;
  }

  .item-details {
    flex-direction: column;
    align-items: center !important;
  }

  .item-info {
    max-width: calc(100%) !important;
  }

  .order-status-card {
    width: calc(100dvw - 32px);
  }

  h2.heading {
    display: none !important;
  }
}

.order-details-wrapper {
  max-width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;

  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.2px;
}

.order-details {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
  column-gap: 16px;
  padding: 16px;
}

.left-section {
  position: sticky;
  top: 88px;
}

.right-section {
  margin: 32px 0 0;
  user-select: none;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
  font-family: Urbanist-Medium;
  font-size: 14px;
  letter-spacing: 0.4px;
  line-height: 18px;
}

h2.heading {
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 21px;
  padding: 0 0 16px 0;
}

.item-info {
  max-width: 220px;
}

.brand-name {
  font-family: Urbanist-Medium;
  color: var(--secondary-text);
  font-size: 14px;
  letter-spacing: 0.4px;
  line-height: 24px;
}

.item-name {
  font-family: Urbanist-SemiBold;
  letter-spacing: -0.2px;
  line-height: 24px;
}

.variant-info,
.quantity-info {
  font-family: Urbanist-SemiBold;
  line-height: 24px;
}

.variant-info label,
.quantity-info label {
  font-family: Urbanist-Regular;
  text-transform: capitalize;
}

.item-details {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}


.card:first-of-type {
  margin: 0 auto;
}

.card {
  border: 1px solid var(--primary-border-color);
  border-radius: 16px;
  max-width: 480px;
  margin: 32px auto;
  background: #fafafa;
}

.card section {
  padding: 16px;
  border-bottom: 1px solid var(--primary-border-color);
}

.card section:last-of-type {
  border-bottom: 0;
}

.order-status-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

button {
  font-family: Urbanist-Bold;
}

button:hover {
  text-decoration: underline;
}

button.reorder {
  border: 1px solid var(--primary-orange);
  border-radius: 12px;
  padding: 12px 32px;
  color: var(--primary-orange);
}

button.track-order {
  color: var(--plain-white);
  border: 1px solid var(--primary-orange);
  border-radius: 12px;
  padding: 12px 32px;
  background: var(--primary-orange);
  border: 1px solid var(--primary-orange);
  box-sizing: border-box;
  user-select: none;
}

h6.status {
  font-family: Urbanist-Bold;
  font-size: 12px;
}

h6.delivered,
h6.shipped {
  color: var(--green);
}

h6.out-for-delivery {
  color: var(--primary-orange);
}

h6.cancel-user,
h6.cancel-brand {
  color: var(--red);

}

h6.confirmed {
  color: var(--dark-blue);
}

h6.initiated {
  color: #df9e25;
}

.status-date {
  font-family: Urbanist-Regular;
  font-size: 12px;

}

.order-status label {
  font-family: Urbanist-SemiBold;
  font-size: 12px;
}

.status-heading {
  font: normal normal normal 13px/16px Urbanist-Medium;
  letter-spacing: -0.4px;
  color: #13141b;
}

.status-subheading {
  font: normal normal normal 12px/16px Urbanist-Medium;
  letter-spacing: -0.3px;
  color: #a9a9a9;
}

section.help {
  display: grid;
  grid-template-columns: calc(50% - 0.5px) 1px calc(50% - 0.5px);
  align-items: center;
  padding: 0;
}

section.help .seperator {
  height: 100%;
  background: var(--primary-border-color);
  width: 1px;
}

section.help button {
  font: normal normal normal 16px/21px Urbanist-Medium;
  letter-spacing: -0.4px;
  color: var(--secondary-text);
  cursor: pointer;
  padding: 16px;
}

.order-section label {
  font-family: Urbanist-Medium;
  margin-right: 4px;
  font-size: 14px;
  letter-spacing: -0.25px;
  line-height: 21px;
  color: #585858;
}

.order-price-info div {
  display: flex;
  justify-content: space-between;
}

.order-price-info .savings h6 {
  font-size: 12px;
  line-height: 21px;
  letter-spacing: 0.2px;
  color: var(--secondary-text);
}

.order-price-info .savings h6 span {
  color: var(--primary-orange);
  font-family: 'Urbanist-Bold';
}

.order-price-info h5.amount,
.order-price-info .total-amount label {
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.4px;
}

button.download {
  font: normal normal normal 12px/16px Urbanist-Medium;
  letter-spacing: 0px;
  color: #2597df;
  white-space: nowrap;
}

button.price-details {
  width: 100%;
  letter-spacing: -0.3px;
  font: normal normal normal 12px/16px Urbanist-Bold;
  text-transform: uppercase;
  color: #a9a9a9;
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.delivery-details label {
  font-size: 12px;
  line-height: 24px;
}

h5.address {
  font-family: Urbanist-Bold;
}

h5.contact {
  line-height: 21px;
}

.brand-creator-card section {
  display: grid;
  grid-template-columns: 48px auto auto;

  align-items: center;
  gap: 12px;
  letter-spacing: -0.35px;
  /* width: calc(100% - 32px); */
  box-sizing: border-box;
  cursor: pointer;
}

.go-to {
  width: 16px;
  height: 16px;
  justify-self: flex-end;
}

section.similar-products {
  border-top: 1px solid var(--primary-border-color);
  padding: 16px 0;
}

h2.section-heading {
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 21px;
  padding: 16px;
}

.horizontal-listing {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  overflow: auto hidden;
  padding: 0 16px 16px;
}

.horizontal-listing::-webkit-scrollbar {
  height: 3px;
  width: 3px;
  background: #dedede;
}

.horizontal-listing::-webkit-scrollbar-thumb {
  background: var(--primary-dark);
}
</style>