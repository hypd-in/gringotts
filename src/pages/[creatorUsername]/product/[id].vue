<template>
  <div class="product-wrapper">
    I'm Here at product with product id {{ route.params.id }} sold by
    {{ creatorStore.info?.name }}
  </div>
</template>

<script setup>
const route = useRoute();
const creatorStore = useCreatorStore();
</script>

<style scoped>
</style>