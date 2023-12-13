<template>
  {{ route.params }}
  {{ response.data.payload }}
</template>

<script setup>
import { getBrandInfoFromUsername } from "../../../API/brandProfile.js";
import { useRoute } from "vue-router";

const response = ref(null);
console.log("HERE");
response.value = await useFetch(
  `https://entity.getshitdone.in/api/app/brand/username/ghumakkad`,
  {
    onResponse({ request, response, options }) {
      // Process the response data
      console.log( request, response, options);
      useSeoMeta({
        description: () => response?._data?.payload?.bio,
        ogTitle: () => response?._data?.payload?.name,
        ogDescription: () => response?._data?.payload?.bio,
        ogImage: () => response?._data?.payload?.cover_img?.src,
        ogUrl: () => response?._data?.payload?.website,
        twitterTitle: () => response?._data?.payload?.name,
        twitterDescription: () => response?._data?.payload?.bio,
        twitterImage: () => response?._data?.payload?.cover_img?.src,
        twitterCard: "summary",
      });

      useHead({
        htmlAttrs: {
          lang: "en",
        },
        title: () => response?.data?.payload?.name,
        link: [
          {
            rel: "icon",
            type: "image/png",
            href: "/favicon.png",
          },
        ],
      });
    },
  }
);

const route = useRoute();
console.log(route.params); // { id: '123' }
</script>

<style>
</style>