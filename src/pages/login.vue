<template>
  <div class="login-wrapper">
    <header class="header">
      <h2 @click="navigateTo({ path: '/' })" class="logo">HYPD.</h2>
    </header>

    <div class="new-login">
      <div class="login-part">
        <!--  -->
        <div class="graphics">
          <h2 class="head-text">
            shop from your favorite <br />
            creator’s store
          </h2>
          <div class="shop-text-icon">🛍️ shop from creator’s shop</div>

          <section class="line-2">
            <div class="prev-1">
              <img src="../assets/LoginView/2.png" alt="" />
              <div>
                <div class="prev-3">
                  <img src="../assets/LoginView/1.png" alt="" />
                </div>
              </div>
            </div>
            <div class="prev-2">
              <div class="circle">
                <div class="outer">
                  <img src="../assets/LoginView/Star1.svg" alt="" />
                </div>
                <div class="inner">
                  <img src="../assets/LoginView/Star2.svg" alt="" />
                </div>
                <div class="center">
                  <img src="../assets/LoginView/creator-store.svg" alt="" />
                </div>
              </div>
              <img src="../assets/LoginView/3.png" alt="" />
            </div>
          </section>
          <div class="shop-text-icon" style="margin: 24px 0 24px auto">
            ✨️ curated by creators
          </div>
        </div>

        <!-- Phone no Entry -->
        <section>
          <div class="login-section" v-if="!enterOTP">
            <h1 class="title">get started with your mobile number</h1>
            <div class="input-container mt-24">
              <span>+91</span><input type="tel" name="phone_no" placeholder="0000000000" v-model="phone_no"
                class="ph-no-input" maxlength="10" @input="updatePhoneNumber($event)" @keydown.enter="sendOTP" />
            </div>
            <SubmitButton defaultText="Send OTP" :loading="generatingOTP" class="submit-btn" :disabled="!disabledBtn"
              @submit="sendOTP" />
            <p class="tnc">
              By continuing, I agree to the <span @click="navigateTo({
                name: 'TermsAndConditions'
              })">Terms of Use</span>
              &<br />
              <span @click="navigateTo({ name: 'PrivacyPolicy' })">Privacy Policy</span>
            </p>
          </div>

          <!-- OTP -->
          <div class="login-section" v-else>
            <h1 class="title">we have send an otp to your phone no</h1>
            <div class="mt-4">
              <label class="phone_no_used">+91 {{ phone_no }}</label>
              <span class="change-btn" @click="changeNo()"> change</span>
            </div>
            <div class="otp-container mt-24" :class="{ wiggle: showError }">
              <OTP ref="otpInputs" @autoSubmit="confirmOTP" />
            </div>
            <div class="timer">00:{{ `${timer > 9 ? timer : "0" + timer}` }}</div>
            <div class="resend">
              Didn't Receive OTP?
              <span @click="resendCode" :class="{ 'disabled-resend': timer > 0 }">
                Resend Code</span>
            </div>
            <SubmitButton defaultText="Send OTP" :loading="submittingOTP" class="submit-btn" :disabled="checkOTP" />
            <p class="tnc">
              By continuing, I agree to the <span>Terms of Use</span> &<br />
              <span> Policy</span>
            </p>
          </div>
        </section>
      </div>
      <!-- Divider -->
      <hr />
      <div style="font-family: Urbanist-Medium; text-align: center">
        Featured in
      </div>
      <div class="featured-news">
        <div v-for="(news, i) in featuredIn" :key="i" class="news-items">
          <img :src="news.img" :alt="news.alt" />
        </div>
      </div>
      <!-- <video id="video-1" class="video"
        src="https://hypd-store-prod.s3.ap-south-1.amazonaws.com/assets/common/Hypd+Store++Dont+just+watch+now+shop_1080p.mp4"
        muted autoplay loop @click="toggleMute()"></video> -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  name: "Login",
  layout: "standalone",
});
import { fetchUserInfo, fetchCartInfo } from "~/utils/globalAPIs";
import OTP from "~/components/OtpInput.vue";
import SubmitButton from "~/components/SubmitButton.vue";
import Footer from "~/components/Footer.vue";
// import { returnMaxLength, returnNumber } from "~/Helpers/helperMethods";

const phone_no = ref("");
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const store = useStore();
const redirect = route.query.redirection_url;
const timer = ref(30);
const enterOTP = ref(false);
const otpInputs = ref(null);
const inputOTP = ref(null);
const submittingOTP = ref(false);
const timerInterval = ref(null);
const generatingOTP = ref(false);

const checkOTP = computed(() => {
  return otpInputs.value?.otp?.length !== 6;
});
const disabledBtn = computed(() => {
  if (phone_no.value?.toString()?.length == 10) {
    return true;
  }
  return false;
});

const sendOTP = async () => {
  generatingOTP.value = true;
  try {
    var response = await $fetch(
      `${config.public.entityURL}/api/customer/otp/generate`,
      {
        method: "POST",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          phone_no: {
            prefix: "+91",
            number: phone_no.value,
          },
        },
      }
    );
    if (response.payload) {
      console.log("Sending OTP", response.payload);
      generatingOTP.value = false;
      enterOTP.value = true;
      startTimer();
    }
  } catch (err) {
    generatingOTP.value = false;
    console.log("Error generating OTP", err);
  }
};

const confirmOTP = async (otpValue) => {
  submittingOTP.value = true;
  try {
    var response = await $fetch(
      `${config.public.entityURL}/api/customer/otp/confirm?isWeb=true`,
      {
        headers: useRequestHeaders(),
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          phone_no: {
            prefix: "+91",
            number: phone_no.value,
          },
          otp: otpInputs?.value?.otp,
        },
      }
    );
    if (response.payload) {
      submittingOTP.value = false;
      await fetchUserInfo();
      await fetchCartInfo();
      // await fetchCartInfo();
      // console.log(useCookie("creators"));
      if (redirect) {
        navigateTo({
          path: `${redirect}`,
          replace: true,
        });
      }
      // else if (getCookie("creators")) {
      //   let creator = Object.values(JSON.parse(getCookie("creators")));
      //   router.replace(`/${creator[0].username}`);
      // }
      else {
        navigateTo({ path: '/', replace: true })
      }
    }
  } catch (err) {
    showError.value = true;
    submittingOTP.value = false;
    otpInputs.value.clearOTP();
    console.log("Error verifying OTP", err);
    setTimeout(() => {
      showError.value = false;
    }, 3500);
  }
};
const showError = ref(false);
const featuredIn = ref([
  {
    alt: "YourStory",
    img: "/_nuxt/assets/media/yourstory.png",
    link: "https://yourstory.com/2021/02/funding-alert-hypd-store-raises-pre-seed-investment",
  },
  {
    alt: "Tech in Asia",
    img: "/_nuxt/assets/media/techinasia.png",
    link: "https://www.techinasia.com/indian-ecommerce-platform-hypd-bags-pre-seed-money-scoopwhoop",
  },
  {
    alt: "Entrepreneur India",
    img: "/_nuxt/assets/media/entrepreneurindia.png",
    link: "https://www.entrepreneur.com/article/365308",
  },
  {
    alt: "The Startup Lab",
    img: "/_nuxt/assets/media/startuplab.png",
    link: "https://thestartuplab.in/content-to-commerce-discovery-platform-hypd-store-raises-pre-seed-investment-from-scoopwhoop/",
  },
  {
    alt: "Next Big Brand",
    img: "/_nuxt/assets/media/nbb.png",
    link: "https://www.nextbigbrand.in/hypd-store-a-content-based-commerce-platform-raises-pre-seed-investment-from-scoopwhoop/",
  },
  {
    alt: "Bwdisrupt",
    img: "/_nuxt/assets/media/bwdisrupt.png",
    link: "http://bwdisrupt.businessworld.in/article/Hypd-Store-Raises-Pre-seed-Strategic-Investment-From-ScoopWhoop/11-02-2021-376502/",
  },
  {
    alt: "TechCircle",
    img: "/_nuxt/assets/media/techcircle.png",
    link: "https://www.techcircle.in/2021/02/12/hypd-store-payme-india-raise-funding#utm_source=twitter&utm_medium=social&utm_campaign=HYPD%20Store,%20PayMe%20India%20raise%20funding",
  },
  {
    alt: "VC Circle",
    img: "/_nuxt/assets/media/vccircle.png",
    link: "https://www.vccircle.com/hypd-store-payme-india-raise-funding#utm_source=twitter&utm_medium=social&utm_campaign=HYPD%20Store,%20PayMe%20India%20raise%20funding",
  },
]);
const updatePhoneNumber = (event) => {
  phone_no.value = returnMaxLength(event, 10);
  phone_no.value = returnNumber(event);
};

const toggleMute = () => {
  document.getElementById("video-1").muted =
    !document.getElementById("video-1").muted;
};
const changeNo = () => {
  enterOTP.value = false;
  phone_no.value = "";
  clearInterval(timerInterval.value);
  timer.value = 30;
};

const resendCode = async () => {
  if (timer.value > 0) {
    return;
  }
  if (generatingOTP.value) {
    return;
  } else {
    otpInputs.value.clearOTP();
    clearInterval(timerInterval.value);
    timer.value = 30;
    startTimer();
    await sendOTP();
  }
};
const startTimer = () => {
  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else if (timer.value == 0) {
      clearInterval(timerInterval.value);
    }
  }, 1000);
};
</script>

<style scoped>
@media only screen and (max-width: 520px) {

  .graphics,
  .login-section {
    width: 100% !important;
    min-width: calc(100% - 32px) !important;
    max-width: calc(100% - 32px) !important;
  }
}

.header {
  height: 58px;
  border-bottom: 1px solid var(--primary-border-color);
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 16px;
  box-sizing: border-box;
  background: var(--plain-white);
}

h2.logo {
  font-family: 'Ginger-Regular';
  margin: 0;
}

hr {
  height: 1px;
  border: none;
  background-color: #e9eaee;
  margin: 60px 0;
}

.new-login {
  /* background: url("../assets/img/login-bg-web.svg"); */
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}

.outer {
  position: absolute;
  z-index: 1;
  top: -4px;
  right: -4px;
  animation: rotateInv 4s linear infinite;
  animation-direction: alternate;
}

.inner {
  position: absolute;
  z-index: 2;
  right: 4px;
  top: 4px;
  animation: rotate 4s linear infinite;
  animation-direction: alternate;
}

.center {
  position: absolute;
  z-index: 3;
  width: 100%;
  top: 36px;
  left: 32px;
}

.circle {
  position: absolute;
  width: 120px;
  height: 120px;
  top: -84px;
  z-index: -1;
  right: -60px;
}

.login-part {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 32px;
  row-gap: 0;
}

.line-2 {
  display: flex;
  position: relative;
  gap: 36px;
  justify-content: center;
}

.graphics {
  padding: 16px;
  max-width: calc((100vw / 2) - 32px);
}

.graphics .head-text {
  text-transform: uppercase;
  font-family: Urbanist-SemiBold;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 1px;
  text-align: center;
}

.shop-text-icon {
  background: #fff;
  margin: 24px 0;
  border-radius: 18px;
  padding: 11px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: fit-content;
  font-family: "Urbanist-Regular";
  font-size: 12px;
}

.prev-2 {
  position: relative;
}

.prev-1>img,
.prev-2>img {
  height: 120px;
}

.prev-3 {
  position: absolute;
  bottom: -40px;
  left: -85px;
}

.prev-3 img {
  height: 104px;
}

.line-1 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 120px;
  max-width: 1180px;
  margin: 20px auto;
}

.prev-1 {
  position: relative;
}

.login-section {
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  background: #fff;
  display: flex;
  padding: 32px;
  flex-direction: column;
  align-items: center;
  max-width: calc((100vw / 2) - 32px);
  min-width: 460px;
  max-height: calc(380px);
  box-sizing: border-box;
}

.login-section h1.title {
  color: #a9a9a9;
  text-align: center;
  font-family: Urbanist-Bold;
  font-size: 21px;
  margin: 0;
}

.otp-container {
  width: 278px;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #dedede;
  font-size: 30px;
  font-family: Urbanist-Bold;
  padding: 0px 0 6px 0;
}

.input-container span {
  padding: 0 0 6px;
}

.input-container input.ph-no-input {
  border: none;
  border-radius: 0;
  outline: none;
  width: calc(100% - 200px);

  text-align: center;
  font-size: 30px;
  font-family: Urbanist-Bold;
  padding: 0px 0 6px 0;
}

.input-container:focus-within {
  border-bottom: 1px solid #868686;
}

.input-container input::placeholder {
  color: #dedede;
  font-family: Urbanist-Bold;
  font-size: 30px;
  text-align: center;
}

.phone_no_used {
  font-family: Urbanist-Light;
  font-size: 14px;
  color: #a9a9a9;
  margin: 8px 0 0 0;
}

.featured-news {
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  overflow: scroll hidden;
  width: 100%;
  max-width: 1024px;
  padding: 16px;
  margin: 0 auto;
  box-sizing: border-box;
}

.news-items {
  flex-shrink: 0;
  cursor: pointer;
}

.news-items img {
  height: 108px;
}

.change-btn {
  color: var(--dark-blue, #4791ff);
  font-family: Urbanist-Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

.timer {
  padding: 16px 0 0;
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 21px;
  line-height: 27px;
}

.resend {
  color: #585858;
  font-family: Urbanist-Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  cursor: pointer;
  user-select: none;
}

.resend span {
  color: var(--dark-blue);
  font-family: Urbanist-Bold;
  cursor: pointer;
}

span.disabled-resend {
  color: var(--primary-border-color);
}

/* animation */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(30deg);
  }
}

@keyframes rotateInv {
  from {
    transform: rotate(30deg);
  }

  to {
    transform: rotate(0deg);
  }
}

.submit-btn {
  background: var(--Logo-Gradient,
      linear-gradient(91deg, #ff12a0 23.83%, #ff5c15 86.15%));
  width: 222px;
  margin: 24px auto 0;
}

.tnc {
  color: #a9a9a9;
  text-align: center;
  font-family: Urbanist-Medium;
  font-size: 13px;
  margin: 20px auto 0;
  user-select: none;
}

.tnc span {
  color: var(--links, #4791ff);
  cursor: pointer;
}

.video {
  width: 100%;
  max-width: 1024px;
  margin: 16px auto;
  display: block;
  border-radius: 16px;
}

.wiggle {
  animation: wiggle 0.35s linear;
}

@media only screen and (min-width: 0) and (max-width: 480px) {
  .video {
    border-radius: 0;
  }

  .news-items img {
    height: 80px;
  }

  .prev-1>img,
  .prev-2>img {
    height: 110px;
  }

  .prev-3 {
    bottom: -20px;
    left: -54px;
  }

  .prev-3 img {
    height: 64px;
  }

  .line-2 {
    gap: 24px;
  }

  .circle {
    transform: scale(0.7) translate(-10px, 10px);
  }

  h1 {
    font-size: 18px;
    width: 200px;
    margin-top: 0;
  }

  .login-section {
    padding: 20px;
    margin: 16px 16px 0;
  }

  .submit-btn {
    margin: 24px auto 0;
  }

  .graphics-login {
    width: 100%;
  }

  .graphics .head-text {
    font-family: Urbanist-Bold;
    font-size: 13px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 1px;
    text-align: center;
  }

  .shop-text-icon {
    font-family: Urbanist-Regular;
    font-size: 12.5px;
    line-height: 12px;
    padding: 10px;
    text-align: center;
  }

  .line-1 {
    width: calc(100% - 20px);
    margin: 20px 10px;
  }

  .input-container input.ph-no-input {
    width: calc(100% - 100px);
  }
}
</style>