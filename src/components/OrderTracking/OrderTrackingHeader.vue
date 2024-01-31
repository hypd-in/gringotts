<template>
  <div class="header-container">
    <div class="left-section">
      <div class="icon" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 12L2 12" stroke="#13141B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M2 12C5.25 11 7.25 9 8 6" stroke="#13141B" stroke-width="1.5" stroke-linecap="round" />
          <path d="M2 12C5.25 13 7.25 15 8 18" stroke="#13141B" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    </div>
    <div class="middle-section">
      <div class="header-text">
        <span>
          {{ title }}
        </span>
      </div>
    </div>
    <div class="right-section"></div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: String,
});

const emit = defineEmits([
  'goBack'
])

const router = useRouter();
const route = useRoute();

function goBack() {
  emit('goBack');
}

function goBackToOrderDetails() {
  var params = {
    itemId: route.params.itemId,
  };
  var routeName = "";
  switch (route.name) {
    case "OrderTrackingListing": {
      routeName = "Orders";
      break;
    }
    case "OrderTracking": {
      routeName = "OrderDetails";
      break;
    }
    default: {
      router.back();
      break;
    }
  }
  navigateTo({
    name: routeName,
    params: params,
    replace: true,
  })
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .header-container {
    display: flex !important;
    gap: 16px;
    height: 49px !important;
    padding: 16px;
  }
}

.header-container {
  position: fixed;
  top: 0;
  left: 0;
  background: var(--plain-white, #fff);
  width: 100%;
  z-index: 2147483004;

  display: none;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 0.5px solid var(--primary-border-color);
  box-sizing: border-box;
}

.icon,
.icon svg {
  height: 24px;
}

.header-container * {
  box-sizing: border-box;
}

.header-container .header-text span {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-SemiBold;
  font-size: 18px;
  line-height: 24px;
  text-transform: capitalize;
}
</style>