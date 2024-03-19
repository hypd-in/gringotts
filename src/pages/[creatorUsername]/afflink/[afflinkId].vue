<template>
  <div class="afflink-wrapper">
    <div class="redirection">
      <div class="creator-image">
        <img class="profile" v-if="creatorStore.info?.profile_image"
          :src="getReplacedSource(creatorStore.info.profile_image.src)" alt="" />
      </div>
      <div class="outer-circle circle">
        <div class="inner-circle circle">
          <div class="inner-most-circle circle"></div>
        </div>
      </div>
      <div class="power">
        <span class="powered-by">POWERED BY </span>
        <span class="hypd-logo">HYPD.</span>
      </div>
    </div>
    <div class="text">
      <h2 class="you">You are being redirected</h2>
      <p class="from" v-if="creatorStore.info">
        From {{ creatorStore.info.name }}'s store
      </p>
      <div class="from" v-else>
        From {{ $route.params.creator_username }}'s store
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  name: "AfflinkRedirection",
  layout: "standalone",
});
import { PostHog } from "posthog-node";
const runtimeConfig = useRuntimeConfig();
const posthog = new PostHog(runtimeConfig.public.posthogPublicKey, {
  host: runtimeConfig.public.posthogHost,
});
const route = useRoute();
const creatorStore = useCreatorStore();
const config = useRuntimeConfig();

if (route.params.creatorUsername) {
  const {
    data,
    pending: loadingCreatorInfo,
    error,
  } = await useFetch(
    config.public.entityURL +
    "/api/app/influencer/username/" +
    route.params.creatorUsername,
    {
      key: "influencer_info_store",
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (data.value.payload) {
    creatorStore.saveCreatorInfo(data?.value?.payload);
  } else if (error) {
    errorHandler(error);
  }
}

if (route.params.afflinkId) {
  const { data, error } = await useFetch(
    `${config.public.catalogURL}/api/app/influencer/deeplink/${route.params.afflinkId}`,
    {
      method: "GET",
      credentails: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (data) {
    const my_uuid =
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36);
    posthog.capture({
      distinctId: my_uuid,
      event: "afflink:redirect",
      properties: {
        afflink_url: config.public.base + route.fullPath,
        redirection_url: data.value.payload,
        creator_id: creatorStore.info.id,
        creator_username: creatorStore.info.username,
      },
      groups: { "store": creatorStore.info.username },
    });
    await posthog.shutdownAsync();
    let url = data.value.payload
    if (route.query.dm_id) {
      url = `${url}&dm_id=${route.query.dm_id}`
    }
    if (route.query.dm_source) {
      url = `${url}&dm_source=${route.query.dm_source}`
    }
    navigateTo(url, { external: true });
  } else if (error) {
    alert("Sorry! there was an error routing to the partner website");
    console.log("Error fetching afflink redirection", error);
  }
}

useSeoMeta({
  title: `Afflink • ${creatorStore.info?.name} • HYPD • #getHYPD`,
  ogTitle: `Afflink • ${creatorStore.info?.name} • HYPD • #getHYPD`,
  twitterTitle: `Afflink • ${creatorStore.info?.name} • HYPD • #getHYPD`,
  description: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  twitterDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogDescription: `Shop from your favourite Creator's recommendations directly from their collection! | #ItsAFullTimeJob | #getHYPD`,
  ogImage: creatorStore.info?.profile_image?.src,
  twitterImage: creatorStore.info?.profile_image?.src,
  twitterCard: "summary",
  lang: "en-IN",
});

// async function routeToAfflink() {
//   await $fetch(`${config.public.catalogURL}/api/app/influencer/deeplink/${route.params.afflinkId}`, {
//     method: "GET",
//     credentails: "include",
//     headers: {
//       "Content-Type": "application/json",
//     }
//   }).then((response) => {
//     if (response.payload) {
//       navigateTo(response.payload, {
//         external: true,
//       })

//       ;
//     }
//   }).catch((error) => {
//     alert("Sorry! there was an error routing to the partner website ")
//     console.log("Error fetching afflink redirection", error);
//   })
// }

onMounted(async () => {
  if (route.params.afflinkId) {
    // await routeToAfflink();
  }
});
</script>

<style scoped>
.text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% + 12.5vw + 130px));
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  flex-direction: column;
}

.profile {
  height: 64px;
  width: 64px;
  border-radius: 50%;
}

.profile img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.creator-image {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 99;
}

h2,
p {
  padding: 0;
  margin: 0;
  max-width: calc(100% - 16px);
  margin: 0 auto;
}

.you {
  font-family: "Urbanist-Bold";
  font-size: 16px;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-align: center;
}

.from {
  font-family: "Urbanist-Regular";
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.5px;
  text-align: center;
  color: #a9a9a9;
}

.power {
  position: absolute;
  bottom: 20px;
}

.hypd-logo {
  font-size: 16px;
}

.redirection {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle {
  animation: ripple 1.5s infinite linear;
}

.outer-circle {
  max-height: 1000px;
  max-width: 1000px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(25vw + 200px);
  width: calc(25vw + 200px);
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-spacing: 5px;
  border-radius: 50%;
}

.inner-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(25vw + 100px);
  width: calc(25vw + 100px);
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-spacing: 5px;
  border-radius: 50%;
}

.inner-most-circle {
  height: 25vw;
  width: 25vw;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-spacing: 5px;
  border-radius: 50%;
}

.powered-by {
  font-family: "Urbanist-Medium";
  font-size: 9px;
  font-weight: 600;
  line-height: 7px;
  letter-spacing: 0.4000000059604645px;
  color: #bebebe;
}

/* Animation */
@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  50% {
    transform: scale(0.9);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>