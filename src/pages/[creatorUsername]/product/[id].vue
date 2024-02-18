<template>
  <div class="product-page-container">
    <ProductView class="product-view" />
  </div>
</template>

<script setup>
import ProductView from "@/components/ProductComponents/PDPComponent.vue";

definePageMeta({
  name: "CreatorProduct",
  layout: "public",
});

const route = useRoute();
const config = useRuntimeConfig();
const product = useProductStore();
const creatorStore = useCreatorStore();

if (route.params.id) {
  const { data: productInfo, pending: fetchingProductInfo } = await useFetch(
    `${config.public.catalogURL}/api/app/catalog/${route.params.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (productInfo.value.payload) {
    product.saveProductInfo(productInfo.value.payload);
  }
}

if (route.params.creatorUsername && !creatorStore.info?.id) {
  const { data, pending: loadingCreatorInfo } = await useFetch(
    config.public.entityURL +
    "/api/app/influencer/username/" +
    route.params.creatorUsername,
    {
      key: "influencer_info_app",
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  creatorStore.saveCreatorInfo(data?.value?.payload);
}

useSeoMeta({
  title: `${product.info?.name} | ${creatorStore.info.name} | HYPD`,
  ogTitle: `${product.info?.name} | ${creatorStore.info.name} | HYPD`,
  description: `Buy ${product.info?.name} from ${creatorStore.info.name}'s store`,
  ogDescription: `Buy ${product.info?.name} from ${creatorStore.info.name}'s store`,
  ogImage: `${product.info?.featured_image?.src}`,
  ogUrl: `www.hypd.store/${creatorStore.info.name}`,
  twitterTitle: `${product.info?.name} | ${creatorStore.info.name} | HYPD`,
  twitterDescription: `Buy ${product.info?.name} from ${creatorStore.info.name}'s store`,
  twitterImage: `${product.info?.featured_image?.src}`,
  twitterCard: "summary_large_image",
  lang: "en-IN"
});

onMounted(() => {
  // trackingProductClicks("product_view",
  //   route.params.id,
  // )
})

</script>


<style scoped>
.product-view {
  padding: 12px 0;
  box-sizing: border-box;
}

@media only screen and (max-width: 520px) {
  .product-page-container {
    background: var(--background-grey, #f9f9f9);
    height: 100%;
  }

  .product-view {
    margin: 0 !important;
    padding: 0px;
  }
}
</style>