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
const config = useRuntimeConfig();
const userInfo = ref({});

onBeforeMount(async () => {
  if (!store.user.id) {
    var user = await fetchUserInfo();
    if (user?.id) {
      userInfo.value = { ...user };
    }
  } else {
    await fetchCartInfo();
    fetchWishlistedProducts();
  }
});

onMounted(async () => {
  await fetchAllCoupons()
})


if (route.params.creatorUsername) {
  const { data, pending: loadingCreatorInfo } = await useFetch(
    config.public.entityURL +
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
</script>