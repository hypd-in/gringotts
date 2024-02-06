<template>
      <div class="product-listing-wrapper">
            <Product src="creator-store-spotlight" v-for="product in creatorStore.spotlight" :key="product?.id"
                  :itemInfo="product" origin="creator-store" source="creator-store" />
      </div>
</template>
  
<script setup>

import Product from "~/components/ProductComponents/ProductCard.vue";
import track from "~/utils/tracking-posthog";

const runtimeConfig = useRuntimeConfig()
const creatorStore = useCreatorStore()

const total_no_of_catalogs = ref(0)
const catalogIds = ref(0)
const catalogs = ref([])
const catalogs_sent = ref(0)

async function getCatalogIds() {
      try {
            let response = await $fetch(runtimeConfig.public.cmsURL + "/api/catalog/influencer",
                  {
                        method: "GET",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        credentials: 'include',
                        query: { influencer_id: creatorStore.info.id }
                  })
            response = JSON.parse(response)
            response = response.payload
            if (response && response?.length > 0) {
                  total_no_of_catalogs.value = response?.length;
                  catalogIds.value = response;
                  await getCatalog();
            }

      }
      catch (err) {
            alert(err);
      }
}


async function getCatalog() {
      let ids = catalogIds.value;
      let max_limit = 0;

      if (total_no_of_catalogs.value > 20) {
            max_limit = 20;
      } else {
            max_limit = total_no_of_catalogs.value;
      }

      let params = ''
      let count = 0

      for (
            let i = catalogs_sent.value + 0;
            i < catalogs_sent.value + max_limit;
            i++
      ) {
            if (count == 0) {
                  params += `?id=${ids[i]}`;
            }
            else {
                  params += `&id=${ids[i]}`;
            }
            total_no_of_catalogs.value -= 1;
            count++
      }
      try {
            let response = await $fetch(runtimeConfig.public.catalogURL + "/api/v2/app/catalog/basic" + params, {
                  method: "GET",
                  headers: {
                        "Content-Type": "application/json",
                  },
                  credentials: 'include',
            })
            if (response.payload) {
                  catalogs.value = [...catalogs.value, ...response.payload];
                  creatorStore.saveSpotlight([...catalogs.value])
                  catalogs_sent.value += max_limit;

                  if (total_no_of_catalogs.value > 0) {
                        count = 0
                        await getCatalog();
                  }

            }
      } catch (err) {
            console.log(err)
      }
}


onMounted(() => {
      if (creatorStore.spotlight.length > 0) {
            catalogs.value = [...creatorStore.spotlight]
      }
      else {
            getCatalogIds()
      }

      track('creator_store_spotlight:visit', {
            creator_name: creatorStore.info.name,
            creator_username: creatorStore.info.username,
      })
})

</script>
