<template>
  <div class="afflink-wrapper">
    <div class="redirection">
      <div class="creator-image">
        <img class="profile" v-if="creatorStore.info" :src="getReplacedSource(creatorStore.info.profile_image.src)"
          alt="" />
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
      <h2 class="you"> You are being redirected </h2>
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
import { onMounted } from 'vue';

definePageMeta({
  name: "AfflinkRedirection",
  layout: "standalone"
})

const route = useRoute();
const creatorStore = useCreatorStore();
const config = useRuntimeConfig();
async function routeToAfflink() {
  await $fetch(`${config.public.catalogURL}/api/app/influencer/deeplink/${route.params.afflinkId}`, {
    method: "GET",
    credentails: "include",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((response) => {
    if (response.payload) {
      navigateTo(response.payload, {
        external: true,
        open: {
          target: '_blank'
        }
      })
    }
  }).catch((error) => {
    alert("There was an error routing ")
    console.log("Error fetching afflink redirection");
  })
}
onMounted(async () => {
  console.log(route.params.afflinkId);
  if (route.params.afflinkId) {
    await routeToAfflink();
  }
})

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