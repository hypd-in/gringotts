<template>
  <div>
    {{ route.params.curationId | route.params.creatorUsername }}
  </div>
</template>

<script setup>
definePageMeta({
  name: "CreatorCollection",
  layout: "public"
})

const route = useRoute();
</script>

<style scoped></style>