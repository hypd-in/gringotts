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
  if (route.params.creatorUsername) {
    $posthog().group('store', creatorStore.info.username, {
      username: creatorStore.info.username,
      id: creatorStore.info.id
    });
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
  store.saveHotSellingProducts(hotSellingProducts);

  saveFirstVisit();
  saveClientRequestId();

  trackingUserLanding();
  trackingUTM();

  // Condition for check iFrame
  await fetchCategories();
})

function saveFirstVisit() {
  if (useCookie("firstSiteVisit").value == null) {
    useCookie("firstSiteVisit").value = true;
    useCookie("firstSiteVisit", {
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
}

function saveClientRequestId() {
  if (!useCookie("clientRequestId").value) {
    useCookie("clientRequestId").value =
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36);

    useCookie("clientRequestId", {
      maxAge: 12 * 30 * 24 * 60 * 60 * 1000,
    });
  }
}

function trackingUTM() {
  var utmParams = useCookie("utmParams");
  if (utmParams.value) {
    return;
  }
  var utm = [];
  var cookieValue = "";
  var count = 0;
  if (route.query?.utm_medium) {
    utm[count] = `utm_medium=${route.query?.utm_medium}`;
    count++;
  }
  if (route.query?.utm_campaign) {
    utm[count] = `utm_campaign=${route.query?.utm_campaign}`;
    count++;
  }
  if (route.query?.utm_source) {
    utm[count] = `utm_source=${route.query?.utm_source}`;
    count++;
  }
  if (route.query?.utm_source1) {
    utm[count] = `utm_source1=${route.query?.utm_source1}`;
    count++;
  }
  if (route.query?.utm_source2) {
    utm[count] = `utm_source2=${route.query?.utm_source2}`;
    count++;
  }
  utm.forEach((utmItem, index) => {
    if (index > 0 && index != utm.length) {
      cookieValue += "&";
    }
    cookieValue += utmItem;
  });
  if (cookieValue.length > 0) {
    utmParams.value = cookieValue;
    useCookie("utmParams", {
      maxAge: 14 * 24 * 60 * 60 * 1000,
    })
  }
}

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