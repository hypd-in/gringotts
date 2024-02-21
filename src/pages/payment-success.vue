<template>
  <div class="payment-result">
    <div class="payment-result wrapper">
      <div class="middle-align">
        <img src="@/assets/illustrations/p-success.svg" alt="" />
        <div class="title mt-45">Payment Successful!</div>
        <div class="subtitle mt-14">Your order has been placed.</div>
        <div class="paragraph mt-16">
          Your order will be sent to your address, thanks for ordering{{
            getCreatorDetails
          }}!
        </div>
        <div class="buttons">
          <button v-if="creatorInfo && creatorInfo.creatorName" class="primary-button" @click="goToCreatorStore">
            Continue Shopping
          </button>
          <button class="secondary-button" @click="goToOrders">
            Track Your Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchCartInfo, getInfluencerById } from "@/utils/globalAPIs";
import { getCreatorUserName } from "@/utils/helperMethods"

const store = useStore();
const creatorStore = useCreatorStore();
const route = useRoute();
const router = useRouter();

const props = defineProps([
  "isDesktop",
  "wishlisted_items",
  "cart_items",
  "user",
]);

const creatorInfo = ref({});

const getCreatorDetails = computed(() => {
  return creatorInfo.value?.creatorName
    ? " from " + creatorInfo.value?.creatorName + "'s store"
    : "";
});

function goToCreatorStore() {
  trackingPaymentSuccessPage(
    "Continue_Shopping",
    "User_Actions",
    "Event_Continue_Shopping",
    "Post_Purchase",
    route.query.orderID,
    route.query.order_amount,
    store.user
  );

  router.replace({
    name: "CreatorStore",
    params: { creatorUsername: creatorInfo.value.creatorName },
  });
}
function goToOrders() {
  if (store.user) {
    // uncmnt later
    trackingClickEvent("clicked_on_track_your_order");
    router.push("/orders");
  } else {
    router.push({ name: "Login", params: { redirect: "/orders" } });
  }
}

//Tracking Start
function fbqPurchaseTracking() {
  let cartInfo = JSON.parse(localStorage.getItem("cartInfo")) || [];

  trackingPurchase(
    route.query.orderID,
    cartInfo,
    route.query.order_amount,
  );
}
//Tracking End

onMounted(async () => {
  await fetchCartInfo();
  if (creatorStore.info.id) {
    creatorInfo.value = {
      ...creatorStore.info,
      creatorName: creatorStore.info.username,
    };
  } else if (route.query.influencer_id) {
    let creator = await getInfluencerById(route.query.influencer_id);
    if (creator) {
      creatorInfo.value = {
        creatorName: creator?.username
      }
    }
  } else if (!creatorStore.info.id && store.cartItemsFailSuccess.length > 0) {
    let name = await getInfluencerById(store.cartItemsFailSuccess[store.cartItemsFailSuccess.length - 1].source.id)
    creatorInfo.value = {
      creatorName: name.username
    }
  } else {
    creatorInfo.value = await getCreatorUserName()
  }

  fbqPurchaseTracking();
  if (store.user) {
    trackingPaymentSuccessPage(
      "transaction",
      "order_success",
      "payment_success",
      "post_purchase",
      route.query.orderID,
      route.query.order_amount,
      store.user
    );
  }

  if (localStorage.getItem("cartItemsForGA")) {
    let itemsFromLocal = JSON.parse(localStorage.getItem("cartItemsForGA"));

    for (let i = 0; i < itemsFromLocal?.length; i++) {

      trackingPaymentSuccessPageWithData(
        "transaction_successfull_from_cart",
        "Ecommerce",
        "Event_Payment_Success",
        "Post_Purchase",
        itemsFromLocal[i]?.creatorId,
        itemsFromLocal[i]?.creatorUserName,
        itemsFromLocal[i]?.productId,
        itemsFromLocal[i]?.productName,
        route.query.orderID,
        route.query.order_amount
      );
    }
  } else {
    trackingPaymentSuccessPage(
      "transaction_successfull_from_cart",
      "Ecommerce",
      "Event_Payment_Success",
      "Post_Purchase",
      route.query.orderID,
      route.query.order_amount,
      store.user
    );
  }

  localStorage.removeItem("cartItemsForGA");
  fetchCartInfo();
});

onBeforeMount(() => {
  if (!route.query.orderID) {
    router.push("/");
  }
});

onUnmounted(() => {
  localStorage.removeItem("cartInfo");
});
</script>

<style scoped>
.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.wrapper {
  position: relative;
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  padding: 16px;
  box-sizing: border-box;
}

.middle-align {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}

.title {
  font-family: Urbanist-Bold;
  font-size: 30px;
  color: #13141b;
}

.subtitle {
  font-size: 16px;
  color: #13141b;
}

.paragraph {
  color: #a9a9a9;
  font-size: 14px;
}

.primary-button {
  color: #fff;
  font-family: Urbanist-Bold;
  border-radius: 12px;
  background: #fb6c23;
  padding: 16px;
  text-align: center;
  border: none;
  outline: none;
  width: 100%;
  cursor: pointer;

  max-width: 300px;
}

.secondary-button {
  color: #13141b;
  font-family: Urbanist-Bold;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  padding: 16px;
  text-align: center;
  width: 100%;
  background: transparent;
  cursor: pointer;

  max-width: 300px;
}

.desktop_wrapper {
  height: calc(100vh);
  width: 500px;
  margin: 50px auto;
}

@media (min-width: 320px) and (max-width: 480px) {
  .dialog-box {
    width: 79vw;
  }
}
</style>
