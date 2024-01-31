<template>
  <div class="payment-result">
    <div class="payment-result wrapper pl-14 pr-14">
      <div class="middle-align">
        <img src="@/assets/illustrations/p-success.svg" alt="" />
        <div class="title mt-45">Payment Successful!</div>
        <div class="subtitle mt-14">Your order has been placed.</div>
        <div class="paragraph mt-16">
          Your order will be sent to your address, thanks for ordering{{
            getCreatorDetails
          }}!
        </div>
        <button v-if="creatorInfo && creatorInfo.creatorName" class="primary-button mt-60" @click="goToCreatorStore">
          Continue Shopping
        </button>
        <button class="secondary-button mt-20" @click="goToOrders">
          Track Your Order
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchCartInfo } from "@/utils/globalAPIs";
import { getCreatorUserName } from "@/utils/helperMethods"
import { getInfluencerById } from "@/utils/globalAPIs";

// import {
//   trackingClickEvent,
//   trackingPaymentSuccessPage,
//   trackingPaymentSuccessPageWithData,
//   trackingPurchase,
// } from "../eventTracking";

const router = useRouter();

const creatorInfo = ref({});

const store = useStore();

const creatorStore = useCreatorStore();

const route = useRoute();

const emit = defineEmits(["getCartInfo"]);

const props = defineProps([
  "isDesktop",
  "wishlisted_items",
  "cart_items",
  "user",
]);

const getCreatorDetails = computed(() => {
  return creatorInfo.value?.creatorName
    ? " from " + creatorInfo.value?.creatorName + "'s store"
    : "";
});

function goToCreatorStore() {
  // uncmnt later
  // trackingPaymentSuccessPage(
  //   "Continue_Shopping",
  //   "User_Actions",
  //   "Event_Continue_Shopping",
  //   "Post_Purchase",
  //   this.$route.query.orderID,
  //   this.$route.query.order_amount,
  //   this.user
  // );

  router.replace({
    name: "CreatorStore",
    params: { creatorUsername: creatorInfo.value.creatorName },
  });
}
function goToOrders() {
  if (store.user) {
    // uncmnt later
    // trackingClickEvent("clicked_on_track_your_order");
    router.push("/orders");
  } else {
    router.push({ name: "login", params: { redirect: "/orders" } });
  }
}
function downloadApp() {
  var x = confirm("Let's proceed to the app to help you track your orders.");
  if (x) {
    window.open("https://hypd.onelink.me/tBOn/5dac1a01", "_blank");
  } else {
    return;
  }
}

//Tracking Start
function fbqPurchaseTracking() {
  let cartInfo = JSON.parse(localStorage.getItem("cartInfo")) || [];

  // uncmnt later
  // trackingPurchase(
  //   this.$route.query.orderID,
  //   cartInfo,
  //   this.$route.query.order_amount
  // );
}
//Tracking End

onMounted(async () => {
  if (creatorStore.info.id) {
    creatorInfo.value = {
      ...creatorStore.info,
      creatorName: creatorStore.info.username,
    };
  } else if (!creatorStore.info.id && store.cartItemsFailSuccess.length > 0) {
    let name = await getInfluencerById(store.cartItemsFailSuccess[store.cartItemsFailSuccess.length - 1].source.id)
    creatorInfo.value = {
      creatorName: name.username
    }
  } else {
    creatorInfo.value = await getCreatorUserName()
  }

  // uncmnt later
  // fbqPurchaseTracking();
  // if (store.user) {
  // trackingPaymentSuccessPage(
  //   "transaction",
  //   "order_success",
  //   "payment_success",
  //   "post_purchase",
  //   this.$route.query.orderID,
  //   this.$route.query.order_amount,
  //   this.user
  // );
  // }

  if (localStorage.getItem("cartItemsForGA")) {
    let itemsFromLocal = JSON.parse(localStorage.getItem("cartItemsForGA"));

    // uncmnt later
    // for (let i = 0; i < itemsFromLocal?.length; i++) {

    //   trackingPaymentSuccessPageWithData(
    //     "transaction_successfull_from_cart",
    //     "Ecommerce",
    //     "Event_Payment_Success",
    //     "Post_Purchase",
    //     itemsFromLocal[i]?.creatorId,
    //     itemsFromLocal[i]?.creatorUserName,
    //     itemsFromLocal[i]?.productId,
    //     itemsFromLocal[i]?.productName,
    //     this.$route.query.orderID,
    //     this.$route.query.order_amount
    //   );
    // }
  }

  // uncmnt later
  // else {
  //   trackingPaymentSuccessPage(
  //     "transaction_successfull_from_cart",
  //     "Ecommerce",
  //     "Event_Payment_Success",
  //     "Post_Purchase",
  //     this.$route.query.orderID,
  //     this.$route.query.order_amount,
  //     this.user
  //   );
  // }

  localStorage.removeItem("cartItemsForGA");
  fetchCartInfo();
});

onBeforeMount(() => {
  emit("getCartInfo");
  if (!route.query.orderID) {
    router.push("/");
  }
});

onUnmounted(() => {
  localStorage.removeItem("cartInfo");
});
</script>

<style scoped>
.wrapper {
  position: relative;
  height: calc(100vh - 73px);
  overflow-y: scroll;
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
  font-size: 18px;
  color: #13141b;
}

.paragraph {
  color: #a9a9a9;
  font-size: 18px;
}

.primary-button {
  color: #fff;
  font-family: Urbanist-Bold;
  border-radius: 20px;
  background: #fb6c23;
  padding: 16px;
  text-align: center;
  border: none;
  outline: none;
  width: 100%;
  cursor: pointer;
}

.secondary-button {
  color: #13141b;
  font-family: Urbanist-Bold;
  border-radius: 20px;
  border: 1px solid #eaeaea;
  padding: 16px;
  text-align: center;
  width: 100%;
  background: transparent;
  cursor: pointer;
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
