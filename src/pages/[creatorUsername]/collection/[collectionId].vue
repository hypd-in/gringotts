<template>
  <div class="curation-wrapper">
    <div class="canvas-container">
      <canvas id="myCanvas" width="283" height="283"></canvas>
    </div>
    <div class="sub-header">
      <div class="journey-path">
        <span @click="gotoStore">
          <ImageFrame :alt="creatorStore.info.name"
            style="width: 32px; height: 32px; border-radius: 50%; margin-right: 6px"
            :src="getReplacedSource(creatorStore.info?.profile_image?.src, 100)" />
          {{ creatorStore.info.name }} / Collections / &nbsp;
        </span>
        <!-- <ImageFrame style="width: 32px; height: 32px; border-radius: 6px; margin-right: 6px; object-fit: cover;" :src="getReplacedSource(collectionInfo.image.src, 100)" /> -->
        <span v-if="route.query.title" style="color: #000">{{
          collectionName }}</span>
      </div>
    </div>

    <div class="curation-container">
      <div class="curation-products">
        <h2 class="heading">{{ collectionName }}</h2>
        <div class="product-listing-wrapper" v-if="collectionProducts.length > 0">
          <ProductCard src="creator-collection-product" v-for="product in collectionProducts" :key="product?.id"
            :itemInfo="product" />
        </div>

        <div v-else-if="loadingProducts" style="display: flex; justify-content: center">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div v-else-if="!loadingProducts && collectionProducts.length == 0" class="no-products">
          <img src="@/assets/illustrations/no-orders.png" alt="">
          No products found.
        </div>

        <div class="pagination-target" ref="target"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ImageFrame from '~/components/ImageFrame.vue';
import ProductCard from '~/components/ProductComponents/ProductCard.vue';
import track from '~/utils/tracking-posthog';
definePageMeta({
  name: "CreatorCollection",
  layout: "public"
})

const route = useRoute();
const router = useRouter()
const creatorStore = useCreatorStore();
const collectionInfo = ref({});
const catalogsSent = ref(0);
const totalNoOfProducts = ref(0);
const observer = ref(null);
const target = ref(null);
const loadingProducts = ref(true);
const collectionName = computed(() => {
  return collectionInfo.value?.name || route.query.title;
})
const collectionProducts = ref([]);


const defaultSrc = ref('')

if (route.params.collectionId) {
  const { data: response, error } = await useFetch(`${useRuntimeConfig().public.catalogURL}/api/app/influencer/collection`, {
    method: "GET",
    credentials: "include",
    params: {
      id: route.params.collectionId,
    },
    headers: {
      "Content-Type": "application/json",
    }
  })
  if (response) {
    collectionInfo.value = { ...response.value.payload }
    if (collectionInfo.value?.catalog_ids?.length > 0) {
      totalNoOfProducts.value = collectionInfo.value?.catalog_ids?.length;


      if (creatorStore.creatorCollectionInfo.products.length > 0) {
        collectionProducts.value = [...creatorStore.creatorCollectionInfo.products],
          catalogsSent.value = creatorStore.creatorCollectionInfo.catalogSent
        totalNoOfProducts.value = totalNoOfProducts.value - creatorStore.creatorCollectionInfo.catalogSent
      }

      fetchCatalogInfo();
    }
  } else if (error) {
    console.log("Error fetching collection info", err);
  }
}

useSeoMeta({
  title: `${collectionInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  ogTitle: `${collectionInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  twitterTitle: `${collectionInfo.value?.name} | ${creatorStore.info?.name} | HYPD`,
  description: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  twitterDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogImage: collectionInfo.value?.image?.src ?? defaultSrc,
  twitterImage: collectionInfo.value?.image?.src ?? defaultSrc,
  twitterCard: "summary",
  lang: "en-IN",
  ogUrl: `https://www.hypd.store/${creatorStore.info?.username}/collection/${route.params.collectionId}`,
})

// Function to load and draw images
function drawImages() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // Define image sources and positions
  let images = []
  for (let i of collectionInfo.value.default_image) {
    images.push(i.src)
  }

  const imagePromises = []; // Array to store image loading promises
  images.forEach((imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous"
    img.style.height = '142px'
    img.style.width = '142px'

    // Use promises to handle image loading asynchronously
    imagePromises.push(new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    }));
  });

  Promise.all(imagePromises)
    .then((loadedImages) => {
      loadedImages.forEach((img, index) => {
        // Calculate quadrant dimensions
        const quadrantWidth = canvas.width / 2;
        const quadrantHeight = canvas.height / 2;

        // Stretch the image to fill the quadrant dimensions
        const scaledWidth = quadrantWidth;
        const scaledHeight = quadrantHeight;

        // Calculate quadrant coordinates
        const quadrantX = (index % 2) * quadrantWidth;
        const quadrantY = Math.floor(index / 2) * quadrantHeight;

        // Draw the stretched image
        ctx.drawImage(img, 0, 0, img.width, img.height, quadrantX, quadrantY, scaledWidth, scaledHeight);

      });

      // Ensure images are drawn before converting (replace ... with your drawing logic)
      const imageData = canvas.toDataURL("image/png");
      defaultSrc.value = imageData;
    })
    .catch((error) => {
      console.error("Error loading images:", error);
    });

}



function gotoStore() {
  router.replace({
    name: "CreatorStore",
    creatorUsername: creatorStore.info.username
  })
}

async function fetchCatalogInfo() {
  loadingProducts.value = true;
  let catalogIds = [...collectionInfo.value?.catalog_ids];
  var params = new URLSearchParams();
  var maxLimit = 0;
  if (totalNoOfProducts.value > 20) {
    maxLimit = 20;
  } else {
    maxLimit = totalNoOfProducts.value;
  }

  for (let i = catalogsSent.value; i < catalogsSent.value + maxLimit; i++) {
    params.append("id", catalogIds[i]);
    totalNoOfProducts.value -= 1;
  };
  if (params.size <= 0) {
    return;
  }
  if (totalNoOfProducts.value == catalogsSent.value) {
    observer?.value?.unobserve(target.value);
  }

  await $fetch(`${useRuntimeConfig().public.catalogURL}/api/app/catalog/basic?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((response) => {
    if (response.payload) {
      collectionProducts.value = [...collectionProducts.value, ...response.payload];
      catalogsSent.value += maxLimit;
      creatorStore.saveCreatorCollection({ products: [...collectionProducts.value], catalogSent: catalogsSent.value })
    }
    loadingProducts.value = false;
  }).catch((error) => {
    loadingProducts.value = false;
    console.log("Error fetching catalog info", error);
  })
}

function callback(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !loadingProducts.value) {
      if (totalNoOfProducts.value < 1) {
        return;
      } else {
        fetchCatalogInfo()
      }
    }
  })
}

onMounted(() => {
  if (collectionInfo.value.default_image.length > 0) {
    drawImages()
  }

  if (target.value) {
    observer.value = addingObserver(target.value, callback)
  }
  track('collection:visit', {
    creator_name: creatorStore.info.name,
    creator_username: creatorStore.info.username,
    collection_id: route.params.collectionId
  })
})
</script>


<style scoped>
.canvas-container {
  border-radius: 16px;
  overflow: hidden;
  height: 273px;
  width: 273px;
  display: none;
}

@media only screen and (max-width: 520px) {
  .sub-header {
    display: none;
  }

  h2 {
    display: none !important;
  }
}

.sub-header {
  background: #eeeeee;
  padding: 12px 16px;
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  position: sticky;
  top: 72px;
  z-index: 52;
}

.journey-path span {
  display: flex;
  align-items: center;
}

.journey-path {
  cursor: pointer;
  max-width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  font-family: 'Urbanist-Medium';
  font-size: 12px;
  color: #a9a9a9;

}

.curation-container {
  font-family: Urbanist-Bold;
  max-width: 1024px;
  margin: 0 auto;
  box-sizing: border-box;
}

.curation-wrapper {
  position: relative;
}

h2 {
  margin: 0;
  display: none;
}
</style>