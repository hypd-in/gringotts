<template>
  <div class="page-container">
    <a href="https://www.creator.hypd.store/login" id="CTAlink" target="_blank" hidden></a>
    <div class="header-wrapper-login">
      <div class="landing-page-header">
        <div @click="track('home_page:main_hypd_logo_click')" class="hypd-logo">HYPD.</div>
        <!-- <div class="header-login" @click="goToLogin">
          Login /<span class="wave-txt-1"> Join </span>
          <span class="wave-txt-2"> as </span>
          <span class="wave-txt-3">Member</span>
        </div> -->
        <div class="track-your-order" @click="goToOrders">
          Track your order
        </div>
      </div>
    </div>
    <div class="first-section">
      <div style="visiblity: hidden; height: 0">.</div>
      <div style="overflow: hidden">
        <div class="main-text-first-section animation-ref">
          being a creator is fun, but being a
          <span class="more-gradient-1">creatorpreneur</span> makes you rich.
        </div>
      </div>
      <div class="secondary-text-first-section">
        create your own store, curate your favorite products, turn your content
        shop-able, get paid every time someone buys something from your store,
        boom!
      </div>
      <button class="btn" @click="()=>goToLogin('home_page:join_waitlist_1_click')">Join the Waitlist</button>
    </div>
    <section class="second-section-container">
      <div class="second-section">
        <img class="base-img"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/500x500/img/599eillustration-hft1.png"
          alt="" />
        <img class="props-mobile-screen"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/350x350/img/1cf1mobile.png"
          alt="" />
        <img class="model-img prop-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/350x400/img/7ed1model.a5c04323.png"
          alt="" />
        <img class="prop-money prop-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/ebaamoneystack.png"
          alt="" />
        <img class="prop-heart prop-ref" src="https://dmk9je7eclmvw.cloudfront.net/assets/img/1d52heart.png" alt="" />
        <img class="prop-gift prop-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/3249gift.png" alt="" />
        <img class="prop-play-button prop-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/5a72play-button.png"
          alt="" />
        <img class="props-blocks prop-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/6ccfcollab.png"
          alt="" />
        <img class="props-hashtag prop-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/64adhashtag.png"
          alt="" />
        <img class="props-pebble screen-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/9641pebble-screen.png"
          alt="" />
        <img class="props-product-1 screen-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/150x150/img/c978product-1.png"
          alt="" />
        <img class="props-product-2 screen-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/150x150/img/1beeproduct-2.png"
          alt="" />
        <img class="props-collection screen-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/150x150/img/3894collection.png"
          alt="" />
        <img class="props-withdraw screen-ref"
          src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/4dd2withdraw.png"
          alt="" />
        <div class="orbital-container">
          <div class="orbital-path path-1">
            <div class="celestial-1">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/150x150/img/5d92like.png"
                alt="" />
            </div>
          </div>
        </div>
        <div class="orbital-container">
          <div class="orbital-path path-2">
            <div class="celestial-2">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/6e70ig.png" alt="" />
            </div>
          </div>
        </div>
        <div class="orbital-container">
          <div class="orbital-path path-3">
            <div class="celestial-3">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/8098emoji-money.png" alt="" />
            </div>
          </div>
        </div>
        <div class="orbital-container">
          <div class="orbital-path path-4">
            <div class="celestial-4">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/a84btwitter.png" alt="" />
            </div>
          </div>
        </div>
        <div class="orbital-container">
          <div class="orbital-path path-5">
            <div class="celestial-5">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/b8f5notification-heart.png" alt="" />
            </div>
          </div>
        </div>
        <div class="orbital-container">
          <div class="orbital-path path-6">
            <div class="celestial-6">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/c6d8yt.png" alt="" />
            </div>
          </div>
        </div>
        <div class="orbital-container">
          <div class="orbital-path path-7">
            <div class="celestial-7">
              <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/d46cfb.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="third-section">
      <div style="overflow: hidden">
        <div class="third-section-title animation-ref">
          how rich is <span class="result-gradient">rich?</span>
        </div>
      </div>
      <div class="third-section-subtitle">
        let’s do a quick calculation based on your follower count & content
        sharing, quick maths!
      </div>
      <div class="slider-container slider-container-ref">
        <div class="slider-wrapper">
          <span class="slider-title">choose your # of followers </span>
          <span> (facebook, instagram, youtube etc.) </span>
          <div class="slider-container">
            <div class="slider-value initial-value">500</div>
            <input class="range-slider" id="follower-slider" type="range" min="500" max="1000000"
              @input="updateSliderOne(followerCount)" v-model="followerCount" />
            <div class="track">
              <div class="track-inner slider-transition" ref="trackInnerOne" id="track-inner-1"></div>
            </div>
            <div class="thumb slider-transition" ref="thumbOne" id="thumb-1"></div>
            <div class="current-value slider-transition" ref="currentValueOne" id="current-value-1">
              {{ formatNumber(followerCount) }}
            </div>
            <div class="slider-value final-value">1M</div>
          </div>
        </div>
        <div class="slider-wrapper slider-wrapper-2">
          <span class="slider-title">choose your monthly posts </span>
          <span> (how often do you make content/month?) </span>

          <div class="slider-container">
            <div class="slider-value initial-value" style="left: -8%">10</div>
            <input class="range-slider" ref="subscriptionSlider" id="subscription-slider" type="range" min="10" max="100"
              @input="updateSliderTwo(monthlyPosts)" v-model="monthlyPosts" />
            <div class="track">
              <div class="track-inner slider-transition" ref="trackInnerTwo" id="track-inner-2"></div>
            </div>
            <div class="thumb slider-transition" ref="thumbTwo" id="thumb-2"></div>
            <div class="current-value slider-transition" ref="currentValueTwo" id="current-value-2">
              {{ formatNumber(monthlyPosts) }}
            </div>
            <div class="slider-value final-value">100</div>
          </div>
        </div>
      </div>
      <div class="third-section-secondary-title">
        you could earn between
        <span class="result-gradient">₹{{ minResult }}</span> and
        <span class="result-gradient">₹{{ maxResult }} more!*</span>
      </div>
      <div class="third-section-secondary-subtitle">
        based on an estimate of between 1% and 5% of your followers buying
        directly from your store
      </div>

      <div style="
          display: flex;
          gap: 24px;
          justify-content: center;
          margin: 36px 0 0 0;
          flex-wrap: wrap;
          padding: 0 0 16px 0;
        ">
        <div class="link" @click="track('home_page:username_input_click')">
          <span> hypd.store/ </span>
          <span class="link-second-part" > your_name </span>
        </div>
        <button class="btn-2" @click="()=>goToLogin('home_page:join_waitlist_2_click')">Join the Waitlist</button>
      </div>
    </section>
    <section class="forth-section">
      <div class="prop-1">
        <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/1ec1prop-1.png" alt="" />
      </div>
      <div style="overflow: hidden">
        <div class="forth-section-title animation-ref">
          but that’s not all. there’s so much
          <span class="more-gradient">more</span> you get.
        </div>
      </div>
      <div class="forth-section-grid">
        <div class="illstrations ills-1">
          <div class="illstrations-img" style="background: #e7e197">
            <img class="three-d-img" style="margin: -22px 0px 0px -9px"
              src="https://dmk9je7eclmvw.cloudfront.net/assets/img/3e38landing_page_ills_1.png" alt="" />
          </div>
          <div class="illstrations-title">
            <span class="more-gradient">more</span> paid brand collabs
          </div>
        </div>
        <div class="illstrations ills-2">
          <div class="illstrations-img" style="background: #5e72ae">
            <img class="three-d-img" style="margin: -26px 0 0px -14px"
              src="https://dmk9je7eclmvw.cloudfront.net/assets/img/5a31landing_page_ills_2.png" alt="" />
          </div>
          <div class="illstrations-title">
            <span class="more-gradient">more</span>
            celebrity collabs
          </div>
        </div>
        <div class="illstrations ills-3">
          <div class="illstrations-img" style="background: #afe4fd">
            <img class="three-d-img" style="margin: -26px 0 0 -62px"
              src="https://dmk9je7eclmvw.cloudfront.net/assets/img/6b10landing_page_ills_3.png" alt="" />
          </div>
          <div class="illstrations-title">
            refer friends for <span class="more-gradient">more</span> returns
          </div>
        </div>
        <div class="illstrations ills-4">
          <div class="illstrations-img" style="background: #f4bea5">
            <img class="three-d-img" style="margin: -10px 0 0 -11px"
              src="https://dmk9je7eclmvw.cloudfront.net/assets/img/6e73landing_page_ills_4.png" alt="" />
          </div>
          <div class="illstrations-title">
            launch your own brand & <span class="more-gradient">more</span>
          </div>
        </div>
      </div>
    </section>
    <div class="third-section-title animation-ref" style="background: #000000">
      as easy as setting up an instagram account. only
      <span class="more-gradient">more</span> rewarding
    </div>
    <section class="fifth-section-desktop">
      <div class="info-section-wrapper">
        <div v-for="(item, i) in mobileData" :key="i" class="mobile-info-container" :imgsrc="item.image">
          <div class="mobile-info" :ref="`mobileInfo${i}`" :id="'mobile-info-' + i">
            <div class="index" :style="'background:' + item.color">
              {{ item.index }}
            </div>
            <div class="mobile-info-name">{{ item.name }}</div>
            <div class="mobile-info-description">{{ item.description }}</div>
          </div>
        </div>
      </div>
      <div class="mock-screen">
        <div class="mobile">
          <div class="mobile-background">
            <transition :name="sliderName">
              <img :key="0" v-show="activeImgSrc == 0"
                src="https://dmk9je7eclmvw.cloudfront.net/assets/img/a0bacreate.png" alt="" class="mock-screen-img"
                id="mock-screen-img" />
            </transition>

            <transition :name="sliderName">
              <img :key="1" v-show="activeImgSrc == 1"
                src="https://dmk9je7eclmvw.cloudfront.net/assets/img/b1e2curate.png" alt="" class="mock-screen-img"
                id="mock-screen-img" />
            </transition>

            <transition :name="sliderName">
              <img :key="2" v-show="activeImgSrc == 2"
                src="https://dmk9je7eclmvw.cloudfront.net/assets/img/d40asharing.png" alt="" class="mock-screen-img"
                id="mock-screen-img" />
            </transition>

            <transition :name="sliderName">
              <img :key="3" v-show="activeImgSrc == 3" src="https://dmk9je7eclmvw.cloudfront.net/assets/img/e2c5earn.png"
                alt="" class="mock-screen-img" id="mock-screen-img" />
            </transition>
          </div>
        </div>
      </div>
    </section>

    <section class="fifth-section-mobile">
      <div v-for="(item, i) in 4" :key="i" class="mt-80">
        <div class="mobile-info-mobile" id="mobile-info-mobile-0">
          <div class="index" :style="'background:' + mobileData[i]?.color">
            {{ mobileData[i]?.index }}
          </div>
          <div class="mobile-info-name">{{ mobileData[i]?.name }}</div>
          <div class="mobile-info-description">
            {{ mobileData[i]?.description }}
          </div>
        </div>
        <transition :name="sliderName">
          <div class="mock-mobile-device">
            <img v-if="mobileData[i]" :src="getReplacedSource(mobileData[i]?.src)" alt="" class="mock-screen-img"
              id="mock-screen-img" />
          </div>
        </transition>
      </div>
    </section>

    <section class="sixth-section"></section>
    <section class="seventh-section">
      <div style="overflow: hidden">
        <div class="seventh-section-title animation-ref">
          creators & entrepreneurs as investors who think this is a smashing
          idea.
        </div>
      </div>
      <div class="creator-collage" :style="'transform:Scale(' +
        scaleBubble +
        ') translateY(' +
        translateBubble +
        'px)'
        ">
        <div class="c-1">
          <img src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/150x150/img/1625mythpat.png"
            alt="" />
        </div>
        <div class="c-2">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/224dtanmay-bhatt.png"
            alt="" />
        </div>
        <div class="c-3">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/351ebhuvam-bam.png"
            alt="" />
        </div>
        <div class="c-4">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/4195beer-biceps.png"
            alt="" />
        </div>
        <div class="c-5">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/5125dhvani-bhanushali.png"
            alt="" />
        </div>
        <div class="c-6">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/69d2suhani-shah.png"
            alt="" />
        </div>
        <div class="c-7">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/7f5bsamay-raina.png"
            alt="" />
        </div>
        <div class="c-8">
          <img
            src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/150x150/img/8963slayy-point.png"
            alt="" />
        </div>
        <div class="c-10">& more</div>

        <div class="c-9">
          <img src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/200x200/img/9a0apapa-cj.png"
            alt="" />
        </div>
      </div>
      <div class="creators-count-container">
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="grid-matrix-div"></div>
        <div class="text-content">
          <img src="https://dmk9je7eclmvw.cloudfront.net/assets/filters:strip_exif()/fit-in/250x250/img/b3cctimer.png"
            alt="" />
          <div class="creator-count">{{ creatorCount }}</div>
          <div class="secondary-text secondary-text-font-mobile">
            creators are on the road to become
            <span class=""> creatorpreneurs</span>
          </div>

          <div class="secondary-text secondary-text-bottom">
            don't just be a creator, be a
            <span class="more-gradient-1">creatorpreneur</span>
          </div>
        </div>
        <div class="decor-1">
          <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/c350decor.png" alt="" />
        </div>
        <div class="decor-2">
          <img src="https://dmk9je7eclmvw.cloudfront.net/assets/img/cb8cdecor-2.png" alt="" />
        </div>
      </div>
      <div class="bottom-dock">
        <button class="btn-2" @click="()=>goToLogin('home_page:join_waitlist_3_click')">Join the Waitlist</button>
      </div>
    </section>
    <section class="footer-section">
      <div class="footer-section-title">
        got questions? we’re happy to answer every single one of them.
      </div>
      <div class="footer-content">
        <div class="footer-items">
          <div class="footer-item-title">email</div>
          <div class="footer-item-content" style="color: #3689fb" @click="track('home_page:btm_creator_email_click')">
            <a href="mailto:creators@hypd.in">creators@hypd.in</a>
          </div>
        </div>
        <!-- <div class="footer-items onboard-hypd-btn">
          <div class="footer-item-title">are you a brand?</div>
          <div
            class="footer-item-content"
            style="color: #3689fb; text-align: center"
          >
            <button
              class="btn-2"
              @click="openBrandForm"
              style="background: linear-gradient(114deg, #9796f0, #fbc7d4)"
            >
              Join HYPD.
            </button>
          </div>
        </div> -->
        <div class="footer-items">
          <div class="footer-item-title">website</div>
          <div class="footer-item-content" style="color: #3689fb" @click="track('home_page:btm_website_click')">
            <a href="https://www.hypd.store">https://www.hypd.store/</a>
          </div>
        </div>
      </div>
      <div class="social-bar">
        <a href="https://www.facebook.com/hypdstore/" target="_blank">
          <img src="../assets/icons/landingPage/04-facebook.svg" alt="" />
        </a>
        <a href="https://twitter.com/get_hypd" target="_blank">
          <img src="../assets/icons/landingPage/03-twitter.svg" alt="" />
        </a>
        <a href="https://www.linkedin.com/company/hypdin/" target="_blank">
          <img src="../assets/icons/landingPage/02-linkedin.svg" alt="" />
        </a>
        <a href="https://www.instagram.com/gethypd/" target="_blank">
          <img src="../assets/icons/landingPage/01-instagram.svg" alt="" />
        </a>
        <a href="https://www.youtube.com/channel/UCNLrrzAIuAKk8MPuBF7H4jQ" target="_blank">
          <img src="../assets/icons/landingPage/05-youtube.svg" alt="" />
        </a>
      </div>
      <div style="
          font-family: Urbanist-Light;
          color: #adb4c7;
          margin: 0 auto;
          text-align: center;
          font-size: 14px;
          padding: 0 0 16px 0;
        ">
        HYPD - © 2023. All Rights Reserved.
      </div>
    </section>
    <a href="https://www.creator.hypd.store/login" id="CTAlink" target="_blank" hidden></a>
  </div>
</template>

<script setup>

import track from "../utils/tracking-posthog"

definePageMeta({
  name: "Index",
  layout: "standalone"
})

const route = useRoute();
const router = useRouter();
const mobileData = ref([
  {
    index: "01",
    color: "#9756D7",
    name: "create 🛒🛒",
    description: "sign up & create your own store in under 30 seconds",
    src: "https://dmk9je7eclmvw.cloudfront.net/assets/img/a0bacreate.png",
  },
  {
    index: "02",
    color: "#3672FB",
    name: "curate 👗👔👟",
    description:
      "curate collections, add your favorite products or simply make your content shop-able",
    src: "https://dmk9je7eclmvw.cloudfront.net/assets/img/b1e2curate.png",
  },
  {
    index: "03",
    color: "#44B16C",
    name: "share 🔗",
    description:
      "share your store link, collections & your product recommendations across all your social media channels.",
    src: "https://dmk9je7eclmvw.cloudfront.net/assets/img/d40asharing.png",
  },
  {
    index: "04",
    color: "#EF466F",
    name: "ka-ching! 🤑🤑",
    description:
      "earn real money every time someone buys anything from your store",
    src: "https://dmk9je7eclmvw.cloudfront.net/assets/img/e2c5earn.png",
  },
]);
const creatorCount = ref(null);
const sliderName = ref("slider-right");
const activeImgSrc = ref(0);
const followerCount = ref(500250);
const monthlyPosts = ref(30);
const scrollPosition = ref(0);
const animationObserver = ref(null);
const intersectionPosition = ref(0);

const thumbOne = ref(null);
const trackInnerOne = ref(null)
const currentValueOne = ref(null);

const thumbTwo = ref(null);
const trackInnerTwo = ref(null);
const currentValueTwo = ref(null);

const minResult = computed(() => {
  return formatIndian(
    followerCount.value * monthlyPosts.value * 0.1
  )
});

const maxResult = computed(() => {
  return formatIndian(
    followerCount.value * monthlyPosts.value * 0.2
  )
});

const scaleBubble = computed(() => {
  if (animationObserver.value) {
    if (
      1 - (scrollPosition.value - intersectionPosition.value) / 1000 >
      0.45
    ) {
      return 1 - (scrollPosition.value - intersectionPosition.value) / 1000;
    } else {
      return 0.45;
    }
  } else {
    return 1;
  }
})

const translateBubble = computed(() => {
  if (animationObserver.value) {
    if (
      scrollPosition.value > intersectionPosition.value &&
      1 - (scrollPosition.value - intersectionPosition.value) / 1000 < 0.96
    ) {
      return scrollPosition.value - (intersectionPosition.value - 50);
    } else {
      return 0;
    }
  } else {
    return 0;
  }
})


function goToOrders() {
  track('home_page:track_order_click')
  navigateTo({
    name: "Orders"
  })
}

function formatIndian(number) {
  let formatter = Intl.NumberFormat("en-IN", { useGrouping: true, notation: "compact" });
  return formatter.format(number);
}

function formatNumber(number) {
  let formatter = Intl.NumberFormat("en-US", { notation: "compact", useGrouping: true });
  return formatter.format(number);
}

function calculatingCreatorCount() {
  let a = new Date("05/10/2022");
  let b = new Date();
  creatorCount.value = 2434 + Math.floor(Math.abs(b - a) / 1000 / 312);
  creatorCount.value = new Intl.NumberFormat("en-IN").format(creatorCount.value)
}

function updateSliderOne(value) {
  const altValue = Math.ceil(((value - 500) / 999500) * 100);
  thumbOne.value.style.left = `${altValue}%`;
  thumbOne.value.style.transform = `translate(-${altValue}%, -50%)`;
  currentValueOne.value.style.left = `${altValue}%`;
  currentValueOne.value.style.transform = `translate(-${altValue}%, 50%)`;
  trackInnerOne.value.style.width = `${altValue}%`;
};

function updateSliderTwo(value) {
  const altValue = Math.ceil(((value - 10) / 90) * 100);
  thumbTwo.value.style.left = `${altValue}%`;
  thumbTwo.value.style.transform = `translate(-${altValue}%, -50%)`;
  currentValueTwo.value.style.left = `${altValue}%`;
  currentValueTwo.value.style.transform = `translate(-${altValue}%, 50%)`;
  trackInnerTwo.value.style.width = `${altValue}%`;
};

function increasingSlider() {
  updateSliderOne(followerCount.value);
  updateSliderTwo(monthlyPosts.value);
};

function updateScrollPosition() {
  scrollPosition.value = window.scrollY;
}

function addingObserver() {
  let options = {
    rootMargin: "0px",
    root: null,
    threshold: 0.6,
  };
  const observer = new IntersectionObserver(callback, options);
  let targets = document.querySelectorAll(".mobile-info");
  targets.forEach((ele) => {
    observer.observe(ele);
  });

  const observer_2 = new IntersectionObserver(callback_2, {
    rootMargin: "10px 0px",
    threshold: 0.75,
  });
  const observer_3 = new IntersectionObserver(callback_3, {
    rootMargin: "10px 0px",
    threshold: 0.8,
  });
  const observer_4 = new IntersectionObserver(callback_4, {
    rootMargin: "20px 0px 0px",
    threshold: 0.8,
  });
  const observer_5 = new IntersectionObserver(callback_5, {
    rootMargin: "20px 0px 0px",
    threshold: 0.8,
  });

  // Adding observer for responsive animation.
  const observer_6 = new IntersectionObserver(callback_6, {
    rootMargin: "0px",
    threshold: 0.25,
  });
  const observer_7 = new IntersectionObserver(callback_7, {
    rootMargin: "20px 0px 0px",
    threshold: 1,
  });
  const observer_8 = new IntersectionObserver(callback_8, {
    rootMargin: "20px 0px 0px",
    threshold: 0.6,
  });

  let targets_2 = document.querySelectorAll(".animation-ref");
  let targets_3 = document.querySelectorAll(".three-d-img");
  let targets_4 = document.querySelectorAll(".prop-ref");
  let targets_5 = document.querySelectorAll(".screen-ref");

  //Creators Count Target for animation
  let targets_6 = document.querySelector(".creators-count-container");
  let targets_7 = document.querySelectorAll(".slider-container-ref");
  let targets_8 = document.querySelector(".model-img");

  targets_2.forEach((ele) => {
    observer_2.observe(ele);
  });
  targets_3.forEach((ele) => {
    observer_3.observe(ele);
  });
  targets_4.forEach((ele) => {
    observer_4.observe(ele);
  });
  targets_5.forEach((ele) => {
    observer_5.observe(ele);
  });

  //Creators Count Observer for animation
  observer_6.observe(targets_6);
  targets_7.forEach((ele) => {
    observer_7.observe(ele);
  });
  observer_8.observe(targets_8);
}

function callback(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.id == "mobile-info-0") {
        if (activeImgSrc.value > 0) {
          sliderName.value = "slider-right";
        } else {
          sliderName.value = "slider-left";
        }
        activeImgSrc.value = 0;
        entry.target.classList.add("title-animation");
      }
      if (entry.target.id == "mobile-info-1") {
        if (activeImgSrc.value > 1) {
          sliderName.value = "slider-right";
        } else {
          sliderName.value = "slider-left";
        }
        activeImgSrc.value = 1;
        entry.target.classList.add("title-animation");
      }
      if (entry.target.id == "mobile-info-2") {
        if (activeImgSrc.value > 2) {
          sliderName.value = "slider-right";
        } else {
          sliderName.value = "slider-left";
        }
        activeImgSrc.value = 2;
        entry.target.classList.add("title-animation");
      }
      if (entry.target.id == "mobile-info-3") {
        if (activeImgSrc.value > 3) {
          sliderName.value = "slider-right";
        } else {
          sliderName.value = "slider-left";
        }
        activeImgSrc.value = 3;
        entry.target.classList.add("title-animation");
      }
    } else {
      entry.target.classList.remove("title-animation");
    }
  });
};

function callback_2(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("title-animation");
    } else {
      // entry.target.classList.remove("title-animation");
    }
  });
}

function callback_3(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animating-three-d-img");
    } else {
      // setTimeout(() => {
      //   entry.target.classList.remove("animating-three-d-img");
      // }, 2000);
    }
  });
}

function callback_4(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("drop-effect");
    } else if (!entry.isIntersecting) {
      // setTimeout(() => {
      //   entry.target.classList.remove("drop-effect");
      // }, 2000);
    }
  });
}

function callback_5(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("zoom-in-effect");
    } else {
      // setTimeout(() => {
      //   entry.target.classList.remove("zoom-in-effect");
      // }, 2000);
    }
  });
}

//callback for responsive animation
function callback_6(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // setting observer to translate conditionally.
      animationObserver.value = entry;
      // setting intersection point to calculate the value of translate
      if (entry.boundingClientRect.top > 0) {
        intersectionPosition.value = scrollPosition.value;
      }
    } else {
      // removing the observer
      animationObserver.value = null;
      // intersectionPosition.value = 0;
    }
  });
}

function callback_7(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      increasingSlider();
      entry.target.classList.add("slider-ref");
      setTimeout(() => {
        entry.target.classList.remove("slider-ref");
      }, 1000);
    } else {
      // setTimeout(() => {
      //   entry.target.classList.remove("slider-ref");
      // }, 2000);
    }
  });
}

function callback_8(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("zoom-in-effect-model");
    } else {
      // setTimeout(() => {
      //   entry.target.classList.remove("zoom-in-effect");
      // }, 2000);
    }
  });
}

function goToLogin(event) {
  // trackingClickEvent("clicked_on_join_the_waitlist");
  track(event)
  document.getElementById("CTAlink").click();
};

onMounted(() => {
  calculatingCreatorCount();
  updateSliderOne(0);
  updateSliderTwo(10);
  document.addEventListener("scroll", updateScrollPosition)
  addingObserver();

  // track posthog
  track('home_page:visit')
})

onUpdated(() => {
  updateSliderOne();
})
</script>

<style scoped>
/* funding news css */
.emoji-text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.read-more {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.arrow {
  display: flex;
}

.emoji {
  display: flex;
}

.read {
  font-family: "Urbanist-Medium";
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  border-bottom: 1px dashed var(--plain-white);
}

.funding-news {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 22;
  height: 57px;
  display: grid;
  grid-template-columns: 32px calc(100% - 12px - 120px - 32px) 120px;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  padding: 0px 16px;
  background: linear-gradient(89.91deg,
      #872f80 0%,
      #d95655 52.08%,
      #ed4a4a 100%);
}

.text {
  font-family: "Urbanist-Medium";
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  overflow: hidden;
}

/* funding news */
.track-your-order {
  color: #fff;
  border-bottom: 1px solid #fff;
  cursor: pointer;
}

/* @import "../assets/style/landing-page.css"; */

/* .range-slider {
    width: 100%;
    background: linear-gradient(to right, #82cfd0 0%, #82cfd0 50%, #fff 50%, #fff 100%);
    border-radius: 8px;
    height: 30px;
    outline: none;
    transition: background 450ms ease-in;
    -webkit-appearance: none;
  }

  .range-slider::-webkit-slider-runnable-track {
    background: #171e31;
  } */

.slider-wrapper {
  position: relative;
  /* overflow: hidden; */
}

.slider-container {
  position: relative;
  max-width: 780px;
  max-width: calc(100vw - 100px);
}

/* .wrap {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  } */

.hypd-logo {
  color: #fff;
}

.range-slider {
  width: 100%;
  cursor: pointer;
  opacity: 0;
}

.range::-ms-tooltip {
  display: none;
}

.track {
  width: 100%;
  height: 30px;
  background: #dddddd;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  border-radius: 8px;
  overflow: hidden;
}

.track-inner {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #ff5858 0%, #ffc8c8 100%) 0% 0% no-repeat padding-box;
}

#track-inner-2 {
  background: linear-gradient(90deg, #654ea3, #eaafc8) 0% 0% no-repeat padding-box;
}

.thumb {
  width: 16px;
  height: 46px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0%, -50%);
  pointer-events: none;
  width: 15px;
  border-radius: 28px;
}

.current-value {
  position: absolute;
  color: #fff;
  font-family: Edmondsans-Bold;
  font-size: 18px;
  top: 100%;
}

.slider-ref .slider-transition {
  transition: all 0.7s linear;
}

.slider-value {
  color: #adb4c7;
  font-family: Edmondsans-Bold;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.initial-value {
  left: -13%;
}

.final-value {
  left: 102%;
}

/* Landing Page CSS */
:root {
  --btn-p: #2181fb;
}

.page-container {
  background: #000000;
  /* height: calc(100vh - 92px); */
  /* overflow-x:hidden ; */
}

.header-wrapper-login {
  position: fixed;
  top: 10px;
  width: 100vw;
  z-index: 13;
  backdrop-filter: blur(4px);
  background: #00000030;
}

.landing-page-header {
  padding: 20px 40px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hypd-logo {
  font-size: 29px;
  font-family: Urbanist-ExtraBold;
}

.header-login {
  color: #ffff;
  font-family: Urbanist-Bold;
  padding: 16px 14px 14px;
  border-radius: 12px;
  border: 1px solid #8e97ad;
  cursor: pointer;
  background: #0000008f;
}

.header-login:hover {
  box-shadow: 0px 0px 7px 0 #ffffff, inset 0px 0px 2px 0 #ffffff;
}

.first-section {
  height: calc(100vh);
  background-image: url("https://dmk9je7eclmvw.cloudfront.net/assets/img/21a7rainbow.png"),
    url("https://dmk9je7eclmvw.cloudfront.net/assets/img/42f2floating_ball.png");
  background-position: center 92px, right 92px;
  background-repeat: no-repeat, no-repeat;
}

.main-text-first-section {
  position: relative;
  margin: 25vh 0 0 10vw;
  font-family: Urbanist-ExtraBold;
  font-size: 68px;
  text-align: left;
  color: #ffffff;
  max-width: 900px;
  line-height: 80px;
}

.main-text-first-section span {
  background-image: var(--landing-page-primary-gradiant);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.second-section {
  position: relative;
}

.base-img {
  width: calc(80vw);
  margin: 0 auto;
  z-index: 0;
  top: 50%;
  left: 50%;
  position: relative;
  transform: translate(calc(-50%), calc(0%));
}

.model-img {
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  transform: translate(calc(-50% + -1.3vw), calc(-50% + -13%));
  height: calc(84%);
  z-index: 2;
}

.prop-money {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% - 12vw), 134%);
  height: 23%;
  aspect-ratio: 5 / 3;
  z-index: 2;
}

.prop-heart {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% - 15vw), 320%);
  height: 11%;
  aspect-ratio: 4 / 3;
  z-index: 2;
}

.prop-gift {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% - 5vw), 188%);
  height: 22%;
  z-index: 2;
}

.prop-play-button {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% + 22vw), 176%);
  height: 20%;
  z-index: 3;
}

.props-mobile-screen {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% + 9.5vw), 36%);
  height: 70%;
  z-index: 1;
}

.props-blocks {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% + 28vw), 114%);
  height: 25%;
  z-index: 2;
}

.props-hashtag {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(calc(-100% + 34vw), 159%);
  height: 20%;
  z-index: 2;
}

.props-pebble {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-100% + 14.5vw), -101%);
  height: 25%;
  z-index: 3;
}

.props-product-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-100% + 21vw), -86%);
  height: 14%;
  z-index: 1;
}

.props-product-2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-100% + 21vw), -190%);
  height: 14%;
  z-index: 1;
}

.props-collection {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-100% - 5vw), -139%);
  height: 23%;
  z-index: 1;
}

.props-withdraw {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-100% - 8vw), -18%);
  height: 22%;
  z-index: 1;
}

.orbital-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -39%);
  width: 59%;
  aspect-ratio: 1 / 1;
}

.orbital-path {
  height: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 100%;
  z-index: 0;
}

.path-1 {
  animation: spin-right-1 20s linear infinite;
}

@keyframes spin-right-1 {
  100% {
    transform: rotate(190deg);
  }
}

.path-1 img {
  height: 40px;
  animation: rotate-left-1 20s linear infinite;
}

@keyframes rotate-left-1 {
  100% {
    transform: rotate(-190deg);
  }
}

/* 2nd item reveloution */
.path-2 {
  animation: spin-right-2 20s linear infinite;
}

@keyframes spin-right-2 {
  80% {
    transform: rotate(170deg);
    visibility: hidden;
  }

  81% {
    transform: rotate(335deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(360deg);
  }
}

.path-2 img {
  height: 40px;
  animation: rotate-left-2 20s linear infinite;
}

@keyframes rotate-left-2 {
  80% {
    transform: rotate(-150deg);
  }

  81% {
    transform: rotate(-335deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(-360deg);
  }
}

/* 3nd item reveloution */
.path-3 {
  animation: spin-right-3 20s linear infinite;
}

@keyframes spin-right-3 {
  60% {
    transform: rotate(150deg);
    visibility: hidden;
  }

  61% {
    transform: rotate(310deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(360deg);
  }
}

.path-3 img {
  height: 40px;
  animation: rotate-left-3 20s linear infinite;
}

@keyframes rotate-left-3 {
  60% {
    transform: rotate(-150deg);
  }

  61% {
    transform: rotate(-310deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(-360deg);
  }
}

/* 4nd item reveloution */
.path-4 {
  animation: spin-right-4 20s linear infinite;
}

@keyframes spin-right-4 {
  50% {
    transform: rotate(120deg);
    visibility: hidden;
  }

  51% {
    transform: rotate(290deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(360deg);
  }
}

.path-4 img {
  height: 40px;
  animation: rotate-left-4 20s linear infinite;
}

@keyframes rotate-left-4 {
  50% {
    transform: rotate(-130deg);
  }

  51% {
    transform: rotate(-290deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(-360deg);
  }
}

/* 5nd item reveloution */
.path-5 {
  animation: spin-right-5 20s linear infinite;
}

@keyframes spin-right-5 {
  30% {
    transform: rotate(70deg);
    visibility: hidden;
  }

  31% {
    transform: rotate(240deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(360deg);
  }
}

.path-5 img {
  height: 40px;
  animation: rotate-left-5 20s linear infinite;
}

@keyframes rotate-left-5 {
  30% {
    transform: rotate(-40deg);
  }

  31% {
    transform: rotate(-280deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(-360deg);
  }
}

/* 6nd item reveloution */

.path-6 {
  animation: spin-right-6 20s linear infinite;
}

@keyframes spin-right-6 {
  25% {
    transform: rotate(45deg);
    visibility: hidden;
  }

  26% {
    transform: rotate(220deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(360deg);
  }
}

.path-6 img {
  height: 40px;
  animation: rotate-left-6 20s linear infinite;
}

@keyframes rotate-left-6 {
  25% {
    transform: rotate(-60deg);
  }

  26% {
    transform: rotate(-280deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(-360deg);
  }
}

/* 6nd item reveloution */

.path-7 {
  animation: spin-right-7 20s linear infinite;
}

@keyframes spin-right-7 {
  10% {
    transform: rotate(20deg);
    visibility: hidden;
  }

  11% {
    transform: rotate(190deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(360deg);
  }
}

.path-7 img {
  height: 40px;
  animation: rotate-left-7 20s linear infinite;
}

@keyframes rotate-left-7 {
  10% {
    transform: rotate(-20deg);
  }

  11% {
    transform: rotate(-190deg);
    visibility: hidden;
  }

  100% {
    transform: rotate(-360deg);
  }
}

.celestial-1 {
  position: absolute;
  top: 27vw;
  left: -3.5vw;
  border-radius: 100%;
}

.celestial-2 {
  position: absolute;
  top: 16vw;
  left: 0vw;
  border-radius: 100%;
}

.celestial-3 {
  position: absolute;
  top: 8vw;
  left: 6vw;
  border-radius: 100%;
}

.celestial-4 {
  position: absolute;
  top: 1vw;
  left: 16vw;
  border-radius: 100%;
}

.celestial-5 {
  position: absolute;
  top: -1vw;
  left: 35vw;
  border-radius: 100%;
}

.celestial-6 {
  position: absolute;
  top: 8vw;
  left: 50vw;
  border-radius: 100%;
}

.celestial-7 {
  position: absolute;
  top: 20vw;
  left: 56vw;
  border-radius: 100%;
}

.prop-ref {
  bottom: 60%;
}

.drop-effect {
  animation: drop 0.8s ease-in-out;
}

.screen-ref {
  opacity: 0;
}

@keyframes drop {
  0% {
    bottom: 60%;
    opacity: 1;
  }

  50% {
    bottom: 50%;
  }

  70% {
    bottom: 51%;
  }

  100% {
    bottom: 50%;
  }
}

.zoom-in-effect {
  animation: fade-in 1s linear;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.zoom-in-effect-model {
  animation: zoom-in 0.3s ease-in;
}

@keyframes zoom-in {
  0% {
    opacity: 0.8;
    transform: translate(calc(-50% + -1.3vw), calc(-50% + -13%)) scale(0.8);
  }

  100% {
    opacity: 1;
    transform: translate(calc(-50% + -1.3vw), calc(-50% + -13%)) scale(1);
  }
}

.model-img.zoom-in-effect-model {
  opacity: 1;
}

.prop-ref.drop-effect {
  bottom: 50%;
}

.screen-ref.zoom-in-effect {
  opacity: 1;
}

.secondary-text-first-section {
  margin: 30px 0 0 10vw;
  position: relative;
  color: #adb4c7;
  text-align: left;
  max-width: 900px;
  line-height: 36px;
  font-size: 24px;
  font-family: Urbanist-Medium;
}

.btn {
  margin: 34px 0 0 10vw;
  position: relative;
  width: 190px;
  height: 50px;
  border-radius: 12px;
  background: var(--btn-p);
  background-image: var(--landing-page-primary-gradiant);
  outline: none;
  font-size: 18px;
  border: none;
  color: #ffffff;
  font-family: Urbanist-Bold;
  cursor: pointer;
}

.btn-2 {
  width: 190px;
  height: 60px;
  border-radius: 12px;
  background-image: var(--landing-page-primary-gradiant);
  outline: none;
  border: none;
  color: #ffffff;
  font-size: 18px;
  font-family: Urbanist-Bold;
  cursor: pointer;
}

.third-section {
  background: #000000;
}

.third-section-title {
  font-size: 42px;
  font-family: Urbanist-Bold;
  text-align: center;
  line-height: 60px;
  color: #ffffff;
  max-width: 900px;
  margin: 60px auto 20px;
}

.third-section-title span {
  background-image: var(--landing-page-primary-gradiant);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.more-gradient {
  background-image: var(--text-more-gradient) !important;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.more-gradient-1 {
  background-image: var(--text-more-gradient-2) !important;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.more-gradient-2 {
  background-image: var(--text-more-gradient-1) !important;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.result-gradient {
  background-image: var(--text-result-gradient) !important;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.third-section-subtitle {
  margin: 0 auto;
  color: #adb4c7;
  font-size: 18px;
  font-family: Urbanist-Medium;
  text-align: center;
}

.slider-title {
  font-family: Urbanist-Bold;
  font-size: 21px;
  color: #ffffff;
  margin: 0 0 0 50px;
  padding: 0 0 0 16px;
}

.slider-title+span {
  font-family: Urbanist-Medium;
  color: #adb4c7;
  font-size: 18px;
}

.slider-container {
  width: 900px;
  max-width: calc(100vw - 100px);
  margin: 40px auto 60px;
}

.slider-bar {
  height: 30px;
  width: calc(100% - 64px);
  border-radius: 8px;
  background: #171e31;
}

.slider-progress {
  position: relative;
  height: 100%;
  width: 50%;
  border-radius: 8px 0 0 8px;
  background-image: linear-gradient(to left, #00efa9, #3672fb);
}

.slider-progress span {
  position: absolute;
  right: 0;
  display: inline-block;
}

.slider-progress-2 {
  background-image: linear-gradient(to left, #fda889, #3672fb);
}

.slider-count {
  font-family: Edmondsans-Bold;
  color: #adb4c7;
}

.slider-wrapper {
  /* padding: 0 16px; */
}

.slider-wrapper-2 {
  margin-top: 72px;
}

.thumb-value {
  top: 40px;
  color: #fff;
  right: -12px;
  font-family: Edmondsans-Bold;
  font-size: 16px;
  font-size: 16px;
  font-size: 16px;
  margin: 0 -10px 0 0;
}

.slider-progress::after {
  right: 0;
  position: absolute;
  content: "";
  margin: -8px 0 0 0;
  width: 14px;
  display: inline-block;
  height: 44px;
  border-radius: 8px;
  background: #ffff;
  background: #ffff;
  background: #ffff;
}

.slider-grid {
  margin-top: 28px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.third-section-secondary-title {
  font-family: Urbanist-Bold;
  font-size: 32px;
  text-align: center;
  color: #fff;
  margin: 80px auto 0;
  max-width: 790px;
}

.third-section-secondary-title span {
  font-size: 40px;
  background-image: var(--landing-page-primary-gradiant);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.third-section-secondary-subtitle {
  max-width: 780px;
  font-family: Urbanist-Medium;
  color: #adb4c7;
  margin: 16px auto 0;
  text-align: center;
  line-height: 28px;
}

.link {
  height: 60px;
  width: 350px;
  border: 1px solid #ffffff1a;
  border-radius: 15px;
  background: #212121;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link span {
  font-family: Urbanist-Bold;
  font-size: 18px;
  color: #adb4c7;
}

.link-second-part {
  color: #ffffff !important;
}

.forth-section {
  background: #0d0d0d;
  position: relative;
  padding: 0 0 60px 0;
}

.prop-1 {
  position: absolute;
  top: -80px;
  right: 50px;
}

.prop-1 img {
  height: 140px;
}

.forth-section-title {
  font-family: Urbanist-Bold;
  font-size: 42px;
  color: #ffffff;
  text-align: center;
  margin: 121px auto 0;
  padding-top: 100px;
  max-width: 750px;
}

.forth-section-grid {
  display: grid;
  max-width: 785px;
  margin: 100px auto 0;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  /* row-gap: 80px; */
}

.illstrations {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.illstrations-img {
  height: 180px;
  background: red;
  width: 180px;
  border-radius: 50%;
}

.three-d-img {
  transform: scale(0.4);
}

.animating-three-d-img {
  animation: grow 6s linear;
}

@keyframes grow {
  0% {
    transform: scale(0.4);
  }

  10% {
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
}

.three-d-img.animating-three-d-img {
  transform: scale(1);
}

.illstrations-title {
  font-family: Urbanist-Bold;
  color: #ffffff;
  size: 21px;
  text-align: center;
  z-index: 1;
}

.ills-1 {
  border-right: 1px solid #2b2b2b;
  border-bottom: 1px solid #2b2b2b;
  padding: 0 0 40px 0;
}

.ills-2 {
  border-bottom: 1px solid #2b2b2b;
  padding: 0 0 40px 0;
}

.ills-3 {
  border-right: 1px solid #2b2b2b;
  padding: 40px 0 0 0;
}

.ills-4 {
  padding: 40px 0 0 0;
}

.header-login>span {}

.wave-txt-1 {
  position: relative;
  animation: wave 3s ease-in-out infinite;
  animation-delay: 0.1s;
}

.wave-txt-2 {
  position: relative;
  animation: wave 3s ease-in-out infinite;
  animation-delay: 0.2s;
}

.wave-txt-3 {
  position: relative;
  animation: wave 3s ease-in-out infinite;
  animation-delay: 0.3s;
}

@keyframes wave {
  0% {
    top: 0px;
  }

  10% {
    top: -4px;
  }

  20% {
    top: 0px;
  }

  100% {
    top: 0px;
  }
}

.fifth-section-desktop {
  display: block;
  position: relative;
  background: #000000;
  display: flex;
}

.fifth-section-mobile {
  display: none;
}

.info-section-wrapper {
  display: flex;
  width: 50vw;
  margin: 24px 0 0 0;
  flex-direction: column;
  align-items: flex-end;
}

.mobile-info-container {
  padding-top: 62px !important;
  height: calc(100vh - 62px);
  width: 50%;
  display: flex;
  margin: 0px 0;
  align-items: center;
}

.mobile-info-container:first-of-type {
  margin: 24px 0 0;
}

.mobile-info-container:last-of-type {
  margin: 0 0 24px;
}

.mock-screen {
  margin: 24px auto;
  height: calc(320vh + 24px);
  width: 50vw;
  position: sticky;
  top: 180px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
}

.mock-screen .mobile {
  position: sticky;
  top: calc(15.5vh + 54px);
  width: 40vh;
  height: 75vh;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid #242424;
}

.mobile-background {
  display: flex;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background: #1a1a1a;
  border-radius: 30px;
  border: 10px solid #000;
}

.mobile-background img {
  position: absolute;
  height: 100%;
  width: 100%;
}

.mobile-info {
  text-align: left;
  max-width: 542px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
}

.index {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background: green;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #ffffff;
  font-family: Edmondsans-Bold;
}

.mobile-info-name {
  font-family: Urbanist-Bold;
  color: #ffffff;
  font-size: 24px;
  font-size: 42px;
}

.mobile-info-description {
  font-family: Urbanist-Medium;
  color: #adb4c7;
  font-size: 24px;
}

.sixth-section {
  background-image: url("https://dmk9je7eclmvw.cloudfront.net/assets/img/5e09parallax.png");
  height: 80vh;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: calc(100% - 1px) auto;
}

.seventh-section-title {
  font-family: Urbanist-Bold;
  max-width: 750px;
  font-size: 42px;
  color: #ffffff;
  margin: 60px 0 0 10vw;
}

.mock-screen-img {
  opacity: 1;
  transform: translateX(0);
}

.fadeOut {
  opacity: 0;
  transform: translateX(-40vh);
  transition: all 0.4s linear;
}

.backToOrigin {
  transform: translateX(40vh);
  transition: none;
}

.fadeIn {
  opacity: 1;
  transform: translateX(0vh);
  transition: all 0.4s linear;
}

.creators-count-container {
  width: 1200px;
  height: 544px;
  max-height: calc(100vh - 84px);
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  border: 1px solid #ffffff24;
  border-radius: 18px;
  position: relative;
  transform: translateY(-50px);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  background: linear-gradient(to right, #5d25571f, #000, #5d255742);

  position: relative;
  z-index: 10;
}

.grid-matrix-div {
  border: 1px solid #ffffff24;
}

.grid-matrix-div:nth-of-type(1) {
  border-radius: 13px 0 0 0;
}

.grid-matrix-div:nth-of-type(7) {
  border-radius: 0 13px 0 0;
}

.grid-matrix-div:nth-of-type(29) {
  border-radius: 0 0 0 13px;
}

.grid-matrix-div:nth-of-type(35) {
  border-radius: 0 0 13px 0;
}

.creator-count {
  font-size: 128px;
  font-family: Edmondsans-Bold;
}

.text-content {
  position: absolute;
  font-family: Urbanist-Bold;
  color: #ffffff;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0%);
  text-align: center;
}

.text-content img {
  height: 200px;
}

.bottom-dock {
  margin: -50px auto 0;
  border-radius: 0 0 30px 30px;
  background: linear-gradient(55deg, #9796f0, #fbc7d4);
  padding: 16px 0;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.creators-count-container .secondary-text {
  text-align: center;
  font-family: Urbanist-Medium;
  color: #fff;
  width: 90vw;
  margin-top: -21px;
  font-size: 21px;
}

.creators-count-container .secondary-text-bottom {
  font-family: Urbanist-Bold;
  margin-top: 4vh;
  font-size: 22px;
}

.seventh-section {
  overflow: hidden;
  background-image: radial-gradient(38vw, #640d5b87, transparent);
  background-position: 54vw 201px;
}

.creator-collage {
  position: relative;
  height: 80vh;
  margin: 24px auto 0;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: repeat(2, auto);
  will-change: transform;
  transition: all 0.2s linear;
}

.creator-collage div {
  position: relative;
  border-radius: 50%;
  /* background: #ffd829; */
}

.c-1 {
  height: 12vw;
  width: 12vw;
  overflow: hidden;
  background: linear-gradient(#15f4ee, rgb(255, 166, 0));
  box-shadow: 0 2px 24px 0 #15f4ed81 inset, 0 2px 24px 0 #15f4ed7a;
}

.c-2 {
  height: 18vw;
  width: 18vw;
  align-self: start;
  justify-self: center;
  overflow: hidden;
  background: linear-gradient(#ffe259, #ffa751);
  box-shadow: 0 2px 24px 0 #ffe2599f inset, 0 2px 24px 0 #ffe2599f;
}

.c-3 {
  height: 20vw;
  width: 20vw;
  align-self: end;
  overflow: hidden;
  background: linear-gradient(#eecda3, #ef629f);
  box-shadow: 0 2px 24px 0 #ef629f9f inset, 0 2px 24px 0 #ef629f9f;
}

.c-4 {
  height: 14vw;
  width: 14vw;
  overflow: hidden;
  background: linear-gradient(0deg, #ff5f6d, #ffc371);
  box-shadow: 0 2px 24px 0 #ff5f6c93 inset, 0 2px 24px 0 #ff5f6c93;
}

.c-5 {
  height: 16vw;
  width: 16vw;
  align-self: end;
  overflow: hidden;
  background: linear-gradient(#70e1f5, #ffd194);
  box-shadow: 0 2px 24px 0 #ffd19493 inset, 0 2px 24px 0 #ffd19493;
}

.c-6 {
  height: 10vw;
  width: 10vw;
  transform: translate(70px, -94px);
  overflow: hidden;
  background: linear-gradient(#ddd6f3, #faaca8);
  box-shadow: 0 2px 24px 0 #ddd6f39d inset, 0 2px 24px 0 #ddd6f39d;
}

.c-7 {
  height: 14vw;
  width: 14vw;
  align-self: start;
  justify-self: end;
  overflow: hidden;
  background: linear-gradient(#de6262, #ffb88c);
  box-shadow: 0 2px 24px 0 #de626281 inset, 0 2px 24px 0 #de626281;
}

.c-8 {
  height: 16vw;
  width: 16vw;
  align-self: end;
  overflow: hidden;
  background: linear-gradient(#ffe259, #ffa751);
  box-shadow: 0 2px 24px 0 #ffe35985 inset, 0 2px 24px 0 #ffe35985;
}

.c-9 {
  height: 15vw;
  width: 15vw;
  overflow: hidden;
  background: linear-gradient(#1d2b64, #f8cdda);
  box-shadow: 0 2px 24px 0 #f8cdda9f inset, 0 2px 24px 0 #f8cdda9f;
  transform: translate(-18vw, -2vw);
}

.c-10 {
  height: 10vw;
  width: 10vw;
  transform: translate(16vw, 0vw);
  font-family: Urbanist-Bold;
  color: #fff;
  overflow: hidden;
  display: flex;
  font-size: 2vw;
  justify-content: center;
  align-items: center;
  background: linear-gradient(#4b79a1, #283e51);
  box-shadow: 0 2px 24px 0 #159bf49f inset, 0 2px 24px 0 #159bf49f;
}

.c-1 img,
.c-2 img,
.c-3 img,
.c-5 img,
.c-4 img,
.c-5 img,
.c-6 img,
.c-7 img,
.c-8 img,
.c-9 img,
.c-10 img {
  height: 100%;
  width: 100%;
}

.footer-section {
  margin-top: 70px;
  border-top: 1px solid #1a1a1a;
}

.footer-section-title {
  font-family: Urbanist-Bold;
  font-size: 42px;
  text-align: center;
  color: #ffffff;
  max-width: 900px;
  margin: 40px auto 0;
}

.decor-1 {
  position: absolute;
  right: -131px;
  top: 47px;
}

.decor-2 {
  position: absolute;
  left: -131px;
  bottom: 60px;
}

.footer-content {
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 60px auto 0;
}

.footer-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-item-title {
  font-family: Urbanist-Medium;
  color: #adb4c7;
  font-size: 18px;
  text-align: center;
}

.footer-item-content {
  font-family: Urbanist-Bold;
  color: #fff;
  size: 24px;
}

.social-bar {
  margin: 120px auto 120px;
  display: flex;
  justify-content: space-between;
  max-width: 300px;
}

.social-bar img {
  height: 24px;
}

.onboard-hypd-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.marquee .rotate {
  width: 100%;
  height: 100%;
  margin: 0;
  white-space: nowrap;
  text-align: center;
}

@media (min-width: 0) and (max-width: 480px) {
  .funding-news {
    height: 48px;
    padding: 0 8px;
  }

  .text {
    width: 100%;
    height: 20px;
    white-space: nowrap;
    /* box-shadow: -10px 0px 5px -2px rgba(0, 0, 0, 0.1) inset; */
  }

  .marquee {
    overflow: hidden;
    position: relative;
  }

  .marquee .rotate {
    -moz-transform: translateX(400%);
    -webkit-transform: translateX(400%);
    transform: translateX(400%);
    -moz-animation: scroll-left 10s linear infinite;
    -webkit-animation: scroll-left 10s linear infinite;
    animation: scroll-left 10s linear infinite;
    text-align: left;
  }

  .shadow {
    position: absolute;
    top: 0;
    right: -5px;
    height: 20px;
    width: 20px;
    background: linear-gradient(to left,
        rgb(224, 82, 82) 20%,
        rgba(224, 82, 82, 0) 80%);
  }

  @keyframes scroll-left {
    0% {
      -moz-transform: translateX(100%);
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
    }

    100% {
      -moz-transform: translateX(-400%);
      -webkit-transform: translateX(-400%);
      transform: translateX(-400%);
    }
  }

  .emoji-text {
    gap: 5px;
  }

  .read-more {
    white-space: nowrap;
  }

  .read-more {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .read {
    font-size: 14px;
  }

  .social-bar {
    margin: 60px auto 60px;
    max-width: 200px;
  }

  .onboard-hypd-btn {
    position: static;
    left: auto;
    transform: none;
  }

  .social-bar img {
    height: 20px;
  }

  .footer-content {
    margin: 30px 16px 0;
    column-gap: 0px !important;
    grid-template-columns: 100% !important;
  }

  .path-1 img {
    height: 16px;
  }

  .path-2 img {
    height: 16px;
  }

  .path-3 img {
    height: 16px;
  }

  .path-4 img {
    height: 16px;
  }

  .path-5 img {
    height: 16px;
  }

  .path-6 img {
    height: 16px;
  }

  .path-7 img {
    height: 16px;
  }

  .decor-1 {
    height: 100px;
    right: -80px;
  }

  .decor-1 img {
    height: 100px;
  }

  .decor-2 {
    left: -72px;
    bottom: 60px;
  }

  .decor-2 img {
    height: 100px;
  }

  .footer-section-title {
    font-size: 28px;
    padding: 0 10px;
    margin: 30px auto 0;
  }

  .creator-count {
    font-size: 98px;
  }

  .creator-collage {
    height: 60vh;
    margin: 24px auto;
    max-width: 480px;
    display: grid;
    /* overflow-x: hidden; */

    gap: 10px;
    grid-template-columns: repeat(3, auto);
    /* grid-template-rows: repeat(2,auto); */
  }

  .creator-collage div {
    position: relative;
    border-radius: 50%;
    /* top: 50%;
      left: 50%; */
    /* background: red; */
  }

  .text-content {
    top: 0;
    left: 50%;
    transform: translate(-50%, 0%);
  }

  .text-content img {
    height: 100px;
  }

  .c-1 {
    height: 100px;
    width: 100px;
    object-fit: contain;
  }

  .c-2 {
    height: 120px;
    width: 120px;
    align-self: start;
    justify-self: center;
  }

  .c-3 {
    height: 35vw;
    width: 35vw;
    align-self: end;
    transform: translate(-31vw, 31vw);
  }

  .c-4 {
    height: 25vw;
    width: 25vw;
    transform: translate(16vw, -17vw);
  }

  .c-5 {
    height: 30vw;
    width: 30vw;
    align-self: end;

    transform: translate(39vw, -34vw);
  }

  .c-6 {
    height: 80px;
    width: 80px;
    transform: translate(22px, 22px);
  }

  .c-7 {
    height: 25vw;
    width: 25vw;
    align-self: start;
    justify-self: end;
    transform: translate(-3vw, -27vw);
  }

  .c-8 {
    height: 140px;
    width: 140px;
    align-self: end;
    transform: translate(2vw, -2vw);
  }

  .c-9 {
    height: 125px;
    width: 125px;
    transform: translate(0, -34vw);
  }

  .c-10 {
    height: 24vw;
    width: 24vw;
    font-size: 20px;
    transform: translate(1px, -4vw);
  }

  .seventh-section {}

  .fifth-section-desktop {
    display: none;
  }

  .fifth-section-mobile {
    display: block;
    position: relative;
  }

  .slider-bar {
    height: 26px;
    width: calc(100% - 64px);
    border-radius: 8px;
    background: #171e31;
  }

  .seventh-section-title {
    font-size: 28px;
    text-align: center;
    margin: 20px 0 0 0;
    padding: 0 16px;
  }

  .sixth-section {
    height: 60dvh;
    /* background-size: auto 100%; */
    background-size: cover;
  }

  .prop-1 {
    position: absolute;
    top: -65px;
    right: 16px;
  }

  .prop-1 img {
    height: 100px;
  }

  .ills-1 {
    border-right: none;
    border-bottom: 1px solid #2b2b2b;
    padding: 0 0 40px 0;
  }

  .ills-2 {
    border-bottom: 1px solid #2b2b2b;
    padding: 40px 0 40px 0;
  }

  .ills-3 {
    border-right: none;
    border-bottom: 1px solid #2b2b2b;
    padding: 40px 0 40px 0;
  }

  .ills-4 {
    padding: 40px 0 0 0;
  }

  .forth-section-title {
    margin: 80px 0 0 0;
    font-size: 28px;
    padding: 40px 16px 0;
  }

  .link {
    height: 51px;
  }

  .btn-2 {
    height: 51px;
    font-size: 16px;
  }

  .third-section-secondary-subtitle {
    margin: 16px 16px 0;
    text-align: center;
    line-height: 24px;
  }

  .third-section-secondary-title {
    font-family: Urbanist-Bold;
    font-size: 24px;
    text-align: center;
    color: #fff;
    margin: 80px auto 0;
    width: 85vw;
  }

  .slider-progress::after {
    position: absolute;
    right: 0;
    content: "";
    margin: -8px 0 0 0;
    width: 12px;
    display: inline-block;
    height: 40px;
    border-radius: 8px;
    background: #ffff;
  }

  .third-section-secondary-title span {
    font-size: 32px;
  }

  .slider-grid {
    margin-top: 20px;
  }

  .landing-page-header {
    padding: 14px 25px;
  }

  .third-section-title {
    font-size: 30px;
    line-height: 30px;
    padding: 16px;
  }

  .slider-container {
    width: calc(100vw - 86px);
  }

  .third-section-subtitle {
    font-size: 16px;
    line-height: 24px;
    padding: 0 16px;
  }

  .hypd-logo {
    font-size: 24px;
    padding-right: none;
    font-family: Urbanist-ExtraBold !important;
    width: fit-content !important;
  }

  .first-section {
    background-position: center 30%, right 35px;
    background-repeat: no-repeat, no-repeat;
    background-size: contain, auto;
  }

  .header-login {
    font-size: 14px;
  }

  .btn {
    margin: 0 0 0 16px;
  }

  .main-text-first-section {
    padding: 0px 16px;
    font-size: 36px;
    line-height: 44px;
    max-width: calc(100vw - 32px);
    margin: 32vh 0 0 0;
  }

  .secondary-text-first-section {
    font-size: 18px;
    max-width: calc(100vw - 32px);
    margin: 20px 0 24px 0;
    padding: 0 16px;
    line-height: 30px;
  }

  .slider-title {
    padding: 0;
    font-size: 16px;
    margin: 0;
  }

  .slider-title+span {
    font-size: 14px;
  }

  .slider-wrapper-2 {
    margin-top: 44px;
  }

  .slider-progress span {
    top: 40px;
    right: -8px;
    font-size: 12px;
  }

  .forth-section-grid {
    margin: 40px auto 0;
  }

  /* .info-section-wrapper {
        width: 100vw;
        align-items: normal;
    } */
  /* .mobile-info-container{
        width: 100vw;
        justify-content: center;
    } */

  .creators-count-container .secondary-text {
    font-size: 16px;
    width: 90vw;
  }

  .creators-count-container .secondary-text-bottom {
    margin-top: 2vh;
  }

  .scroll-track {
    height: 400vh;
    position: sticky;
    top: 180px;
  }

  .index {
    height: 60px;
    width: 60px;
    font-size: 24px;
  }

  .mobile-info-name {
    font-size: 20px;
  }

  .mobile-info-description {
    font-size: 16px;
    text-align: center;
    padding: 0 16px;
  }

  .mobile-info-mobile {
    gap: 12px;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .mock-screen-view-details {
    height: calc(100vh - 62px);
    position: sticky;
    top: 72px;
    height: 100vh;
    width: 100vw;
  }

  /* .mock-screen-mobile-container {
      height: calc(400vh - 170px);
      width: 100vw;
      position: absolute;
      top: 180px;
      left: 0;
      display: flex;
      -webkit-box-pack: center;
      justify-content: center;
    }
    .mock-screen-mobile {
      height: calc(68vh);
      width: 38.2vh;
      position: sticky;
      top: 27vh;
      left: 0;
      display: flex;
      -webkit-box-pack: center;
      justify-content: center;
    } */

  .mock-mobile-device {
    width: fit-content;
    height: 60vh;
    border-radius: 30px;
    border: 1px solid #242424;
    margin: 24px auto;
  }

  .mock-mobile-device img {
    height: 60vh;
    border-radius: 30px;
    border: 6px solid black;
  }

  .creators-count-container {
    max-height: calc(100vw - 62px);
    max-width: calc(100vw - 32px);
    background-position: -100px 0px;
    background: linear-gradient(to right, #ff95f426, #000, #8d4f873b);
  }

  .second-section {
    transform: scale(1.5);
  }

  .second-section-container {
    overflow-x: hidden;
    overflow-y: hidden;
    padding: 62px 0 40px;
  }

  .secondary-text-font-mobile {
    font-size: 14px !important;
  }

  .footer-content {
    display: grid !important;
    grid-template-columns: repeat(2, auto);
    gap: 30px;
    justify-content: center;
    align-content: center;
    text-align: center;
  }

  .footer-items:nth-of-type(2) {
    grid-row: 2;
    grid-column: 1 / span 2;
  }
}

@supports (-webkit-touch-callout: none) {
  .sixth-section {
    background-attachment: unset;
  }
}

.mobile-info {
  opacity: 0;
}

.animation-ref {
  opacity: 0;
}

.animation-ref.title-animation {
  opacity: 1;
}

.title-animation {
  position: relative;
  animation: slide-in 0.8s linear;
}

.title-animation.mobile-info {
  opacity: 1;
}

@keyframes slide-in {
  0% {
    opacity: 0.1;
    top: 80px;
  }

  100% {
    opacity: 1;
    top: 0;
  }
}

a {
  font-size: inherit;
  font-family: inherit;
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.slider-right-enter-from {
  right: 40vh;
  opacity: 0;
}

.slider-right-enter-to {
  right: 0;
  opacity: 1;
}

.slider-right-leave-from {
  right: 0;
  opacity: 0;
}

.slider-right-leave-to {
  right: -40vh;
  opacity: 1;
}

.slider-right-enter-active,
.slider-right-leave-active {
  transition: all 0.4s ease;
}

.slider-left-enter-from {
  right: -40vh;
  opacity: 0;
}

.slider-left-enter-to {
  right: 0;
  opacity: 1;
}

.slider-left-leave-from {
  right: 0;
  opacity: 1;
}

.slider-left-leave-to {
  right: 40vh;
  opacity: 0;
}

.slider-left-enter-active,
.slider-left-leave-active {
  transition: all 0.4s ease;
}
</style>