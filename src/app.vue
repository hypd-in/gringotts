<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const creatorStore = useCreatorStore();
const runtimeConfig = useRuntimeConfig();

if (route.params.creatorUsername) {
  const { data, pending: loadingCreatorInfo } = await useFetch(
    runtimeConfig.public.entityURL +
      "/api/app/influencer/username/" +
      route.params.creatorUsername,
    {
      key:"influencer_info_app",
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  creatorStore.saveCreatorInfo(data?.value?.payload);
}

onMounted(() => {
  console.log("App mounted");
});
</script>