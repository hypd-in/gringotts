<template>
  <div>
      {{route.params.creator}}'s Store
      <NuxtPage> </NuxtPage>
  </div>
</template>

<script setup>
const route = useRoute()
onMounted(() => {
  console.log("creator store setup");
});
</script>

<style>
</style>