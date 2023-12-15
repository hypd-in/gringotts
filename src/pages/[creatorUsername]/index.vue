<template>
  <div class="">
    {{ creatorStore.info?.name }}
    <NuxtLink
      :to="`${route.params.creatorUsername}/product/60fa9e458a16dc68df17dfe4`"
      >Go To Product</NuxtLink
    >
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const creatorStore = useCreatorStore();

</script>

<style scoped>
</style>