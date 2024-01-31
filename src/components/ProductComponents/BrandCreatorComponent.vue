<template>
  <section class="brand-creator-wrapper">
    <div @click="goToBrandPage" v-if="brandInfo" class="brand-info-container info-container-wrapper">
      <ImageFrame class="image" v-if="brandLogo" :src="brandLogo" />
      <div class="info-container">
        <span id="info-tag">Fulfilled by
          <img src="@/assets/icons/misc/verified-tag.svg" alt="" />
        </span>
        <p id="name">{{ brandInfo?.name }}</p>
      </div>

      <button class="visit-brand">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.66663 7.33337L14.1333 1.8667" stroke="#2597DF" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M14.6667 4.53325V1.33325H11.4667" stroke="#2597DF" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M7.33337 1.33325H6.00004C2.66671 1.33325 1.33337 2.66659 1.33337 5.99992V9.99992C1.33337 13.3333 2.66671 14.6666 6.00004 14.6666H10C13.3334 14.6666 14.6667 13.3333 14.6667 9.99992V8.66659"
            stroke="#2597DF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        Visit Brand
      </button>
    </div>

    <div @click="goToCreatorStore" v-if="creatorInfo?.id" class="info-container-wrapper creator-info-wrapper">
      <ImageFrame v-if="creatorImage" class="image" :src="creatorImage" />
      <div class="info-container">
        <span id="info-tag">Curated for you by</span>
        <p id="name">{{ creatorInfo?.name }}</p>
      </div>
      <button class="visit-store">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 5.11334V4.46667C5 2.96667 6.20667 1.49334 7.70667 1.35334C9.49333 1.18001 11 2.58667 11 4.34001V5.26001"
            stroke="#2597DF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M6.00001 14.6666H10C12.68 14.6666 13.16 13.5933 13.3 12.2866L13.8 8.28659C13.98 6.65992 13.5133 5.33325 10.6667 5.33325H5.33334C2.48667 5.33325 2.02001 6.65992 2.20001 8.28659L2.70001 12.2866C2.84001 13.5933 3.32001 14.6666 6.00001 14.6666Z"
            stroke="#2597DF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10.3303 8.00008H10.3363" stroke="#2597DF" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M5.66305 8.00008H5.66903" stroke="#2597DF" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>

        Visit store
      </button>
    </div>
  </section>
</template>

<script setup>
import { getCreatorUserName } from "~/utils/helperMethods";
import ImageFrame from "../ImageFrame.vue";
const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const creatorStore = useCreatorStore();

const brandInfo = computed(() => {
  return productStore.info?.brand_info;
});
const creatorInfo = computed(() => {
  return creatorStore.info;
});
const brandLogo = computed(() => {
  return productStore.info?.brand_info?.logo?.src;
});

const creatorImage = computed(() => {
  return creatorStore.info?.profile_image?.src;
});

async function goToBrandPage() {
  var creatorUsername = await getCreatorUserName();
  console.log(creatorUsername);
  if (brandInfo.value?.username) {
    navigateTo({
      name: "BrandProfile",
      params: {
        creatorUsername: creatorUsername,
        brandUsername: brandInfo.value?.username,
      },
      query: {
        title: brandInfo.value?.name,
      }
    })
  }
}

async function goToCreatorStore() {
  var creatorUsername = creatorStore.info?.username || await getCreatorUserName();
  navigateTo({
    name: "CreatorStore",
    params: {
      creatorUsername: creatorUsername,
    },
  });
}
</script>

<style scoped>
.info-container-wrapper {
  display: grid;
  grid-template-columns: 60px calc(100% - 60px - 112px - 24px) 112px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--primary-border-color);
  padding: 0 0 16px;
  cursor: pointer;
}

.info-container-wrapper:hover p,
.info-container-wrapper:hover button {
  text-decoration: underline;
}

.image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 1px solid #f1f1f1;
}

span#info-tag {
  color: #585858;
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;

  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
}

p {
  padding: 0;
  margin: 0;

  color: var(--primary-black, #13141b);
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
  width: calc(100%);
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  text-overflow: ellipsis;
}

button {
  color: var(--dark-blue);
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;

  display: grid;
  grid-template-columns: 16px auto;
  align-items: center;
  gap: 6px;

  width: 112px;
  padding: 12px;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
}

.creator-info-wrapper {
  padding: 16px 0 16px;
  border-bottom: 0;
}
</style>