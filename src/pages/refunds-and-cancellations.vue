<template>
  <div class="page-wrapper">
    <h1 class="page-title">Refunds & Cancellations</h1>
    <p class="page-content">
      No cancellation and refunds will be processed once an order has been shipped. In the
      unlikely scenario that your order is received as damaged or you have received the
      wrong size, we’ll be happy to replace it. We follow brand specific policy for return
      and exchange.
    </p>
  </div>
</template>

<script setup>
definePageMeta({
  name: "RefundsAndCancellation",
  layout: "public",
});

useSeoMeta({
  title: "Refunds & Cancellations | HYPD | #getHYPD",
  ogTitle: "Refunds & Cancellations | HYPD | #getHYPD",
  twitterTitle: "Refunds & Cancellations | HYPD | #getHYPD",
  twitterCard: "summary",
})
</script>

<style scoped>
  div.page-wrapper {
  padding: 16px 32px;
  max-width: 1180px;
  margin: 0 auto;
  box-sizing: border-box;
}

h1.page-title {
  font-family: Urbanist-Bold;
  font-size: 36px;
  text-align: center;
}

p.page-content {
  text-align: justify;
  font-family: Urbanist-Medium;
}
</style>