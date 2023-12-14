<template>
  {{ route.params }}
  {{ brandInfo.payload }}
</template>

<script setup>
const nuxtApp = useNuxtApp();
console.log("fuck yay", nuxtApp.payload?.data?.brand_profile_info, "HELP FUCK");

import { getBrandInfoFromUsername } from "../../../API/brandProfile.js";

const route = useRoute();
const brandUsername = route.params.brandUsername;
const uri =
  "https://entity.getshitdone.in/api/app/brand/username/" + brandUsername;

// const { data: brandInfo, pending, error, refresh } = await useAsyncData(
//   'mountains',
//   () => $fetch(uri)
// )
const { data: brandInfo } = await useFetch(uri, {
  key: "brand_profile_info",
  pick: ["payload"],
  onResponse({ request, response, options }) {
    // Process the response data
    console.log(response._data.payload);
  },
});


useSeoMeta({
  ogtitle: () => brandInfo.value.name,
  description: () => brandInfo.value.payload.bio,
  ogImage: () => brandInfo.value.payload.cover_img.src,
  ogDescription: () => brandInfo.value.payload.bio,
  ogImage: () => brandInfo.value.payload?.cover_img?.src,
  ogUrl: () => brandInfo.value.payload?.website,
  twitterTitle: () => brandInfo.value.payload?.name,
  twitterDescription: () => brandInfo.value.payload?.bio,
  twitterImage: () => brandInfo.value.payload?.cover_img?.src,
  twitterCard: "summary",
});
</script>

<style>
</style>