<template>
  <div
    class="product-page-container"
    :style="{ 'z-index': showImagePreview ? 2 : 0 }"
  >
    <div class="product-page">
      <ImagePreview
        @close="toggleImagePreview"
        v-if="showImagePreview"
        @updateImageIndex="openImagePreview"
        :mediaImages="contentInfo"
        :index="activeImageIndex"
      />
      <div class="product-page-wrapper">
        <section ref="productImagesRef" class="left-section product-images">
          <div v-for="(media, index) in contentInfo" :key="media.id">
            <ImageFrame
              v-if="media.media_type == 'image'"
              class="product-image"
              @click="openImagePreview(index), toggleImagePreview()"
              :src="$optimizeImage(media.media_info.url, 800)"
              :objectFit="'cover'"
            />
            <VideoPlayer
              v-else-if="media.media_type == 'video'"
              class="product-image"
              :muted="true"
              :media_info="media.media_info"
            />
          </div>
        </section>

        <div class="right-section">
          <section class="product-info-wrapper">
            <div class="item-info-wrapper">
              <div class="item-info">
                <h2>{{ brandName }}</h2>
                <p id="item-name">{{ itemName }}</p>
              </div>
              <button @click="shareProduct" class="share-btn">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 11L21.2 2.79999"
                    stroke="#13141B"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22 6.8V2H17.2"
                    stroke="#13141B"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                    stroke="#13141B"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div class="pricing-info-wrapper">
              <span v-if="retailPrice" id="retail-price">{{
                convertToINR(retailPrice)
              }}</span>
              <span v-if="basePrice > retailPrice" id="base-price">{{
                convertToINR(basePrice)
              }}</span>
              <span v-if="basePrice > retailPrice" id="discount"
                >({{ discount }}% off)</span
              >
            </div>
          </section>

          <Offers v-if="productOffers.length > 0" :offers="productOffers" />

          <div class="mobile-variant-selector" v-if="showVariantSelector">
            <div @click="showVariantSelector = false" class="backdrop"></div>
            <div class="variant-selector">
              <VariantSelector :class="{ wiggle: getVariant }" />
              <PDPButtons @getVariant="toggleVariantSelector" />
            </div>
          </div>

          <VariantSelector :class="{ wiggle: getVariant }" />

          <PDPButtons
            @getVariant="toggleVariantSelector"
            class="desktop-btns"
          />

          <section
            class="description-specification"
            v-if="productInfo?.description && productInfo?.specs"
          >
            <div class="description" v-if="productInfo.description?.length > 0">
              <h2>Product Description</h2>
              <p class="product-description">
                {{ productDescription }}
                <span
                  v-if="productInfo?.description?.length > 180"
                  @click="toggleDescription"
                  >{{ `${viewDescription ? "View Less" : "View More"}` }}</span
                >
              </p>
            </div>

            <div class="specification" v-if="productInfo.specs?.length > 0">
              <h2>Product Specification</h2>
              <ul>
                <li
                  class="list"
                  v-for="spec in productInfo?.specs"
                  :key="spec.name"
                >
                  <span>{{ spec.name }} : {{ spec.value }}</span>
                </li>
              </ul>
            </div>
          </section>

          <PoliciesComponent />

          <BrandCreatorComponent />

          <PDPButtons @getVariant="toggleVariantSelector" class="mobile-btns" />
        </div>
      </div>
      <SimilarProducts :products="similarProducts" heading="Similar Products" />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import {
  convertToINR,
  fetchSimilarProducts,
  getProductInfoById,
} from "@/API/APIs";
import store from "@/store";
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import ImageFrame from "../ImageFrame.vue";
import VideoPlayer from "../hypdPlayer.vue";
import ImagePreview from "./ImagePreview.vue";
import Footer from "@/components/FooterHypd.vue";
import Offers from "./ProductOffers.vue";
import PDPButtons from "./PDPButtons.vue";
import PoliciesComponent from "@/components/ProductComponents/PoliciesComponent.vue";
import VariantSelector from "@/components/ProductComponents/VariantSelector.vue";
import BrandCreatorComponent from "@/components/ProductComponents/BrandCreatorComponent.vue";
import SimilarProducts from "@/components/ProductComponents/SimilarProductsComponent.vue";
import { getCreatorUserName } from "@/customMethods/globalMethods";
import axios from "axios";
import { trackingViewItems } from "../../eventTracking.js";

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const props = defineProps({
  productInfo: Object,
});

const productOffers = ref([]);
const viewDescription = ref(false);
const activeImageIndex = ref(0);
const showImagePreview = ref(false);
const getVariant = ref(false);
const showVariantSelector = ref(false);
const timeout = ref(null);
const productImagesRef = ref(null);
const similarProducts = ref([]);
const productInfo = computed(() => {
  return store.getters["product/productInfo"];
});
const scrollLeft = ref(0);
const contentInfo = computed(() => {
  var contentInfo = store.state.product.info?.content_info;
  var info = contentInfo?.filter((info) => {
    if (info.media_info?.url || info.media_info?.hls_playback_url) {
      return true;
    }
  });
  if (info?.length == 0) {
    info.push({
      media_info: {
        url: store.state.product.info?.featured_image.src,
      },
    });
  }
  return info;
});


const itemName = computed(() => {
  return store.state.product.info?.name;
});

const brandName = computed(() => {
  return store.state.product.info?.brand_info?.name;
});

const retailPrice = computed(() => {
  return store.state.product.info?.retail_price?.value;
});

const basePrice = computed(() => {
  return store.state.product.info?.base_price?.value;
});

const discount = computed(() => {
  if (basePrice.value > retailPrice.value) {
    var discount = Math.floor(
      ((basePrice.value - retailPrice.value) / basePrice.value) * 100
    );
    return discount;
  } else {
    return 0;
  }
});

const productDescription = computed(() => {
  var description = productInfo.value.description;
  if (description) {
    if (!viewDescription.value) {
      description = description.substring(0, Math.min(description.length, 180));
      if (description.length >= 180) {
        description += "...";
      }
    } else {
      description = productInfo.value.description;
    }
    return description;
  }
});

onBeforeUnmount(async () => {
  await store.dispatch("product/saveProductInfo", {});
});

watch(productInfo, async (newV, oldV) => {
  if (newV.id && newV.id != oldV.id) {
    await getProductOffers();
    similarProducts.value = await fetchSimilarProducts(newV?.id);
  }
});
onMounted(async () => {
  if (productInfo.value?.id) {
    await getProductOffers();
  }
});

async function getProductOffers() {
  try {
    var params = new URLSearchParams();
    if (productInfo.value.id) {
      params.append("catalog_id", productInfo.value?.id);
      params.append("brand_id", productInfo.value?.brand_info?.id);
      params.append("price", retailPrice?.value);
    }
    params.append("isWeb", true);
    var response = await axios({
      method: "GET",
      url: proxy.$couponURL + "/api/app/get-coupons",
      params: params,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.payload) {
      // Shifting BXGY coupon to top of array
      var coupons = response.data.payload;
      var bxgyIndex = coupons.findIndex((coupon) => coupon?.type == "bxgy");
      var bundleIndex = coupons.findIndex((coupon) => coupon?.type == "bundle");
      if (bundleIndex > -1) {
        coupons.unshift(coupons.splice(bundleIndex, 1)[0]);
      }
      if (bxgyIndex > -1) {
        coupons.unshift(coupons.splice(bxgyIndex, 1)[0]);
      }

      productOffers.value = [...coupons];
    }
  } catch (err) {
    console.log("Error fetching product offers", err);
  }
}

function shareProduct() {
  var shareObject = {};
  if (store.state.product.info?.name) {
    shareObject["title"] = store.state.creator.info
      ? `${store.state.creator.info?.name} | ${store.state.product.info.name} | Hypd Store`
      : `${store.state.product.info?.name} | Hypd Store`;
  }
  shareObject["url"] = `${proxy.$base}/${
    route.params.creator_username ||
    getCreatorUserName(store.state.creator?.info?.id)
  }/product/${store.state.product.info?.id}?title=${
    store.state.product.info?.name
  }`;

  if (navigator.canShare) {
    navigator.share(shareObject);
  } else {
    navigator.clipboard.writeText(shareObject["url"]);
  }
}

function toggleDescription() {
  viewDescription.value = !viewDescription.value;
}

function openImagePreview(index) {
  activeImageIndex.value = index;
}

function toggleImagePreview() {
  showImagePreview.value = !showImagePreview.value;
}

function toggleVariantSelector() {
  if (!timeout.value) {
    getVariant.value = true;
    timeout.value = setTimeout(() => {
      getVariant.value = false;
    }, 1250);
  } else {
    clearTimeout(timeout.value);
    timeout.value = null;
    getVariant.value = false;
  }
  showVariantSelector.value = true;
}

// Code for scroll (commented for now)
// async function scrollingProducts(event) {
// if (event.target.scrollLeft > (scrollLeft.value + 32)) {
//   scrollLeft.value += event.target.clientWidth;
//   event.target.scrollLeft += event.target.clientWidth;
// } else if(event.target.scrollLeft == 0){
//   event.target.scrollLeft = 0;
//   scrollLeft.value = 0;
// } else if(event.target.scrollLeft < (scrollLeft.value - 32)){
//   scrollLeft.value -= event.target.clientWidth;
//   event.target.scrollLeft -= event.target.clientWidth;
// }
// }
</script>

<style scoped>
@media only screen and (max-width: 525px) {
  .product-page-container {
    z-index: 0 !important;
  }
  .product-page-wrapper {
    display: block !important;
    background: var(--background-grey, #f9f9f9) !important;
  }
  .right-section {
    background: var(--background-grey, #f9f9f9) !important;
    padding: 0 0 4px;
  }
  section {
    margin: 4px 0 0;
  }
  .product-images {
    display: flex !important;
    flex-wrap: nowrap !important;
    height: 70dvh !important;
    margin: 0 !important;
    overflow: auto hidden !important;
    position: relative !important;
    top: 0 !important;
    padding: 0 4px !important;
  }

  .product-images .product-image {
    min-width: calc(100dvw - 32px);
    height: 100% !important;
  }

  .share-btn {
    display: block !important;
  }
  p {
    font-size: 16px !important;
    line-height: 24px !important;
    letter-spacing: 0.2px !important;
  }
  .mobile-variant-selector {
    display: block !important;
  }

  .mobile-variant-selector .variant-selector {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 55;
  }
  .variant-selector section {
    margin: 0;
  }
}

.mobile-variant-selector {
  display: none;
}

.product-page {
  max-width: 1180px;
  margin: 0 auto;
}

.product-page-wrapper {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 50%);
}

.right-section {
  max-width: 520px;
}
.product-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(493px / 2 - 3px), 1fr));
  align-content: flex-start;
  gap: 6px;
  padding: 0 16px;
  box-sizing: border-box;
  max-width: 525px;
}

.product-images::-webkit-scrollbar {
  background: #dedede;
  height: 3px;
  width: 0;
}

.product-images::-webkit-scrollbar-thumb {
  background: var(--primary-purple, #342546);
  border-radius: 12px;
}
.right-section {
  justify-self: flex-start;
}
.product-image {
  height: 320px;
  cursor: pointer;
  /* width: 240px;
  border: 1px solid var(--primary-border-color);
  border-radius: 12px; */
}
section {
  padding: 16px;
  background: var(--plain-white, #fff);
}
.description-specification {
  padding: 0;
}

.description,
.specification {
  padding: 12px 16px;
}
.item-info-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 0 0 8px;
}

.share-btn {
  display: none;
}

h2 {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
  margin: 0;
}

p#item-name {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Regular;
  font-size: 24px;
  line-height: 30px;
  margin: 0;
}
span#retail-price {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 24px;
  line-height: 30px;
}
span#base-price {
  color: var(--disabled-text, #bebebe);
  font-family: Urbanist-Regular;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
  text-decoration: line-through;
  padding: 0 0 0 6px;
}
span#discount {
  color: var(--green, #01c159);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
  padding: 0 0 0 6px;
}

p.product-description {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  margin: 0;
  padding: 2px 0;
  user-select: none;
}
p.product-description span {
  color: var(--primary-orange);
  cursor: pointer;
  user-select: none;
}
p.product-description span:hover {
  text-decoration: underline;
}
.description-specification {
  border-top: 1px solid var(--primary-border-color);
  border-bottom: 1px solid var(--primary-border-color);
}

ul {
  padding-inline-start: 24px;
}
li {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}
</style>