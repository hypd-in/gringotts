<template>
  <div class="page-wrapper">
    <h1 class="page-heading">Contact Us</h1>

    <div class="contact-box">
      <h2 class="heading">Have Queries?</h2>

      <p class="content">
        We love to hear from you! Tell us what's on your mind and we'll take
        care of the rest!
      </p>

      <SubmitButton defaultText="Reach Out To Us" class="button" />
    </div>

    <div class="address">
      <h2 class="heading">Official Address</h2>
      <p class="content">
        HYPD MARKETING TECHNOLOGIES PRIVATE LIMITED <br />
        2nd Floor, Innov8 Coworking Space in Delhi - Old Fort next to DLF Avenue
        Mall, Saket District Center, Sector 6, Pushp Vihar, New Delhi, Delhi -
        110017
      </p>
    </div>
  </div>
</template>

<script setup>
import SubmitButton from "~/components/SubmitButton.vue";
definePageMeta({
  name: "ContactUs",
  layout: "public",
});

useSeoMeta({
  title: "Contact Us | HYPD | #getHYPD",
  ogTitle: "Contact Us | HYPD | #getHYPD",
  twitterTitle: "Contact Us | HYPD | #getHYPD",
  twitterCard: "summary",
})
</script>

<style scoped>
div.page-wrapper {
  padding: 16px;
  max-width: 1180px;
  margin: 0 auto;
  box-sizing: border-box;
}
h1.page-heading {
  font-family: Urbanist-Bold;
  text-align: center;
}

div.contact-box {
  width: 320px;
  height: 220px;
  margin: 0 auto;
  padding: 16px;

  border-radius: 16px;
  border: 1px solid var(--primary-border-color);
  box-sizing: border-box;
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: center;
}

h2.heading {
  font-size: 21px;
  font-family: Urbanist-Bold;
  margin: 0;
}

p.content {
  font-size: 14px;
  font-family: Urbanist-Medium;
}

.button {
  width: 180px;
  margin: 0 auto;
}

div.address {
  padding: 32px 0 0;
  max-width: 360px;
}
</style>