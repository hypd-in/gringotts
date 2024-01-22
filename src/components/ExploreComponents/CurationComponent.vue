<template>
  <div class="curation-wrapper">
    <div class="curation-title">
      <h2 v-if="curation.title">{{ curation.title }}</h2>
      <button @click="goToCuration(curation.sub_collections[0])" v-if="curation.type == 'product'">View All</button>
    </div>
    <Bourbon :subCurations="curation.sub_collections" :curation="curation" class="curation-wrapper"
      v-if="curation.type == 'bourbon'" @open="goToCuration" />

    <Dial :subCurations="curation.sub_collections" :curation="curation" class="curation-wrapper"
      v-if="curation.type == 'dial'" @open="goToCuration" />

    <Tile :subCurations="curation.sub_collections" :curation="curation" class="curation-wrapper"
      v-if="curation.type == 'tile'" @open="goToCuration" />

    <Tile :subCurations="curation.sub_collections" :curation="curation" class="curation-wrapper"
      v-if="curation.type == 'bottle'" @open="goToCuration" />

    <Product :subCurations="curation.sub_collections" :curation="curation" class="curation-wrapper"
      v-if="curation.type == 'product'" @open="goToCuration" />

    <Category :subCurations="categoryCuration[curation.id]" :curation="curation" class="curation-wrapper"
      v-if="curation.type == 'category'" @open="goToCuration" />

    <CreatorCollection class="curation-wrapper" :subCurations="curation.sub_collections" :curation="curation"
      v-if="curation.type == 'trending'" @open="goToCuration" />
  </div>
</template>

<script setup>
import Bourbon from "~/components/ExploreComponents/BourbonCuration.vue";
import Tile from "~/components/ExploreComponents/TileCuration.vue";
import Dial from "~/components/ExploreComponents/DialCuration.vue";
import Product from "~/components/ExploreComponents/ProductCuration.vue";
import Category from "~/components/ExploreComponents/CategoryCuration.vue";
import CreatorCollection from "~/components/ExploreComponents/CreatorCollectionCuration.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const creatorStore = useCreatorStore();

const props = defineProps({
  curation: Object,
  categoryCuration: Object,
});

async function goToCuration(subCuration) {
  if (props.curation?.sub_type == "brand") {
    if (subCuration?.brand_id) {
      var brandInfo = await getBrandInfoByBrandId(subCuration.brand_id);
      if (brandInfo?.username) {
        routeToBrandProfile(brandInfo);
      }
    }
  } else if (
    props.curation?.type == "category" &&
    props.curation?.sub_type == "catalog"
  ) {
    navigateTo({
      name: "CategoryCuration",
      params: {
        creatorUsername: route.params.creatorUsername,
        categoryId: subCuration.id,
      },
      query: {
        title: subCuration?.name,
      },
    });
  } else if (props.curation?.sub_type == "brand-catalog") {
    if (subCuration.sub_collection_type == "brand") {
      if (subCuration.brand_info) {
        routeToBrandProfile(subCuration.brand_info);
      } else if (subCuration.brand_id) {
        var brandInfo = await getBrandInfoByBrandId(subCuration.brand_id);
        if (brandInfo?.id) {
          routeToBrandProfile(brandInfo);
        }
      }
    } else if (subCuration.sub_collection_type == "catalog") {
      routeToCuratedCollection(subCuration);
    }
  } else if (props.curation?.sub_type == "catalog" || props.curation.type == 'product') {
    routeToCuratedCollection(subCuration);
  } else if (props.curation?.type == "trending") {
    if (creatorStore?.info?.username) {
      routeToCreatorCollection(subCuration);
    }
  }
}

function routeToCreatorCollection(collectionInfo) {
  navigateTo({
    name: "CreatorCollection",
    params: {
      creatorUsername: creatorStore?.info?.username,
      collectionId: collectionInfo.id,
    },
    query: {
      title: collectionInfo?.collection_name,
    },
  });
}

function routeToBrandProfile(brandInfo) {
  navigateTo({
    name: "BrandProfile",
    params: {
      creatorUsername: creatorStore?.info?.username,
      brandUsername: brandInfo?.username,
    },
    query: {
      title: brandInfo?.name,
    },
  });
}

function routeToCuratedCollection(subCuration) {
  navigateTo({
    name: "CuratedCollection",
    params: {
      creatorUsername: creatorStore?.info?.username,
      curationId: subCuration.id,
    },
    query: {
      title: subCuration?.name,
    },
  });
}

async function getBrandInfoByBrandId(id) {
  await $fetch(`${useRuntimeConfig().public.entityURL}/api/app/brand/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((response) => {
    if (response.payload) {
      return response.payload;
    } else {
      return;
    }
  }).catch((err) => {
    console.log("Error fetching brand using id", err);
  })
}
</script>

<style scoped>
.curation-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

h2 {
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: 0.2px;
  margin: 0;
}

button {
  color: var(--primary-orange);
}

button:hover {
  text-decoration: underline;
}
</style>
