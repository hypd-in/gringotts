<template>
  <div class="header-container">
    <div class="left-section">
      <div class="icon" @click="goBack">
        <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Back">
            <g id="arrow-down-sign-to-navigate">
              <path id="Path 498" fill-rule="evenodd" clip-rule="evenodd"
                d="M-0.000247955 9.42268C-0.000247955 9.08493 0.128702 8.74722 0.386052 8.48973L8.48929 0.386595C9.00475 -0.128865 9.84049 -0.128865 10.3557 0.386595C10.871 0.901855 10.871 1.73742 10.3557 2.25292L3.18557 9.42268L10.3555 16.5925C10.8708 17.1079 10.8708 17.9434 10.3555 18.4586C9.84025 18.9744 9.0045 18.9744 8.48904 18.4586L0.385833 10.3556C0.128413 10.098 -0.000237465 9.76031 -0.000237465 9.42268H-0.000247955Z"
                fill="#13141B" />
            </g>
          </g>
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
  height: 16px;
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