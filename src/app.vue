<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>


// posthog server setup
// import { useAsyncData, useCookie, useRuntimeConfig } from 'nuxt/app';
// import { PostHog } from 'posthog-node';

// const { data: someData, error } = await useAsyncData('ctaText', async () => {
//   const runtimeConfig = useRuntimeConfig();
//   const posthog = new PostHog(
//     runtimeConfig.public.posthogPublicKey,
//     { host: runtimeConfig.public.posthogHost }
//   );

//   const cookies = useCookie(`ph_${runtimeConfig.public.posthogPublicKey}_posthog`);
//   if (cookies && cookies.value) {
//     try {
//       const distinctId = cookies.value.distinct_id; // or you can use your user's email, for example.
//       posthog.capture({
//         distinctId: distinctId,
//         event: 'user_did_something"',
//       })
//       await posthog.shutdownAsync()
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   return "Some data";
// });
// posthog ends

import { clearLocalCartItems } from "@/utils/cartMethods.js"

const route = useRoute();
const router = useRouter();
const store = useStore();
const creatorStore = useCreatorStore();
const runtimeConfig = useRuntimeConfig();

const cart_details = ref()
const wishlisted_items = ref([])
const cart_items = ref([])
const level_one_categories = ref([])

const { $posthog } = useNuxtApp()



if (route.params.creatorUsername) {
  const { data, pending: loadingCreatorInfo } = await useFetch(
    runtimeConfig.public.entityURL +
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
  creatorStore.saveCreatorInfo(data.value.payload);
}

onBeforeMount(async () => {
  await fetchUserInfo();
  if (store.user.id) {

    // identify user
    $posthog().identify(
      store.user.id,
    );

    clearLocalCartItems();
    await fetchCartInfo();

    // tracking.trackingUser();
  } else {
    if (route.query.isExpress) {
      await getCartItemsFromLocalStorage();
    }
  }

  // Calling Coupons API to fetch Brands for Hot selling Page
  await fetchAllCoupons();
  // created
  document.addEventListener("visibilitychange", async () => {
    if (
      document.visibilityState == "visible" &&
      route.query.isExpress
    ) {
      await fetchCartInfo();
    }
  });

})


onMounted(async () => {

  if (creatorStore.info.username) {
    $posthog().group('store', creatorStore.info.username);
  }
  else {
    let name = await getCreatorUserName()
    $posthog().group('store', name);
  }

  // Calling Hot selling Products API
  let response = await $fetch(runtimeConfig.public.orderURL + "/api/hot-selling-catalogs", {
    method: "GET",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
  })

  let hotSellingProducts = [...response?.payload];
  store.saveHotSellingProducts(hotSellingProducts)

  // uncomment later
  // this.trackingUTM();
  // tracking.trackingUserLanding();

  // Condition for check iFrame
  await fetchCategories();
})

async function fetchCategories() {
  try {
    let response = await $fetch(runtimeConfig.public.catalogURL + "/api/app/category/lvl1",
      {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        }
      }
    )
    level_one_categories.value = response?.payload;
  }
  catch (err) {
    console.log(err);
    alert(err.response.data.error[0].message);
  }
}

</script>