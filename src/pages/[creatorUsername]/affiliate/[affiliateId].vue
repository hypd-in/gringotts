<template>
  <div></div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "standalone",
})
const route = useRoute();
onMounted(() => {
  if (route.params.creatorUsername && route.params.affiliateId) {
    navigateTo({
      name: "AfflinkRedirection",
      params: {
        creatorUsername: route.params.creatorUsername,
        afflinkId: route.params.affiliateId,
      },
    })
  }
})
</script>