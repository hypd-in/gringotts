<template>
  <div>App Vue (can be considered as default layout (if only one layout))</div>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
onMounted(() => {
  console.log("App mounted");
});
</script>