<template>
  <section class="best-offers">
    <div class="heading">
      <h2>Available Offers</h2>
      <span>{{ `${currentIndex}/${totalCoupons}` }}</span>
    </div>
    <div @scroll="getCouponIndex" class="coupon-listing">
      <div :class="offer.type" class="coupon" ref="couponEl" v-for="offer in offers" :key="offer.code">
        <div class="section left-section">
          <div v-html="couponText[offer.id]"></div>
          <button @click="copyCode(offer)" v-html="buttonText(offer)"></button>
        </div>
        <div class="half-circle top-circle"></div>
        <div class="half-circle bottom-circle"></div>
        <div class="section right-section" v-html="discountText[offer.id]"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { convertToINR } from "~/utils/helperMethods";
const router = useRouter();
const creatorStore = useCreatorStore();
const productStore = useProductStore();
const props = defineProps({
  offers: Object,
});

const discountText = ref({});
const couponText = ref({});
const copiedCode = ref("");
const couponEl = ref(null);
const currentIndex = ref(1);

async function getCouponIndex(event) {
  if (event.target.scrollLeft == 0) {
    currentIndex.value = 1;
    return;
  }
  couponEl.value?.forEach((el, index) => {
    var bounding = el.getBoundingClientRect();
    if (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
    ) {
      currentIndex.value = index + 1;
    }
  });
}

const totalCoupons = computed(() => {
  return props.offers.length;
});

onMounted(async () => {
  if (props.offers.length > 0) {
    await getCouponDiscountText();
  }
});

async function getCouponDiscountText() {
  props.offers.forEach((offer) => {
    if (offer.type == "percent_off") {
      couponText.value[offer.id] = `Use code <span>"${offer.code
        }"</span> to get <span>${convertToINR(offer.total_discount)}</span> off.`;

      discountText.value[offer.id] = `${offer.value}% off`;
    } else if (offer.type == "flat_off") {
      couponText.value[offer.id] = `Use code <span>"${offer.code
        }"</span> to get <span>${convertToINR(offer.total_discount)}</span> off.`;

      discountText.value[offer.id] = `${convertToINR(offer.value)} off`;
    } else if (offer.applicable_on.name == "bxgy") {
      couponText.value[
        offer.id
      ] = `Use code <span>"${offer.code}"</span> to <span>Buy ${offer.applicable_on.bxgy.buy_count} & Get ${offer.applicable_on.bxgy.get_count}</span> free.`;

      discountText.value[
        offer.id
      ] = `Buy${offer.applicable_on.bxgy.buy_count} Get${offer.applicable_on.bxgy.get_count}`;
    } else if (offer.applicable_on.name == "bundle") {
      couponText.value[offer.id] = `Use <span>"${offer.code
        }"</span> to get <span>${offer.applicable_on.bundle.quantity}</span> at ${offer.applicable_on.bundle.sub_type == "flat"
          ? `Flat <span>${convertToINR(
            offer.applicable_on.bundle.amount
          )}</span>`
          : `<span>${offer.applicable_on.bundle.amount}% off</span>`
        }`;

      discountText.value[offer.id] = `Buy${offer.applicable_on.bundle.quantity
        } <span id="small">@</span> ${offer.applicable_on.bundle.sub_type == "flat"
          ? `<span>${convertToINR(offer.applicable_on.bundle.amount)}</span>`
          : `<span>${offer.applicable_on.bundle.amount}% </span> <span id="small">off</span>`
        }`;
    }
  });
}

async function copyCode(offer) {
  if (offer.applicable_on.name == "bxgy") {
    await goToBxgyProducts(offer);
  }
  if (offer.applicable_on.name == "bundle") {
    await goToBundleProducts(offer);
  }
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(offer.code);
    copiedCode.value = offer.code;
  }
}

async function goToBundleProducts(offer) {
  await navigateTo({
    name: "EligibleProducts",
    params: {
      creatorUsername: creatorStore.info?.username,
      id: offer.id,
    },
  });
}

async function goToBxgyProducts(offer) {
  if (offer.applicable_on.bxgy.sub_type == "brand") {
    await goToBrandProfile();
  } else if (offer.applicable_on.bxgy.sub_type == "catalog") {
    // await store.dispatch("saveBxGyGetIds", [
    //   ...offer.applicable_on.bxgy.get_ids,
    // ]);
    await navigateTo({
      name: "BxGy",
      params: {
        creatorUsername: creatorStore?.info?.username,
      },
    });
  }
}
async function goToBrandProfile() {
  await navigateTo({
    name: "BrandProfile",
    params: {
      creatorUsername: creatorStore?.info?.username,
      brandUsername: productStore?.info?.brand_info?.username,
    },
  });
}

function buttonText(offer) {
  if (offer.type == "bxgy" || offer.type == "bundle") {
    return "<span>See eligible products</span>";
  }
  // if (copiedCode.value == offer.code) {
  //   return `<span style="color:#01C159">Code copied</span>`;
  // } else {
  //   return `<span>Copy code</span>`;
  // }
}
</script>

<style scoped>
.best-offers {
  padding: 0;
  position: relative;
  z-index: 1;
}

.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 16px 16px 0;
}

.heading span {
  color: var(--inactive-text, #a9a9a9);

  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
}

h2 {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
  margin: 0;
}

.coupon-listing {
  display: flex;
  align-items: center;
  align-content: flex-start;
  gap: 14px;
  flex-shrink: 0;
  padding: 16px;
  overflow: auto hidden;
}

.coupon-listing::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.coupon {
  display: grid;
  grid-template-columns: calc(100% - 72px) 72px;
  align-items: center;
  align-content: center;
  flex-shrink: 0;
  border-radius: 12px;
  width: 256px;
  height: 78px;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}

.section {
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  box-sizing: border-box;
  height: 78px;
  padding: 12px;

  color: #13141b;
  font-family: Urbanist-Medium;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.4px;

  user-select: none;
  vertical-align: middle;
  text-align: left;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.section:deep() span {
  font-family: "Urbanist-Bold";
}

.left-section {
  background: #f6bc284c;
  box-sizing: border-box;
  border-right: 0px;
  white-space: pre-wrap;
  gap: 2px;
}

.right-section {
  background: #f6bd28;
  align-items: center;

  color: var(--primary-black, #13141b);
  text-align: center;

  font-family: Urbanist-Bold;
  font-size: 1.125rem;
  line-height: 16px;
  text-transform: uppercase;
  text-shadow: 2px 1px #fff;
}

.half-circle {
  position: absolute;
  right: calc(72px - 9px);
  top: 0px;
  width: 18px;
  height: 9px;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  background: var(--plain-white, #fff);
  box-sizing: border-box;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-top: 0px;
}

.half-circle.bottom-circle {
  bottom: 0;
  top: auto;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 14px;
  border-top-left-radius: 14px;
  border-bottom: 0;
  border-top: 2px dashed rgba(0, 0, 0, 0.2);
}

.flat_off .left-section,
.percent_off .left-section {
  background: #fffaed;
}

.flat_off .right-section,
.percent_off .right-section {
  background: #f6bd28;
  color: #fff;
  text-shadow: 1px 1px #000;
}

.bundle .left-section,
.bxgy .left-section {
  background: #edf7ff;
}

.bundle .right-section,
.bxgy .right-section {
  background: #4baeff;
  color: #fff;
  text-shadow: 1px 1px #000;
}

.left-section button {
  color: var(--primary-orange);

  font-family: Urbanist-Bold;
  font-size: 11px;
  line-height: 14px;
  letter-spacing: 0.2px;
}

.left-section button:hover {
  text-decoration: underline;
}

.right-section:deep() #small {
  font-size: 12px !important;
}
</style>