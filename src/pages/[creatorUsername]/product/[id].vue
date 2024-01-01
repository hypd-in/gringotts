<template>
  <div class="product-page-container">
    <ProductView class="product-view" />
  </div>
</template>

<script setup>
import ProductView from "@/components/ProductComponents/PDPComponent.vue";

definePageMeta({
  name: "ProductPage",
  layout: "default",
});

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const product = useProductStore();
const creatorStore = useCreatorStore();

if (route.params.id) {
  const { data: productInfo, pending: fetchingProductInfo } = await useFetch(
    `${runtimeConfig.public.catalogURL}/api/app/catalog/${route.params.id}`,
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

useSeoMeta({
  title: `${product.info?.name} | ${creatorStore.info.name} | HYPD`,
  ogTitle: `${product.info?.name}`,
  description: `Buy ${product.info?.name} from ${creatorStore.info.name}'s store`,
  ogDescription: `Buy ${product.info?.name} from ${creatorStore.info.name}'s store`,
  ogImage: `${product.info?.featured_image?.src}`,
  twitterImage: `${product.info?.featured_image?.src}`,
  twitterCard: "summary_large_image",
});

onBeforeMount(() => {
  console.log(creatorStore, product);
});
</script>


<style scoped>
.product-view {
  padding: 12px 0;
  box-sizing: border-box;
}

.product-page-container {
  position: relative;
  z-index: 0;
}
@media only screen and (max-width: 520px) {
  .product-page-container {
    background: var(--background-grey, #f9f9f9);
    height: 100%;
  }
  .product-view {
    margin: 0 !important;
    height: calc(100dvh);
    padding: 0px;
  }
}
</style>