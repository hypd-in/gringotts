<template>
  <div>
    Brand Page
    {{ route.params.creatorUsername }} - {{ route.params.brandUsername }}
  </div>
</template>

<script setup>
definePageMeta({
    name: "BrandProfile"
})
const route = useRoute();
</script>

<style>
</style>