<template>
    <div class="creator-store">
        <div v-show="isLoading" class="page-loader">
            <img src="@/assets/loaders/H..png" alt="" />
        </div>
        <div id="creator-store-section">
            <div id="creator-store-section-hide">
                <div v-if="noUserFound">
                    <div class="no-user">
                        No creator was found with username '{{ username }}'.
                    </div>
                </div>
                <div v-if="creator">
                    <div class="creator-info">
                        <!-- Desktop view -->
                        <div class="creator-info-container desktop">
                            <div class="creator-dp" @click="trackCreatorProfileClick">
                                <img :src="getReplacedSource(creatorProfilePic)" :alt="creator.name" />
                            </div>
                            <div class="creator-title-wrapper">
                                <div class="creator-title-container">
                                    <div class="creator-title">
                                        {{
                                            creator.store_display_name
                                            ? creator.store_display_name
                                            : creator.name
                                        }}
                                    </div>
                                    <button v-if="user_following" @click="unfollow_author" class="following-btn active-btn">
                                        Following
                                    </button>
                                    <button v-else @click="follow_author" class="following-btn inactive-btn">
                                        Follow
                                    </button>
                                </div>
                                <div>
                                    <div class="followers-section" @click="trackCreatorFollowers">
                                        <span class="count mr-6">{{ creatorFollowers }}</span>
                                        Followers
                                    </div>
                                </div>

                                <div v-if="!botdImages" class="creator-description">
                                    {{ creator.bio }}
                                </div>
                            </div>
                        </div>
                        <!-- Mobile view -->
                        <div class="creator-profile-container mobile">
                            <div class="creator-dp" @click="trackCreatorProfileClick">
                                <img :src="getReplacedSource(creatorProfilePic)" :alt="creator.name" />
                            </div>
                            <div class="creator-title-wrapper">
                                <div class="creator-title-container">
                                    <div class="creator-title">
                                        {{
                                            creator.store_display_name
                                            ? creator.store_display_name
                                            : creator.name
                                        }}
                                    </div>
                                </div>
                                <div class="followers-section" @click="trackCreatorFollowers">
                                    <span class="count mr-6">{{ creatorFollowers }}</span>
                                    Followers
                                </div>
                                <button v-if="user_following" @click="unfollow_author" class="following-btn active-btn">
                                    Following
                                </button>
                                <button v-else @click="follow_author" class="following-btn inactive-btn">
                                    Follow
                                </button>
                            </div>
                        </div>
                        <div class="mobile" v-if="!botdImages">
                            <div class="creator-description">
                                {{ creator.bio }}
                            </div>
                        </div>
                    </div>
                    <!-- If BOTD Exists -->
                    <div class="sticky-container">
                        <div v-if="botdImages">
                            <div class="botd ban-desk">
                                <carousel class="carousel" v-if="botdImages" :items-to-show="1" :autoplay="2000"
                                    :touchDrag="true" :pauseAutoplayOnHover="true">
                                    <slide v-for="(botdImage, index) in botdImages" :key="index">
                                        <div style="postion: relative">
                                            <img :src="getReplacedSource(botdImage.src)" alt="" class="botdImg"
                                                @click="redirectToBWB(botdImage.redirectionUrl)" :key="index" />
                                        </div>
                                    </slide>
                                </carousel>
                            </div>

                            <div class="botd ban-mob">
                                <carousel class="carousel" v-if="botdImages" :items-to-show="1" :autoplay="2000"
                                    :touchDrag="true" :pauseAutoplayOnHover="true" :style="'height: calc(100%)'">
                                    <slide v-for="(botdImage, index) in botdImages" :key="index">
                                        <div style="postion: relative">
                                            <img :src="getReplacedSource(botdImage.src)" alt="" class="botdImg"
                                                @click="redirectToBWB(botdImage.redirectionUrl)" :key="index" />
                                        </div>
                                    </slide>
                                </carousel>
                            </div>
                        </div>

                        <div class="creator-contents">
                            <div :class="{
                                'active-creator-contents': route.query.active == 'collections',
                            }" @click="changeTab('collections')">
                                Collections
                            </div>
                            <div :class="{
                                'active-creator-contents': route.query.active == 'spotlight',
                            }" @click="changeTab('spotlight')">
                                Spotlight
                            </div>
                        </div>
                    </div>

                    <!-- pages -->
                    <collections v-if="route.query.active == 'collections'" />
                    <spotlight v-if="route.query.active == 'spotlight'" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    name: "CreatorStore",
    layout: "parent-layout",
});
// import * as tracking from "../eventTracking";
import {
    getReplacedSource,
    defaultProfileImage,
    optimizeImage,
} from "~/utils/helperMethods";

import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";

import collections from "./collections.vue";
import spotlight from "./spotlight.vue";
import track from "~/utils/tracking-posthog";

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const creatorStore = useCreatorStore();

const creator = ref({});

const store = useStore()


if (route.params.creatorUsername) {
    try {
        const { data, pending: loadingCreatorInfo, error } = await useFetch(
            runtimeConfig.public.entityURL +
            "/api/app/influencer/username/" +
            route.params.creatorUsername,
            {
                key: "influencer_info_store",
                methods: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        creatorStore.saveCreatorInfo(data?.value?.payload);
    }
    catch (err) {
        console.log(err)
    }
}

const props = defineProps([
    "isDesktop",
    "wishlisted_items",
    "user",
    "cart_items",
]);
const emits = defineEmits(["loadingPage"]);

useSeoMeta({
    title: `${creatorStore.info.name} | HYPD`,
    ogTitle: `${creatorStore.info.name} | HYPD`,
    description: `Shop from ${creatorStore.info.name}'s store on HYPD`,
    ogDescription: `Shop from ${creatorStore.info.name}'s store on HYPD`,
    ogImage: `${creatorStore.info?.profile_image?.src}`,
    twitterImage: `${creatorStore.info?.profile_image?.src}`,
    twitterCard: "summary",
});

const isLoading = ref(false);
const username = ref(null);
const user_following = ref(null);
const noUserFound = ref(false);
const creatorFollowers = ref(0);
const botdImages = ref(null);
const botd = ref(true);
const botdData = ref([]);
const current_slide = ref(0);


let trackingDetails = {}

// computed
const creatorProfilePic = computed(() => {
    return optimizeImage(creatorStore.info?.profile_image?.src, 350);
});

function trackCreatorFollowButton() {
    track("creator_store:follow_button_click", {
        ...trackingDetails,
        followers_count: creatorFollowers.value
    })
}

function trackCreatorFollowers() {
    track("creator_store:followers_click", {
        ...trackingDetails,
        followers_count: creatorFollowers.value
    })
}

function trackCreatorProfileClick() {
    track('creator_store:profile_image_click', {
        ...trackingDetails
    })
}

function readMore() {
    window.open(
        "https://www.linkedin.com/posts/hypdin_fundingalert-creatorseconomy-creatorcommerce-activity-7059102596665384961-fZ1g?utm_source=share&utm_medium=member_ios"
    );
}

function redirectToBWB(path) {

    track('creator_store:bwb_click', {
        ...trackingDetails,
        bwb_name: path
    })

    let url = path.split(runtimeConfig.public.base)[1];
    window.open(`${runtimeConfig.public.base}/${creatorStore.info.username}${url}`, "_self");
}

// Checking Device Width while re-sizing to change BOTD Image
function checkDevice() {
    if (
        window.matchMedia("only screen and (max-width: 480px)").matches &&
        botd.value
    ) {
        botdImages.value = [];
        botdData?.value.forEach((botd) => {
            for (let i in botd?.images) {
                if (botd?.images[i].type == "mobile") {
                    botdImages?.value.push({
                        src: botd?.images[i].image.src,
                        redirectionUrl: botd.url,
                    });
                }
            }
        });
    } else {
        botdImages.value = [];
        botdData?.value.forEach((botd) => {
            for (let i in botd.images) {
                if (botd.images[i].type == "web") {
                    botdImages.value.push({
                        src: botd.images[i].image.src,
                        redirectionUrl: botd.url,
                    });
                }
            }
        });
    }
    setTimeout(function () {
        let payload = {
            currentSlide: 0,
        };
        updateCarousel(payload);
    }, 500);

    // updating creator here, so all the botd calc are done and bio does not flicker.
    creator.value = { ...creatorStore.info };
}

function updateCarousel(payload) {
    current_slide.value = payload.currentSlide;
}

function changeTab(options) {


    if (options == 'collections') {
        track('creator_store:collection_tab_click', {
            creator_name: creatorStore.info?.name,
            creator_username: creatorStore.info?.username,
        })
    } else {
        track('creator_store:spotlight_tab_click', {
            creator_name: creatorStore.info?.name,
            creator_username: creatorStore.info?.username,
        })
    }


    router.replace({
        name: "CreatorStore", params: {
            creatorUsername: route.params.creatorUsername
        }, query: {
            active: options
        }
    });
    document.getElementById("creator-store-section").scrollTop = {
        top: 0,
        behavior: "smooth",
    };
}

function follow_author() {
    trackCreatorFollowButton()
    if (store.user.id) {
        if (!creator.value.is_followed_by_user) {
            $fetch(
                runtimeConfig.public.entityURL + "/api/app/customer/influencer/follow",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        customer_id: store.user.customer_id,
                        id: creator.value.id,
                    },
                }
            )
                .then((response) => {
                    if (response.payload) {
                        creator.value["is_followed_by_user"] = true;
                        user_following.value = true;

                        // incrementing the reactive variable to re-render the component
                        creatorFollowers.value += 1;
                    }
                })
                .catch((error) => {
                    alert(error.response.data.error[0].message);
                });
        }
    } else {
        let ans = confirm("Let's get you logged in first!");
        if (ans) {
            let current_url = route.fullPath;
            router.push("/login?redirection_url=" + current_url);
        }
    }
}
async function unfollow_author() {
    if (creator.value.is_followed_by_user) {
        await $fetch(
            runtimeConfig.public.entityURL + "/api/app/customer/influencer/unfollow",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    customer_id: store.user.customer_id,
                    id: creator.value.id,
                },
            }
        )
            .then((response) => {
                if (response.payload) {
                    creator.value["is_followed_by_user"] = false;
                    user_following.value = false;
                    creatorFollowers.value -= 1;
                }
            })
            .catch((error) => { });
    }
}
async function getBOTD() {
    emits("loadingPage", true);
    try {
        let response = await $fetch(
            runtimeConfig.public.entityURL + "/api/app/bwb",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        response = response.payload;
        if (response) {
            botdData.value = response;
        }
        checkDevice();
    } catch (err) {
        console.log(err);
    } finally {
        setTimeout(() => {
            emits("loadingPage", false);
        }, 200);
    }
}

onMounted(() => {
    trackingDetails = {
        creator_name: creatorStore.info?.name,
        creator_username: route.params.creatorUsername,
    }
    track('creator_store:visit', {
        ...trackingDetails
    })
    trackingLandingEvent("creator_store_landing");

    router.replace({
        name: "CreatorStore", params: {
            creatorUsername: route.params.creatorUsername
        }, query: {
            active: 'collections'
        }
    });
    // Attaching Listener on while component is mounted
    window.addEventListener("resize", checkDevice);
});

onBeforeMount(() => {
    getBOTD();
});
</script>
<style scoped>
.creator-store {
    max-width: 1180px;
    margin: 0 auto;
}

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
    text-decoration: underline;
    text-decoration-style: dotted;
}

.funding-news {
    width: 100%;
    z-index: 22;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0;
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
}

/* funding news */

.default-image {
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(2, 150px);
    grid-template-rows: repeat(2, 150px);
    gap: 2px;
    border-radius: 16px;
    overflow: hidden;
    width: 283px;
    height: 283px;
    cursor: pointer;
}

.catalog-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.catalog-image:nth-of-type(1) {
    border-top-left-radius: 16px;
}

.catalog-image:nth-of-type(2) {
    border-top-right-radius: 16px;
}

.catalog-image:nth-of-type(3) {
    border-bottom-left-radius: 16px;
}

.catalog-image:nth-of-type(4) {
    border-bottom-right-radius: 16px;
}

@media screen and (min-width: 0px) and (max-width: 480px) {

    /* funding news css */
    .funding-news {
        padding: 5px 0;
    }

    .text {
        width: 220px;
        height: 30px;
        white-space: nowrap;
        /* box-shadow: -10px 0px 5px -2px rgba(0, 0, 0, 0.1) inset; */
    }

    .marquee {
        overflow: hidden;
        position: relative;
    }

    .shadow {
        position: absolute;
        right: -5px;
        height: 20px;
        width: 20px;
        background: linear-gradient(to left,
                rgb(224, 82, 82) 20%,
                rgba(224, 82, 82, 0) 80%);
    }

    .emoji-text {
        gap: 5px;
    }

    .read-more {
        white-space: nowrap;
    }

    .marquee .rotate {
        position: absolute;
        top: 2px;
        width: 100%;
        height: 100%;
        margin: 0;
        text-align: center;
        -moz-transform: translateX(400%);
        -webkit-transform: translateX(400%);
        transform: translateX(400%);
        -moz-animation: scroll-left 10s linear infinite;
        -webkit-animation: scroll-left 10s linear infinite;
        animation: scroll-left 10s linear infinite;
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

    .read-more {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .read {
        font-size: 14px;
    }

    /* funding news ends */

    .default-image {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(2, 50%);
        height: 100%;
        width: 100%;
    }
}

.timer-heading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    color: #fff;
    font-family: "Urbanist-Medium";
    font-size: 18px;
    text-transform: uppercase;
    text-shadow: 1px 0px 1px #ccc, 0px 1px 1px #eee;
}

.timer {
    font-family: "Urbanist-Bold";
    color: #fff;
    text-transform: uppercase;
    font-size: 16px;
    line-height: 18px;

    position: absolute;
    left: 50%;
    top: 16px;
    transform: translateX(-50%);

    background: linear-gradient(90deg, #f33167 0%, #ff7ea2 132.83%);
    box-sizing: border-box;
    padding: 3px 6px;
    border: 1px solid #fff;
    border-radius: 4px;
}

.botd-timer {
    left: auto !important;
    transform: translate(160%) !important;
    white-space: nowrap !important;
}

.time-left {
    display: flex;
    justify-content: center;
    width: 150px;
    padding: 6px 8px;
    border: 1px solid #fff;
    background: linear-gradient(90deg, #7f47dd 0%, #ab85ff 132.83%),
        linear-gradient(0deg, #ffffff, #ffffff);
}

.panda {
    height: 200px;
    width: 200px;
    animation-name: rotateLeft;
    animation-duration: 1s;

    -webkit-animation-name: rotateLeft;
    -webkit-animation-duration: 1s;
}

.show-panda {
    display: none;
}

.disable_scroll {
    overflow: hidden;
    height: 100vh;
}

.no-user {
    font-size: 18px;
    display: flex;
    vertical-align: middle;
    color: rgb(169, 169, 169);
    text-align: center;
    margin: 0 auto;
    max-width: calc(100vw - 20px);
    height: calc(100vh - 300px);
    flex-direction: column;
    justify-content: center;
}

.creator-dp {
    background: #ffffff;
    cursor: pointer;
    position: relative;
    border-radius: 50%;
    height: 150px;
    width: 150px;
}

.creator-dp img {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    object-fit: cover;
}

.creator-info {
    padding: 16px;
    max-width: 1180px;
    margin: 0 auto;
}

.creator-info-container {
    display: flex;
    justify-content: center;
}

.creator-title {
    text-align: left;
    color: #13141b;
    font-size: 24px;
    font-family: Urbanist-Bold;
    margin: 0 20px 0 0;
}

.creator-title-container {
    display: flex;
    align-items: center;
    margin: 29px 0 0 0px;
}

.show-panda-true {
    display: block;
    text-align: center;
    margin-top: 40px;
}

.rotate-panda-left {
    animation-name: rotateLeft;
    animation-duration: 1s;
    animation-iteration-count: infinite;

    -webkit-animation-name: rotateLeft;
    -webkit-animation-duration: 1s;
    -webkit-animation-iteration-count: infinite;
}

.sticky-container {
    position: sticky;
    top: 72px;
    z-index: 5;
    padding: 12px 0 0;
    background: #ffffff;
}

@keyframes rotateLeft {
    25% {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
    }

    100% {
        transform: rotate(-90deg);
        -webkit-transform: rotate(-90deg);
    }
}

.rotate-panda-right {
    animation-name: rotateRight;
    animation-duration: 1s;
    animation-iteration-count: infinite;

    -webkit-animation-name: rotateRight;
    -webkit-animation-duration: 1s;
    -webkit-animation-iteration-count: infinite;
}

@keyframes rotateRight {
    25% {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
    }

    100% {
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
    }
}

@media screen and (min-width: 481px) {
    .ban-mob {
        display: none;
    }

    .ban-desk {
        display: flex;
    }

    .mobile {
        display: none !important;
    }

    .creator-title-wrapper {
        margin-left: 50px;
    }

    .desktop {
        display: flex !important;
    }
}

@media screen and (max-width: 480px) {
    .ban-mob {
        display: flex;
    }

    .ban-desk {
        display: none;
    }

    .sticky-container {
        padding: 0;
        z-index: 4;
        background: var(--creator-page-nav-bar-color);
    }

    .desktop {
        display: none !important;
    }

    .mobile {
        display: flex !important;
    }

    .creator-title-wrapper {
        margin-left: 16px;
    }

    .creator-title-container {
        margin: 0 0 0 0;
    }

    .creator-info {
        margin: 10px auto 10px;
        max-width: 1180px;
    }

    .creator-title {
        font-size: 21px;
        text-align: left;
    }

    .creator-profile-container {
        margin-left: 16px;
        justify-content: flex-start;
        align-items: center;
    }

    .timer {
        font-size: 12px !important;
        line-height: 12px !important;
        top: 6px;
    }
}

.creator-id {
    text-align: center;
    font-size: 12px;
    font-family: Urbanist-Medium;
    margin: 0 auto 10px;
    color: #858484;
}

.creator-description {
    white-space: pre-line;
    font-size: 14px;
    font-family: Urbanist-Medium;
    color: #a9a9a9;
    margin: 8px 0 0 0;
}

.followers-section {
    font-size: 14px;
    font-family: Urbanist-Medium;
    color: #13141b;
    margin: 8px 0 0 0px;
}

.followers-section span {
    font-family: Edmondsans-Bold;
    color: #13141b;
}

.following-btn {
    font-size: 16px;
    font-family: Urbanist-Bold;
    border-radius: 10px;
    width: 200px;
    height: 40px;
}

.active-btn {
    background-color: #fb6c23;
    color: #ffffff;
    border: #fb6c23;
}

.active-btn:hover {
    background-color: #ff7d3c;
    color: #ffffff;
    border: #ff7d3c;
    cursor: pointer;
}

.inactive-btn {
    background-color: #ffffff;
    color: #13141b;
    border: 1px solid#E5E5E5;
}

.inactive-btn:hover {
    background-color: #202020;
    color: #ffffff;
    border: 1px solid#E5E5E5;
    cursor: pointer;
}

.creator-contents {
    text-align: center;
    color: #a9a9a9;
    display: flex;
    justify-content: center;
    font-size: 18px;
    font-family: Urbanist-Medium;
    border-bottom: 1px solid #e6e6e6;
}

.creator-contents div {
    width: 10%;
    min-width: 120px;
    cursor: pointer;
    padding: 6px 0;
}

.active-creator-contents {
    color: #13141b;
    border-bottom: 2px solid #13141b;
}

.product-contents {
    min-height: calc(100dvh - 350px);
    margin: 20px 12px 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 32px;
    justify-items: center;
    padding: 0 0 32px;
}

.pebbles-cover {
    cursor: pointer;
    position: relative;
    width: 230px;
    border-radius: 20px;
    height: 318px;
}

.pebbles-cover img {
    border-radius: 20px;
    width: 230px;
    object-fit: cover;
    height: 318px;
}

.pebble-duration {
    font-family: Edmondsans-Bold;
    position: absolute;
    right: 12px;
    top: 12px;
    background: #fff;
    height: 22px;
    padding: 0px 9px;
    box-sizing: border-box;
    border-radius: 7px;
}

.botd {
    /* position: relative; */
    max-width: 1180px;
    margin: 0 auto;
    width: calc(100% - 36px);
    cursor: pointer;
}

section.carousel :deep(ol) {
    margin: 0 !important;
}

.botd::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}

.botdImg {
    object-fit: cover;
    border-radius: 20px;
    width: calc(100% - 24px);
    margin: 12px;
    box-sizing: border-box;
}

.single-botdImg {
    object-fit: cover;
    border-radius: 20px;
    width: calc(100% - 28px);
    margin-left: 14px;
}

@media screen and (max-width: 480px) {

    .sticky-container {
        top: 48px !important;
    }

    .botd {
        margin: 0 auto;
        width: calc(100%);
    }

    .creator-dp {
        height: 104px;
        width: 104px;
    }

    .creator-dp img {
        height: 104px;
        width: 104px;
        object-fit: cover;
    }

    .creator-description {
        margin: 14px 16px 0;
    }

    .product-contents {
        margin: 16px;
        display: grid;
        /* grid-template-columns: 1fr 1fr; */
        grid-template-columns: repeat(auto-fill, minmax(calc(50dvw - 24px), 1fr));
        gap: 16px;
    }

    .pebbles-cover {
        width: calc((100vw - 48px) / 2);
        border-radius: 20px;
        height: 241px;
    }

    .pebbles-cover img {
        border-radius: 20px;
        width: calc((100vw - 48px) / 2);
        height: 241px;
    }

    .followers-section {
        margin: 2px 0 4px 0px;
    }

    .following-btn {
        padding: 4px 0 0 0;
        font-size: 16px;
        font-family: Urbanist-Bold;
        border-radius: 10px;
        width: 150px;
        height: 32px;
    }

    .creator-contents {
        z-index: 4;
        background: var(--creator-page-nav-bar-color);
    }

    .creator-contents div {
        width: 50%;
        cursor: pointer;
    }
}

.top-bar {
    position: fixed;
    top: 0;
    left: 50%;
    background: var(--creator-page-nav-bar-color);
    transform: translateX(-50%);
    max-width: 900px;
    width: calc(100%);
    z-index: 5;
    box-sizing: border-box;
    overflow: hidden;
    min-height: 71px;
}

.page-title {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}



.slide-in-menu {
    left: 0vw !important;
}

.heart-icon {
    display: flex;
    align-items: center;
    width: 24px;
    height: 24px;
}

.cart-icon,
.search-icon {
    width: 21px;
    height: 21px;
}

.search-icon img,
.heart-icon img,
.cart-icon img {
    width: 100%;
    height: 100%;
}

.menu {
    left: -100dvw;
    transition: all 0.45s ease;
    display: inline-block;
    position: fixed;
    width: 100%;
    height: 100dvh;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 13;
    overflow: hidden;
}
</style>
