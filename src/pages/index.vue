<template>
  <div>
    Index Page
    <NuxtLink :to="{ name: 'Login' }">Go To Login</NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Index",
  layout: "standalone"
})
</script>

<style></style>