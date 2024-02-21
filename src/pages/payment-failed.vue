<template>
  <div class="payment-result">
    <div class="payment-result wrapper">
      <div class="middle-align">
        <img src="@/assets/illustrations/p-failed.svg" alt="" />
        <div class="title mt-45">Payment Failed!</div>
        <div class="subtitle mt-14">Sorry! ☹️ But something went wrong!</div>
        <div style="color: #13141b">Don't Worry!</div>
        <div class="paragraph mt-16">
          Any amount deducted will be refunded in 3 - 5 business days. Would you
          like to try again with a different payment option?
        </div>
        <div class="buttons">
          <button class="primary-button" @click="reviewPayment">
            Review Payment Method
          </button>
          <button v-if="creatorInfo.creatorName" class="secondary-button" @click="goToCreatorStore">
            Back To Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchCartInfo } from "@/utils/globalAPIs";

const creatorInfo = ref({});
const isExpress = ref(null);

const router = useRouter();
const route = useRoute();
const creatorStore = useCreatorStore();
const store = useStore()

onBeforeMount(async () => {
  isExpress.value = JSON.parse(localStorage.getItem("isExpress"));
  scrollTo(0, 0);
  await fetchCartInfo();
  if (!route.query.orderID) {
    router.replace("/orders");
  }
});

onMounted(async () => {
  if (creatorStore.info.id) {
    creatorInfo.value = {
      ...creatorStore.info,
      creatorName: creatorStore.info.username,
    };
  } else if (!creatorStore.info.id && store.cartItemsFailSuccess.length > 0) {
    let { username } = await getInfluencerById(store.cartItemsFailSuccess[store.cartItemsFailSuccess.length - 1].source.id)
    creatorInfo.value = {
      creatorName: username
    }
  } else {

    creatorInfo.value = { creatorName: await getCreatorUserName() }
  }
});

onBeforeUnmount(() => {
  localStorage.removeItem("creatorInfo");
});

function reviewPayment() {
  if (isExpress.value?.express) {
    router.replace(isExpress.value.url);
    localStorage.removeItem("isExpress");
  } else {
    if (window.innerWidth > 600) {
      router.replace('/cart')
    }
    else {
      router.replace({
        name: "CartItems",
      });
    }
  }
}
function goToCreatorStore() {
  router.replace({
    name: "CreatorStore",
    params: {
      creatorUsername: creatorInfo.value.creatorName,
    },
  });
}
</script>
<style scoped>
.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
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
  background: transparent;
  width: 100%;
  cursor: pointer;
  max-width: 300px;
}

.desktop_wrapper {
  height: calc(100vh);
  width: 500px;
  margin: 50px auto;
}
</style>
