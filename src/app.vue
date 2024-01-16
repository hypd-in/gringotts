<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const store = useStore();
const creatorStore = useCreatorStore();
const runtimeConfig = useRuntimeConfig();
const userInfo = ref({});

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

onMounted(async () => {
  if (!store.user.id) {
    var user = await fetchUserInfo();
    await fetchCartInfo();
    if (user?.id) {
      userInfo.value = { ...user };
    }
  }
});
</script>