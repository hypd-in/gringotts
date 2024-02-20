<template>
  <!-- Main footer for public pages -->
  <footer class="footer">
    <!-- Footer Content -->
    <div class="content-container">
      <section class="about">
        <h2 @click="goToIndex" class="name">HYPD.</h2>
        <p class="content">Curated by creators, brought to your doorstep</p>

        <div class="socials"></div>
      </section>
      <section class="links">
        <h3 class="heading">Shopping Online</h3>
        <div class="links">
          <p @click="goToOrdersPage">Order Status</p>
          <p @click="goToRefundsAndCancellation">Refunds and Cancellations</p>
          <p @click="goToContact">Contact Us</p>
        </div>
      </section>
      <section class="info">
        <h3 class="heading">Information</h3>
        <div class="links">
          <!-- <p>About Us</p> -->
          <p @click="goToPrivacyPolicy">Privacy Policy</p>
          <p @click="goToTerms">Terms and Conditions</p>
          <p>Careers</p>
        </div>
      </section>
    </div>

    <!-- Copyright Section -->
    <section class="copyright">HYPD - © 2024. ALL RIGHTS RESERVED.</section>
  </footer>
</template>

<script setup>

function goToIndex() {
  navigateTo({
    name: "Index",
  });
}

function goToOrdersPage() {
  navigateTo({
    name: "Orders"
  })
}

function goToContact() {
  navigateTo({
    name: "ContactUs",
  });
}

function goToRefundsAndCancellation() {
  navigateTo({
    name: "RefundsAndCancellation"
  })
}

function goToPrivacyPolicy() {
  navigateTo({
    name: "PrivacyPolicy",
  });
}

function goToTerms() {
  navigateTo({
    name: "TermsAndConditions",
  });
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .content-container {
    display: block !important;
    padding: 0 16px 16px !important;
  }

  section {
    padding: 16px 0 0;
  }
}
.footer {
  width: 100%;
  color: var(--inactive-text);
  background-color: var(--secondary-background);
  box-sizing: border-box;

  font-family: Urbanist-Medium;
  font-size: 14px;
  letter-spacing: 0.2px;
  line-height: 18px;
}

.content-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  align-items: flex-start;
  justify-content: center;
  padding: 16px 32px;
  box-sizing: border-box;
  max-width: 1024px;
  margin: 0 auto;
}

.content-container section {
  display: grid;
  /* justify-content: center; */
  width: 100%;
  box-sizing: border-box;
}

h2.name {
  font-family: Ginger-Regular;
  font-size: 24px;
  margin: 0 0 12px;
  color: var(--primary-black);
  cursor: pointer;
  user-select: none;
  width: fit-content;
}

p.content {
  font-size: 12px;
}

h3.heading {
  margin: 0 0 12px;
  color: var(--primary-black);
  font-family: Urbanist-SemiBold;
  font-size: 14px;
}
div.links p {
  margin: 0 0 6px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
}

div.links p:hover {
  text-decoration: underline;
}

.copyright {
  border-top: 1px solid var(--primary-border-color);
  padding: 16px;
  text-align: center;
}
</style>