<template>
  <div>
    Brand Page
    {{ route.params.creatorUsername }} - {{ route.params.brandUsername }}
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style>
</style>