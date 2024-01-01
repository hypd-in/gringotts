<template>
  <div class="">
    {{ creatorStore.info?.name }}
    <NuxtLink
      :to="`/${route.params.creatorUsername}/product/62c03bb885d2956bb92703ed`"
      >Go To Product</NuxtLink
    >
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const creatorStore = useCreatorStore();

if (route.params.creatorUsername) {
  const { data, pending: loadingCreatorInfo } = await useFetch(
    runtimeConfig.public.entityURL +
      "/api/app/influencer/username/" +
      route.params.creatorUsername,
    {
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  creatorStore.saveCreatorInfo(data?.value?.payload);
}

useSeoMeta({
  title: `${creatorStore.info.name} | HYPD`,
  ogTitle: `${creatorStore.info.name} | HYPD`,
  description: `Shop from ${creatorStore.info.name}'s store on HYPD`,
  ogDescription: `Shop from ${creatorStore.info.name}'s store on HYPD`,
  ogImage: `${creatorStore.info?.profile_image?.src}`,
  twitterImage: `${creatorStore.info?.profile_image?.src}`,
  twitterCard: 'summary_large_image',
});
</script>

<style scoped>
</style>