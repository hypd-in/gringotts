<template>
  <div>App Vue (can be considered as default layout (if only one layout))</div>
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
      methods: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  creatorStore.saveCreatorInfo(data?.value?.payload);
  console.log(loadingCreatorInfo.value);
}

onMounted(() => {
  console.log("App mounted");
});
</script>