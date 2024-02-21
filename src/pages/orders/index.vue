<template>
  <div class="orders-wrapper">
    <h2 class="heading">Your Orders</h2>
    <div class="orders-listing">
      <OrderCard :orderInfo="order" v-for="order in store.orders.userOrders" :key="order.id" />
    </div>
    <div v-if="fetchingOrders" style="display: flex; justify-content: center">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="pagination-element" ref="target"></div>

    <!-- <div v-if="store.orders.userOrders.length == 0 && !fetchingOrders">
    </div> -->
  </div>
</template>

<script setup>
import OrderCard from "@/components/OrderListing/OrderCard.vue";

import track from "../../utils/tracking-posthog"

const route = useRoute();

definePageMeta({
  name: "Orders",
  layout: "parent-layout",
})

const observer = ref(null);
const target = ref(null);
const config = useRuntimeConfig();
const fetchingOrders = ref(true);

const store = useStore();

async function fetchUserOrders() {
  if (store.user.id) {
    fetchingOrders.value = true;
    await $fetch(`${config.public.orderURL}/api/order/user`, {
      method: "POST",
      credentials: "include",
      body: {
        id: store.user.id,
        page: store.orders.page,
      },
      params: {
        failed_orders_required: true,
      },
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.payload) {
        store.saveUserOrders(response.payload);
        store.updateOrdersPageCount(store.orders.page + 1);
      } else {
        observer.value.unobserve(target.value);
      }
      fetchingOrders.value = false;
    }).catch((error) => {
      console.log("Error fetching User Orders", error);
    })
  }
}

async function callback(entries) {
  for await (let entry of entries) {
    if (entry.isIntersecting) {
      await fetchUserOrders();
    }
  }
}

onMounted(async () => {
  store.resetUserOrders();
  fetchingOrders.value = true;
  var user = await fetchUserInfo();
  if (!user?.id) {
    navigateTo({
      name: "Login",
      query: {
        redirection_url: route.fullPath,
      }
    })
  }
  if (target.value) {
    observer.value = addingObserver(target.value, callback)
  }

  track("order:visit")
})

useSeoMeta({
  title: `My Orders | HYPD | #getHYPD`,
  ogTitle: `My Orders | HYPD | #getHYPD`,
  twitterTitle: `My Orders | HYPD | #getHYPD`,
  description: `Get a list of your orders ordered from your favorite creatorpreneurs' store on HYPD`,
  ogDescription: `Get a list of your orders ordered from your favorite creatorpreneurs' store on HYPD`,
  twitterDescription: `Get a list of your orders ordered from your favorite creatorpreneurs' store on HYPD`,
  twitterCard: "summary",
})
</script>


<style scoped>
@media only screen and (max-width: 520px) {
  h2.heading {
    /* position: fixed;
    top: 16px;
    left: 48px;
    z-index: 52;
    padding: 0 !important;
    vertical-align: middle; */
    display: none !important;
  }
}

.orders-wrapper {
  max-width: 1024px;
  margin: 0 auto;
  padding: 16px;
}

h2,
p {
  margin: 0;
  padding: 0;
}

h2.heading {
  font-family: 'Urbanist-Bold';
  font-size: 24px;
  line-height: 32px;
  padding: 0 16px 16px;
}


/* Loader Start*/
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: rgb(153, 153, 153);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}

/* Loader End*/
</style>