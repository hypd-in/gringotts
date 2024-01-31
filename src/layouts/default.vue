<template>
  <div>
    <NuxtLoadingIndicator
      color="linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)"
    />
    <Header />
    <NuxtPage />
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .header {
    height: 58px !important;
  }
}
.header {
  position: sticky;
  top: 0;
  height: 72px;
  background: #fff;
}
</style>