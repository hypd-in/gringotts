<template>
  <div>
    <NuxtLoadingIndicator color="linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)" />
    <Header />
    <div class="page-content">
      <NuxtPage />
    </div>
    <Footer class="footer" />
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .header {
    height: 58px !important;
  }

  .page-content {
    min-height: calc(80dvh - 58px) !important;
  }
}

.header {
  position: sticky;
  top: 0;
  height: 72px;
  background: #fff;
}

.page-content {
  min-height: calc(80dvh - 72px);
}

.footer {
  position: relative;
  bottom: 0;
}
</style>