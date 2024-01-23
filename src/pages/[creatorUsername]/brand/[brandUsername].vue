<template>
  <section>
      <div class="profile-wrapper">
        <div class="display-picture">
          <img
            :src="getReplacedSource(results?.cover_img?.src)"
            :alt="results.name"
          />
        </div>
        <div class="name">
          {{ results.name }}
        </div>
        <button
          v-if="user_following"
          @click="toggleFollowStatus"
          class="following-btn active-btn hide-in-iframe"
        >
          Following
        </button>
        <button
          v-else
          @click="toggleFollowStatus"
          class="following-btn inactive-btn hide-in-iframe"
        >
          Follow
        </button>

        <div class="follower-count">
          <span
            style="font-weight: bold"
            class=""
            v-if="!results.followers_count"
          >
            {{ 0 + temp_count }}
          </span>
          <span style="font-weight: bold" class="" v-else>
            {{ results.followers_count + temp_count }}
          </span>
          Followers
        </div>

        <div class=""></div>
        <div class="bio" v-if="results.bio">
          {{ brandBio }}
          <span
            style="color: #fb6c23; cursor: pointer"
            @click="toggleBio"
            v-show="!expandedBio && results.bio.length > 120"
          >
            View More
          </span>
          <span
            style="color: #fb6c23; cursor: pointer"
            @click="toggleBio"
            v-show="expandedBio && results.bio.length > 120"
          >
            View Less
          </span>
        </div>
      </div>
  </section>
  <!-- {{ route.params }}
  {{ brandInfo.payload }} -->
</template>

<script setup>
definePageMeta({
  name:"BrandProfile"
})


const nuxtApp = useNuxtApp();
console.log("fuck yay", nuxtApp.payload?.data?.brand_profile_info, "HELP FUCK");

import { getReplacedSource } from "~/utils/helperMethods.js";
// import { getBrandInfoFromUsername } from "../../../API/brandProfile.js";

const route = useRoute();
const brandUsername = route.params.brandUsername;
const uri =
  "https://entity.getshitdone.in/api/app/brand/username/" + brandUsername;

const { data: brandInfo } = await useFetch(uri, {
  key: "brand_profile_info",
  pick: ["payload"],
  onResponse({ request, response, options }) {
    // Process the response data
    console.log(response._data.payload);
  },
});

useSeoMeta({
  ogtitle: () => brandInfo.value?.payload?.name,
  description: () => brandInfo.value?.payload?.bio,
  ogImage: () => brandInfo.value?.payload?.cover_img?.src,
  ogDescription: () => brandInfo.value?.payload?.bio,
  ogImage: () => brandInfo.value?.payload?.cover_img?.src,
  ogUrl: () => brandInfo.value?.payload?.website,
  twitterTitle: () => brandInfo.value?.payload?.name,
  twitterDescription: () => brandInfo.value?.payload?.bio,
  twitterImage: () => brandInfo.value?.payload?.cover_img?.src,
  twitterCard: "summary",
});
</script>

<style scoped>
.brand-profile {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr auto;
}
.brand-profile img {
  height: 100%;
  width: 100%;
}
@media screen and (min-width: 0) and (max-screen: 480px) {
  .brand-profile {
    grid-template-columns: 1fr 4fr;
    grid-template-rows: 1fr auto;
  }
}
</style>