<template>
  <div class="orders-wrapper">
    <h2 class="heading">Your Orders</h2>
    <div class="orders-listing">
      <OrderCard :orderInfo="order" v-for="order in store.orders.userOrders" :key="order.id" />
    </div>

    <div class="pagination-element" ref="target"></div>
  </div>
</template>

<script setup>
import OrderCard from "@/components/OrderListing/OrderCard.vue";
definePageMeta({
  name: "Orders",
  layout: "parent-layout",
  middleware: "auth"
})
const observer = ref(null);
const target = ref(null);
const config = useRuntimeConfig();

const store = useStore();

async function fetchUserOrders() {
  if (store.user.id) {
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
  if (target.value) {
    observer.value = addingObserver(target.value, callback)
  }
})
</script>


<style scoped>
@media only screen and (max-width: 520px) {
  h2.heading {
    position: fixed;
    top: 16px;
    left: 48px;
    z-index: 52;
    font-size: 18px !important;
    letter-spacing: 0.4px !important;
    line-height: 24px !important;
    padding: 0 !important;
    vertical-align: middle;
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
</style>