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
                            <div class="creator-dp">
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
                                    <div class="followers-section">
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
                            <div class="creator-dp">
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
                                <div class="followers-section">
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
                                'active-creator-contents': route.name == 'CreatorCollections',
                            }" @click="changeTab('CreatorCollections')">
                                Collections
                            </div>
                            <div :class="{
                                'active-creator-contents': route.name == 'CreatorSpotlight',
                            }" @click="changeTab('CreatorSpotlight')">
                                Spotlight
                            </div>
                        </div>
                    </div>

                    <!-- pages -->
                    <NuxtPage />

                    <!-- Funding news -->
                    <div class="funding-news">
                        <div class="emoji-text">
                            <div class="emoji">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_i_884_1431)">
                                        <path
                                            d="M18.6866 24.8555C19.1258 24.664 19.3085 24.3837 19.4405 24.2187C20.6258 22.7382 18.0968 18.3437 14.4861 15.8009C10.6593 12.4687 6.44575 11.3333 5.26043 12.8138C5.05698 13.0679 4.89755 13.414 4.83114 13.8047L2.58114 26.75C2.50301 28.3281 3.10618 28.9278 3.40802 29.2208C3.95499 29.7516 5.01864 30.2031 6.12801 29.8125C10.4093 28.164 14.42 26.7155 18.6866 24.8555Z"
                                            fill="url(#paint0_linear_884_1431)" />
                                    </g>
                                    <path
                                        d="M18.6866 24.8555C19.1258 24.664 19.3085 24.3837 19.4405 24.2187C20.6258 22.7382 18.0968 18.3437 14.4861 15.8009C10.6593 12.4687 6.44575 11.3333 5.26043 12.8138C5.05698 13.0679 4.89755 13.414 4.83114 13.8047L2.58114 26.75C2.50301 28.3281 3.10618 28.9278 3.40802 29.2208C3.95499 29.7516 5.01864 30.2031 6.12801 29.8125C10.4093 28.164 14.42 26.7155 18.6866 24.8555Z"
                                        fill="url(#paint1_linear_884_1431)" />
                                    <path
                                        d="M18.6866 24.8555C19.1258 24.664 19.3085 24.3837 19.4405 24.2187C20.6258 22.7382 18.0968 18.3437 14.4861 15.8009C10.6593 12.4687 6.44575 11.3333 5.26043 12.8138C5.05698 13.0679 4.89755 13.414 4.83114 13.8047L2.58114 26.75C2.50301 28.3281 3.10618 28.9278 3.40802 29.2208C3.95499 29.7516 5.01864 30.2031 6.12801 29.8125C10.4093 28.164 14.42 26.7155 18.6866 24.8555Z"
                                        fill="url(#paint2_linear_884_1431)" />
                                    <path
                                        d="M18.6866 24.8555C19.1258 24.664 19.3085 24.3837 19.4405 24.2187C20.6258 22.7382 18.0968 18.3437 14.4861 15.8009C10.6593 12.4687 6.44575 11.3333 5.26043 12.8138C5.05698 13.0679 4.89755 13.414 4.83114 13.8047L2.58114 26.75C2.50301 28.3281 3.10618 28.9278 3.40802 29.2208C3.95499 29.7516 5.01864 30.2031 6.12801 29.8125C10.4093 28.164 14.42 26.7155 18.6866 24.8555Z"
                                        fill="url(#paint3_linear_884_1431)" />
                                    <g filter="url(#filter1_f_884_1431)">
                                        <ellipse cx="12.2996" cy="18.6238" rx="8.77242" ry="3.46422"
                                            transform="rotate(39.7456 12.2996 18.6238)"
                                            fill="url(#paint4_linear_884_1431)" />
                                    </g>
                                    <g filter="url(#filter2_f_884_1431)">
                                        <ellipse cx="12.5552" cy="18.1868" rx="8.13023" ry="2.91536"
                                            transform="rotate(39.7456 12.5552 18.1868)"
                                            fill="url(#paint5_linear_884_1431)" />
                                        <ellipse cx="12.5552" cy="18.1868" rx="8.13023" ry="2.91536"
                                            transform="rotate(39.7456 12.5552 18.1868)"
                                            fill="url(#paint6_radial_884_1431)" />
                                        <ellipse cx="12.5552" cy="18.1868" rx="8.13023" ry="2.91536"
                                            transform="rotate(39.7456 12.5552 18.1868)"
                                            fill="url(#paint7_radial_884_1431)" />
                                    </g>
                                    <circle cx="14.957" cy="16" r="1.20312" fill="url(#paint8_radial_884_1431)" />
                                    <circle cx="14.957" cy="16" r="1.20312" fill="url(#paint9_radial_884_1431)" />
                                    <circle cx="24.832" cy="22.9062" r="1.20312" fill="url(#paint10_radial_884_1431)" />
                                    <circle cx="24.832" cy="22.9062" r="1.20312" fill="url(#paint11_radial_884_1431)" />
                                    <circle cx="24.832" cy="22.9062" r="1.20312" fill="url(#paint12_radial_884_1431)" />
                                    <circle cx="23.8242" cy="7.01562" r="1.20312" fill="url(#paint13_radial_884_1431)" />
                                    <circle cx="23.8242" cy="7.01562" r="1.20312" fill="url(#paint14_radial_884_1431)" />
                                    <circle cx="9.99219" cy="3.36719" r="1.20312" fill="url(#paint15_radial_884_1431)" />
                                    <circle cx="9.99219" cy="3.36719" r="1.20312" fill="url(#paint16_radial_884_1431)" />
                                    <circle cx="9.99219" cy="3.36719" r="1.20312" fill="url(#paint17_radial_884_1431)" />
                                    <circle cx="4.92969" cy="8.10938" r="1.20312" fill="url(#paint18_radial_884_1431)" />
                                    <circle cx="4.92969" cy="8.10938" r="1.20312" fill="url(#paint19_radial_884_1431)" />
                                    <path
                                        d="M15.9543 26.0092C13.3483 25.8281 11.5205 25.0482 8.55924 22.6015C6.01183 20.4969 4.7471 18.6297 4.32498 16.7257L3.83594 19.5394C4.0358 20.6406 4.89518 22.1797 6.5983 23.7187C8.8258 25.7317 11.0436 27.1562 13.2369 27.0938C14.1396 26.7413 15.0435 26.3819 15.9543 26.0092Z"
                                        fill="url(#paint20_radial_884_1431)" />
                                    <path
                                        d="M10.4557 28.163C9.20325 28.2328 7.50944 27.211 5.75163 25.7501C4.25163 24.4532 3.51173 23.0442 3.356 22.2839L2.85938 25.1413C2.98222 25.6243 3.35633 26.2808 4.43913 27.3907C5.64992 28.6318 6.86752 29.1147 7.59059 29.252C8.10366 29.0565 8.61363 28.8629 9.12145 28.6701C9.56767 28.5007 10.0122 28.3319 10.4557 28.163Z"
                                        fill="url(#paint21_radial_884_1431)" />
                                    <g filter="url(#filter3_i_884_1431)">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M27.9034 13.1087C24.3055 12.4058 22.1796 14.0541 21.5057 14.7933C21.115 15.2219 20.4509 15.2526 20.0223 14.8619C19.5938 14.4712 19.5631 13.8071 19.9537 13.3786C20.9986 12.2324 23.8257 10.1724 28.306 11.0476C28.8752 11.1588 29.2464 11.7103 29.1352 12.2795C29.024 12.8486 28.4725 13.2199 27.9034 13.1087Z"
                                            fill="url(#paint22_radial_884_1431)" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M27.9034 13.1087C24.3055 12.4058 22.1796 14.0541 21.5057 14.7933C21.115 15.2219 20.4509 15.2526 20.0223 14.8619C19.5938 14.4712 19.5631 13.8071 19.9537 13.3786C20.9986 12.2324 23.8257 10.1724 28.306 11.0476C28.8752 11.1588 29.2464 11.7103 29.1352 12.2795C29.024 12.8486 28.4725 13.2199 27.9034 13.1087Z"
                                            fill="url(#paint23_radial_884_1431)" />
                                    </g>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M19.106 2.08235C19.6301 2.10686 20.0351 2.55159 20.0106 3.07569C19.9768 3.79727 19.8455 4.99934 19.532 6.28335C19.27 7.3566 18.8666 8.54699 18.2455 9.56757C18.3957 10.3638 18.3997 11.3033 18.2349 12.3715C18.1548 12.8901 17.6696 13.2455 17.1511 13.1655C16.6325 13.0855 16.2771 12.6003 16.3571 12.0817C16.394 11.8427 16.4201 11.6189 16.437 11.4094C16.2526 11.5055 16.0637 11.5809 15.8709 11.6348C15.1178 11.8452 14.3955 11.6994 13.8305 11.323C12.7571 10.6079 12.2622 9.04314 13.093 7.76387C13.8834 6.5469 15.5308 6.21602 16.7834 7.08187C16.9279 7.1817 17.0635 7.29419 17.1899 7.41901C17.3897 6.91359 17.554 6.37428 17.6862 5.83274C17.9674 4.68096 18.0839 3.6013 18.1127 2.98695C18.1372 2.46285 18.5819 2.05785 19.106 2.08235ZM16.1588 9.22284C16.0146 8.92253 15.8433 8.74178 15.7031 8.64483C15.3112 8.37396 14.8804 8.50011 14.6864 8.79877C14.4784 9.11902 14.5885 9.54491 14.8839 9.74171C15.0033 9.82127 15.1564 9.86165 15.3596 9.80486C15.5435 9.75348 15.825 9.60426 16.1588 9.22284Z"
                                        fill="url(#paint24_linear_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M19.106 2.08235C19.6301 2.10686 20.0351 2.55159 20.0106 3.07569C19.9768 3.79727 19.8455 4.99934 19.532 6.28335C19.27 7.3566 18.8666 8.54699 18.2455 9.56757C18.3957 10.3638 18.3997 11.3033 18.2349 12.3715C18.1548 12.8901 17.6696 13.2455 17.1511 13.1655C16.6325 13.0855 16.2771 12.6003 16.3571 12.0817C16.394 11.8427 16.4201 11.6189 16.437 11.4094C16.2526 11.5055 16.0637 11.5809 15.8709 11.6348C15.1178 11.8452 14.3955 11.6994 13.8305 11.323C12.7571 10.6079 12.2622 9.04314 13.093 7.76387C13.8834 6.5469 15.5308 6.21602 16.7834 7.08187C16.9279 7.1817 17.0635 7.29419 17.1899 7.41901C17.3897 6.91359 17.554 6.37428 17.6862 5.83274C17.9674 4.68096 18.0839 3.6013 18.1127 2.98695C18.1372 2.46285 18.5819 2.05785 19.106 2.08235ZM16.1588 9.22284C16.0146 8.92253 15.8433 8.74178 15.7031 8.64483C15.3112 8.37396 14.8804 8.50011 14.6864 8.79877C14.4784 9.11902 14.5885 9.54491 14.8839 9.74171C15.0033 9.82127 15.1564 9.86165 15.3596 9.80486C15.5435 9.75348 15.825 9.60426 16.1588 9.22284Z"
                                        fill="url(#paint25_radial_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M19.106 2.08235C19.6301 2.10686 20.0351 2.55159 20.0106 3.07569C19.9768 3.79727 19.8455 4.99934 19.532 6.28335C19.27 7.3566 18.8666 8.54699 18.2455 9.56757C18.3957 10.3638 18.3997 11.3033 18.2349 12.3715C18.1548 12.8901 17.6696 13.2455 17.1511 13.1655C16.6325 13.0855 16.2771 12.6003 16.3571 12.0817C16.394 11.8427 16.4201 11.6189 16.437 11.4094C16.2526 11.5055 16.0637 11.5809 15.8709 11.6348C15.1178 11.8452 14.3955 11.6994 13.8305 11.323C12.7571 10.6079 12.2622 9.04314 13.093 7.76387C13.8834 6.5469 15.5308 6.21602 16.7834 7.08187C16.9279 7.1817 17.0635 7.29419 17.1899 7.41901C17.3897 6.91359 17.554 6.37428 17.6862 5.83274C17.9674 4.68096 18.0839 3.6013 18.1127 2.98695C18.1372 2.46285 18.5819 2.05785 19.106 2.08235ZM16.1588 9.22284C16.0146 8.92253 15.8433 8.74178 15.7031 8.64483C15.3112 8.37396 14.8804 8.50011 14.6864 8.79877C14.4784 9.11902 14.5885 9.54491 14.8839 9.74171C15.0033 9.82127 15.1564 9.86165 15.3596 9.80486C15.5435 9.75348 15.825 9.60426 16.1588 9.22284Z"
                                        fill="url(#paint26_radial_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M19.106 2.08235C19.6301 2.10686 20.0351 2.55159 20.0106 3.07569C19.9768 3.79727 19.8455 4.99934 19.532 6.28335C19.27 7.3566 18.8666 8.54699 18.2455 9.56757C18.3957 10.3638 18.3997 11.3033 18.2349 12.3715C18.1548 12.8901 17.6696 13.2455 17.1511 13.1655C16.6325 13.0855 16.2771 12.6003 16.3571 12.0817C16.394 11.8427 16.4201 11.6189 16.437 11.4094C16.2526 11.5055 16.0637 11.5809 15.8709 11.6348C15.1178 11.8452 14.3955 11.6994 13.8305 11.323C12.7571 10.6079 12.2622 9.04314 13.093 7.76387C13.8834 6.5469 15.5308 6.21602 16.7834 7.08187C16.9279 7.1817 17.0635 7.29419 17.1899 7.41901C17.3897 6.91359 17.554 6.37428 17.6862 5.83274C17.9674 4.68096 18.0839 3.6013 18.1127 2.98695C18.1372 2.46285 18.5819 2.05785 19.106 2.08235ZM16.1588 9.22284C16.0146 8.92253 15.8433 8.74178 15.7031 8.64483C15.3112 8.37396 14.8804 8.50011 14.6864 8.79877C14.4784 9.11902 14.5885 9.54491 14.8839 9.74171C15.0033 9.82127 15.1564 9.86165 15.3596 9.80486C15.5435 9.75348 15.825 9.60426 16.1588 9.22284Z"
                                        fill="url(#paint27_radial_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13.8413 22.6062C13.1571 22.2279 12.4439 21.7697 11.7266 21.2407C12.8129 19.8942 14.7535 18.128 17.2837 16.8526C21.4412 14.757 26.0251 15.8944 27.893 16.6349C28.5347 16.8893 28.8488 17.6158 28.5943 18.2576C28.3399 18.8993 27.6134 19.2133 26.9717 18.9589C25.3708 18.3243 21.6271 17.4629 18.409 19.085C16.2865 20.1549 14.7083 21.5934 13.8413 22.6062Z"
                                        fill="url(#paint28_linear_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13.8413 22.6062C13.1571 22.2279 12.4439 21.7697 11.7266 21.2407C12.8129 19.8942 14.7535 18.128 17.2837 16.8526C21.4412 14.757 26.0251 15.8944 27.893 16.6349C28.5347 16.8893 28.8488 17.6158 28.5943 18.2576C28.3399 18.8993 27.6134 19.2133 26.9717 18.9589C25.3708 18.3243 21.6271 17.4629 18.409 19.085C16.2865 20.1549 14.7083 21.5934 13.8413 22.6062Z"
                                        fill="url(#paint29_radial_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13.8413 22.6062C13.1571 22.2279 12.4439 21.7697 11.7266 21.2407C12.8129 19.8942 14.7535 18.128 17.2837 16.8526C21.4412 14.757 26.0251 15.8944 27.893 16.6349C28.5347 16.8893 28.8488 17.6158 28.5943 18.2576C28.3399 18.8993 27.6134 19.2133 26.9717 18.9589C25.3708 18.3243 21.6271 17.4629 18.409 19.085C16.2865 20.1549 14.7083 21.5934 13.8413 22.6062Z"
                                        fill="url(#paint30_radial_884_1431)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M13.8413 22.6062C13.1571 22.2279 12.4439 21.7697 11.7266 21.2407C12.8129 19.8942 14.7535 18.128 17.2837 16.8526C21.4412 14.757 26.0251 15.8944 27.893 16.6349C28.5347 16.8893 28.8488 17.6158 28.5943 18.2576C28.3399 18.8993 27.6134 19.2133 26.9717 18.9589C25.3708 18.3243 21.6271 17.4629 18.409 19.085C16.2865 20.1549 14.7083 21.5934 13.8413 22.6062Z"
                                        fill="url(#paint31_radial_884_1431)" />
                                    <g filter="url(#filter4_i_884_1431)">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M10.1918 6.65341C9.85615 6.05016 9.095 5.83325 8.49175 6.16893C7.8885 6.50461 7.67159 7.26576 8.00727 7.86901C8.51417 8.77997 9.13831 10.066 9.21819 11.7218C9.2878 13.1649 8.94799 14.9952 7.56641 17.1906C8.04444 17.8233 8.6217 18.4789 9.28202 19.1301C11.2299 16.2966 11.8194 13.7587 11.7153 11.6014C11.6077 9.37053 10.7631 7.67996 10.1918 6.65341Z"
                                            fill="url(#paint32_radial_884_1431)" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M10.1918 6.65341C9.85615 6.05016 9.095 5.83325 8.49175 6.16893C7.8885 6.50461 7.67159 7.26576 8.00727 7.86901C8.51417 8.77997 9.13831 10.066 9.21819 11.7218C9.2878 13.1649 8.94799 14.9952 7.56641 17.1906C8.04444 17.8233 8.6217 18.4789 9.28202 19.1301C11.2299 16.2966 11.8194 13.7587 11.7153 11.6014C11.6077 9.37053 10.7631 7.67996 10.1918 6.65341Z"
                                            fill="url(#paint33_radial_884_1431)" />
                                    </g>
                                    <path
                                        d="M12.8555 8.21156C12.9169 8.05974 12.9945 7.90995 13.0893 7.76388C13.8797 6.54691 15.5271 6.21604 16.7797 7.08188C16.9242 7.18172 17.0598 7.2942 17.1862 7.41902C17.227 7.31575 17.2664 7.21107 17.3043 7.10524C17.3062 7.11164 17.308 7.11801 17.3098 7.12434C17.0525 7.93488 16.4751 8.80257 16.1543 9.22117C16.0103 8.92186 15.8394 8.74161 15.6994 8.64485C15.3075 8.37397 14.8767 8.50013 14.6828 8.79878C14.6752 8.8104 14.6681 8.82216 14.6614 8.83405L12.8555 8.21156Z"
                                        fill="url(#paint34_radial_884_1431)" />
                                    <path
                                        d="M12.8555 8.21156C12.9169 8.05974 12.9945 7.90995 13.0893 7.76388C13.8797 6.54691 15.5271 6.21604 16.7797 7.08188C16.9242 7.18172 17.0598 7.2942 17.1862 7.41902C17.227 7.31575 17.2664 7.21107 17.3043 7.10524C17.3062 7.11164 17.308 7.11801 17.3098 7.12434C17.0525 7.93488 16.4751 8.80257 16.1543 9.22117C16.0103 8.92186 15.8394 8.74161 15.6994 8.64485C15.3075 8.37397 14.8767 8.50013 14.6828 8.79878C14.6752 8.8104 14.6681 8.82216 14.6614 8.83405L12.8555 8.21156Z"
                                        fill="url(#paint35_radial_884_1431)" />
                                    <g filter="url(#filter5_i_884_1431)">
                                        <path
                                            d="M18.2397 9.56836C18.3897 10.3644 18.3937 11.3036 18.2289 12.3715C18.1488 12.89 17.6636 13.2455 17.1451 13.1654C16.6265 13.0854 16.2711 12.6002 16.3511 12.0817C16.3879 11.8431 16.414 11.6196 16.4309 11.4105C17.4128 10.794 18.0611 9.97364 18.2397 9.56836Z"
                                            fill="#44B6FF" />
                                    </g>
                                    <path
                                        d="M18.2397 9.56836C18.3897 10.3644 18.3937 11.3036 18.2289 12.3715C18.1488 12.89 17.6636 13.2455 17.1451 13.1654C16.6265 13.0854 16.2711 12.6002 16.3511 12.0817C16.3879 11.8431 16.414 11.6196 16.4309 11.4105C17.4128 10.794 18.0611 9.97364 18.2397 9.56836Z"
                                        fill="url(#paint36_radial_884_1431)" />
                                    <g filter="url(#filter6_f_884_1431)">
                                        <path
                                            d="M16.5487 8.1718C16.2831 7.81244 15.4315 7.1718 14.3612 7.83583C14.0022 8.0586 13.7909 8.89836 13.955 9.46867"
                                            stroke="url(#paint37_linear_884_1431)" stroke-width="0.3"
                                            stroke-linecap="round" />
                                    </g>
                                    <g filter="url(#filter7_f_884_1431)">
                                        <path d="M19.4727 3.01562C19.3893 4.52604 18.7352 8.09063 16.7852 10.2656"
                                            stroke="url(#paint38_linear_884_1431)" stroke-width="0.3"
                                            stroke-linecap="round" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_i_884_1431" x="2.57422" y="11.6755" width="17.1602"
                                            height="18.2843" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dy="-0.5" />
                                            <feGaussianBlur stdDeviation="0.5" />
                                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0.92549 0 0 0 0 0.34902 0 0 0 0 0.384314 0 0 0 1 0" />
                                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_884_1431" />
                                        </filter>
                                        <filter id="filter1_f_884_1431" x="4.69922" y="11.9131" width="15.2031"
                                            height="13.4214" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feGaussianBlur stdDeviation="0.25" result="effect1_foregroundBlur_884_1431" />
                                        </filter>
                                        <filter id="filter2_f_884_1431" x="5.83125" y="12.3244" width="13.4508"
                                            height="11.7248" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feGaussianBlur stdDeviation="0.1" result="effect1_foregroundBlur_884_1431" />
                                        </filter>
                                        <filter id="filter3_i_884_1431" x="19.6797" y="10.5868" width="9.72656"
                                            height="4.54919" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dx="0.25" dy="-0.25" />
                                            <feGaussianBlur stdDeviation="0.25" />
                                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0.721569 0 0 0 0 0.270588 0 0 0 0 0.470588 0 0 0 1 0" />
                                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_884_1431" />
                                        </filter>
                                        <filter id="filter4_i_884_1431" x="7.56641" y="6.01099" width="4.31016"
                                            height="13.3691" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dx="0.15" dy="0.25" />
                                            <feGaussianBlur stdDeviation="0.5" />
                                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0.721569 0 0 0 0 0.184314 0 0 0 0 0.447059 0 0 0 1 0" />
                                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_884_1431" />
                                        </filter>
                                        <filter id="filter5_i_884_1431" x="16.3398" y="9.31836" width="2.51172"
                                            height="3.8584" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feColorMatrix in="SourceAlpha" type="matrix"
                                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dx="0.5" dy="-0.25" />
                                            <feGaussianBlur stdDeviation="0.325" />
                                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                            <feColorMatrix type="matrix"
                                                values="0 0 0 0 0.239216 0 0 0 0 0.439216 0 0 0 0 0.768627 0 0 0 1 0" />
                                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_884_1431" />
                                        </filter>
                                        <filter id="filter6_f_884_1431" x="13.45" y="7.09709" width="3.54922"
                                            height="2.82156" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feGaussianBlur stdDeviation="0.15" result="effect1_foregroundBlur_884_1431" />
                                        </filter>
                                        <filter id="filter7_f_884_1431" x="16.1867" y="2.4156" width="3.88437"
                                            height="8.45005" filterUnits="userSpaceOnUse"
                                            color-interpolation-filters="sRGB">
                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix"
                                                result="shape" />
                                            <feGaussianBlur stdDeviation="0.225" result="effect1_foregroundBlur_884_1431" />
                                        </filter>
                                        <linearGradient id="paint0_linear_884_1431" x1="4.22176" y1="19.9844" x2="12.2843"
                                            y2="26.9844" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#B3843C" />
                                            <stop offset="1" stop-color="#F17A61" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_884_1431" x1="3.33085" y1="21.0677" x2="5.69051"
                                            y2="21.5469" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#B1853B" />
                                            <stop offset="1" stop-color="#B1853B" stop-opacity="0" />
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_884_1431" x1="19.7359" y1="23.8281" x2="15.753"
                                            y2="24.4844" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#F9C26C" />
                                            <stop offset="1" stop-color="#F9C26C" stop-opacity="0" />
                                        </linearGradient>
                                        <linearGradient id="paint3_linear_884_1431" x1="11.1551" y1="12.3906" x2="8.59676"
                                            y2="16.7344" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#E6BF69" />
                                            <stop offset="1" stop-color="#E6BF69" stop-opacity="0" />
                                        </linearGradient>
                                        <linearGradient id="paint4_linear_884_1431" x1="12.3246" y1="21.8038" x2="13.3536"
                                            y2="14.9232" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#FCCB57" />
                                            <stop offset="1" stop-color="#F5BD55" />
                                        </linearGradient>
                                        <linearGradient id="paint5_linear_884_1431" x1="5.1481" y1="17.8646" x2="21.628"
                                            y2="18.6701" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#F3AB2C" />
                                            <stop offset="1" stop-color="#B57F1E" />
                                        </linearGradient>
                                        <radialGradient id="paint6_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(8.45427 20.5208) rotate(-109.125) scale(6.4775 1.81427)">
                                            <stop offset="0.423414" stop-color="#CA851E" />
                                            <stop offset="1" stop-color="#CA851E" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint7_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(15.2361 20.612) rotate(-73.0972) scale(6.50954 3.81205)">
                                            <stop stop-color="#BC7F28" />
                                            <stop offset="1" stop-color="#BC7F28" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint8_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(15.4883 15.6719) rotate(138.668) scale(1.72711)">
                                            <stop stop-color="#5AC0FF" />
                                            <stop offset="1" stop-color="#3279B6" />
                                        </radialGradient>
                                        <radialGradient id="paint9_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(15.1937 15.8342) rotate(160.051) scale(1.73439 1.90111)">
                                            <stop offset="0.534713" stop-color="#3A619E" stop-opacity="0" />
                                            <stop offset="1" stop-color="#3A619E" />
                                        </radialGradient>
                                        <radialGradient id="paint10_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(25.5292 22.3978) rotate(134.569) scale(1.97753)">
                                            <stop stop-color="#FDD46C" />
                                            <stop offset="1" stop-color="#F09C53" />
                                        </radialGradient>
                                        <radialGradient id="paint11_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(25.0561 22.2927) rotate(100.827) scale(1.95883)">
                                            <stop offset="0.792052" stop-color="#E76260" stop-opacity="0" />
                                            <stop offset="0.964251" stop-color="#E76260" />
                                        </radialGradient>
                                        <radialGradient id="paint12_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(25.4061 23.1048) rotate(-147.558) scale(1.98371 2.33609)">
                                            <stop offset="0.482355" stop-color="#AA885A" stop-opacity="0" />
                                            <stop offset="0.90682" stop-color="#AA885A" />
                                        </radialGradient>
                                        <radialGradient id="paint13_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(24.6858 6.54746) rotate(132.387) scale(2.06012)">
                                            <stop stop-color="#FF46AA" />
                                            <stop offset="1" stop-color="#E3189D" />
                                        </radialGradient>
                                        <radialGradient id="paint14_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(24.332 7.23437) rotate(-173.29) scale(1.8722 2.50559)">
                                            <stop offset="0.522105" stop-color="#B63173" stop-opacity="0" />
                                            <stop offset="1" stop-color="#B63173" />
                                        </radialGradient>
                                        <radialGradient id="paint15_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(10.7805 2.8856) rotate(139.574) scale(1.84118)">
                                            <stop stop-color="#FFF46F" />
                                            <stop offset="1" stop-color="#EFB93C" />
                                        </radialGradient>
                                        <radialGradient id="paint16_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(10.5172 3.17236) rotate(-178.519) scale(1.91464 1.82297)">
                                            <stop offset="0.558644" stop-color="#AA904B" stop-opacity="0" />
                                            <stop offset="0.943632" stop-color="#AA904B" />
                                        </radialGradient>
                                        <radialGradient id="paint17_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(10.3011 2.6875) rotate(102.339) scale(2.04729)">
                                            <stop offset="0.771901" stop-color="#C47072" stop-opacity="0" />
                                            <stop offset="1" stop-color="#C47072" />
                                        </radialGradient>
                                        <radialGradient id="paint18_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(5.79127 7.64121) rotate(132.387) scale(2.06012)">
                                            <stop stop-color="#FF46AA" />
                                            <stop offset="1" stop-color="#E3189D" />
                                        </radialGradient>
                                        <radialGradient id="paint19_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(5.4375 8.32812) rotate(-173.29) scale(1.8722 2.50559)">
                                            <stop offset="0.522105" stop-color="#B63173" stop-opacity="0" />
                                            <stop offset="1" stop-color="#B63173" />
                                        </radialGradient>
                                        <radialGradient id="paint20_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(11.2233 25.0781) rotate(133.21) scale(4.24471 9.2935)">
                                            <stop stop-color="#3365FF" />
                                            <stop offset="1" stop-color="#356DB9" />
                                        </radialGradient>
                                        <radialGradient id="paint21_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(7.40787 28.0157) rotate(131.598) scale(2.62017 6.62793)">
                                            <stop stop-color="#3365FF" />
                                            <stop offset="1" stop-color="#356DB9" />
                                        </radialGradient>
                                        <radialGradient id="paint22_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(27.5344 11.8907) rotate(168.283) scale(4.30854 1.60742)">
                                            <stop stop-color="#FF3BA9" />
                                            <stop offset="1" stop-color="#F422A7" />
                                        </radialGradient>
                                        <radialGradient id="paint23_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(24.4173 15.3282) rotate(-127.355) scale(4.44241 7.91727)">
                                            <stop offset="0.752144" stop-color="#B8306F" stop-opacity="0" />
                                            <stop offset="1" stop-color="#B8306F" />
                                        </radialGradient>
                                        <linearGradient id="paint24_linear_884_1431" x1="19.0642" y1="2.0813" x2="14.5824"
                                            y2="12.823" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#20B2EE" />
                                            <stop offset="1" stop-color="#2689DA" />
                                        </linearGradient>
                                        <radialGradient id="paint25_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(18.0805 5.57071) rotate(128.217) scale(7.76064 4.747)">
                                            <stop offset="0.80204" stop-color="#4274D2" stop-opacity="0" />
                                            <stop offset="0.950917" stop-color="#4274D2" />
                                        </radialGradient>
                                        <radialGradient id="paint26_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(17.6923 4.67194) rotate(12.0948) scale(1.11858 3.75515)">
                                            <stop stop-color="#4D8EC0" />
                                            <stop offset="1" stop-color="#4D8EC0" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint27_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(19.911 2.25006) rotate(141.953) scale(1.36904 1.23086)">
                                            <stop stop-color="#5ADEFF" />
                                            <stop offset="1" stop-color="#5ADEFF" stop-opacity="0" />
                                        </radialGradient>
                                        <linearGradient id="paint28_linear_884_1431" x1="14.4501" y1="21.6949" x2="27.8592"
                                            y2="18.1808" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#3797E2" />
                                            <stop offset="1" stop-color="#37AEFF" />
                                        </linearGradient>
                                        <radialGradient id="paint29_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(19.4101 23.8875) rotate(-129.838) scale(7.98002 20.0036)">
                                            <stop offset="0.622552" stop-color="#526579" stop-opacity="0" />
                                            <stop offset="0.962126" stop-color="#526579" />
                                        </radialGradient>
                                        <radialGradient id="paint30_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(23.8919 19.5807) rotate(94.3987) scale(2.7392 5.50719)">
                                            <stop offset="0.396078" stop-color="#6972FF" />
                                            <stop offset="1" stop-color="#6972FF" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint31_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(27.9536 17.2785) rotate(-68.8186) scale(0.75103 0.592274)">
                                            <stop stop-color="#55BFFF" />
                                            <stop offset="1" stop-color="#55BFFF" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint32_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(10.8437 6.43632) rotate(99.4229) scale(7.31184 2.7393)">
                                            <stop stop-color="#FF3AAA" />
                                            <stop offset="1" stop-color="#FD2F89" />
                                        </radialGradient>
                                        <radialGradient id="paint33_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(7.02611 13.9762) rotate(31.1757) scale(4.80845 15.0903)">
                                            <stop offset="0.803698" stop-color="#DB2C6E" stop-opacity="0" />
                                            <stop offset="1" stop-color="#DB2C6E" />
                                        </radialGradient>
                                        <radialGradient id="paint34_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(16.4198 9.51967) rotate(-119.23) scale(2.73834 2.04693)">
                                            <stop stop-color="#336BAF" />
                                            <stop offset="1" stop-color="#336BAF" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint35_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(17.3098 7.45309) rotate(-127.657) scale(1.85511 0.751608)">
                                            <stop stop-color="#49A4D4" />
                                            <stop offset="1" stop-color="#49A4D4" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint36_radial_884_1431" cx="0" cy="0" r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(18.1415 9.48437) rotate(94.8498) scale(2.58739 1.44)">
                                            <stop stop-color="#4AB5F8" />
                                            <stop offset="1" stop-color="#4AB5F8" stop-opacity="0" />
                                        </radialGradient>
                                        <linearGradient id="paint37_linear_884_1431" x1="13.5956" y1="8.18923" x2="16.3768"
                                            y2="7.50769" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#4EAFF2" />
                                            <stop offset="1" stop-color="#4EAFF2" stop-opacity="0" />
                                        </linearGradient>
                                        <linearGradient id="paint38_linear_884_1431" x1="19.2539" y1="1.95312" x2="15.3477"
                                            y2="10.9531" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#5BDDFF" />
                                            <stop offset="1" stop-color="#5BDDFF" stop-opacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div class="text marquee">
                                <p class="rotate">
                                    We're thrilled to announce that HYPD has raised $4 million in
                                    pre-series A funding to enable creator-driven commerce
                                </p>
                                <span class="shadow"></span>
                            </div>
                        </div>
                        <div class="read-more" @click="readMore">
                            <div class="read">Read More</div>
                            <div class="arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.4297 5.93005L20.4997 12.0001L14.4297 18.0701" stroke="white"
                                        stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M3.5 12H20.33" stroke="white" stroke-width="1.5" stroke-miterlimit="10"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    name: "CreatorStore",
    layout: "public",
});
// import * as tracking from "../eventTracking";
import {
    getReplacedSource,
    defaultProfileImage,
    optimizeImage,
} from "~/utils/helperMethods";

import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const creatorStore = useCreatorStore();

const creator = ref({});

if (route.params.creatorUsername) {
    const { data, pending: loadingCreatorInfo } = await useFetch(
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
    twitterCard: "summary_large_image",
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
const currentPage = ref("CreatorCollections");

// computed
const creatorProfilePic = computed(() => {
    return optimizeImage(creator.value?.profile_image?.src, 350);
});

function readMore() {
    window.open(
        "https://www.linkedin.com/posts/hypdin_fundingalert-creatorseconomy-creatorcommerce-activity-7059102596665384961-fZ1g?utm_source=share&utm_medium=member_ios"
    );
}

function redirectToBWB(path) {
    let url = path.split(this.$base)[1];
    window.open(`${this.$base}/${creator.value.username}${url}`, "_self");
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
    currentPage.value = options;
    router.push({ name: options });
    document.getElementById("creator-store-section").scrollTop = {
        top: 0,
        behavior: "smooth",
    };
}

function follow_author() {
    if (props.user) {
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
                        customer_id: props.user.customer_id,
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
            let current_url = route.path;
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
                    customer_id: props.user.customer_id,
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
    // Attaching Listener on while component is mounted
    window.addEventListener("resize", checkDevice);
});

onBeforeMount(() => {
    getBOTD();
});
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
    margin: 10px auto;
    max-width: 980px;
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
    top: 56px;
    z-index: 5;
    /* padding: 10px 0 0; */
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
        max-width: 980px;
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
    padding-top: 8px;
    font-size: 18px;
    margin: 8px 0 5px 0;
    font-family: Urbanist-Medium;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: -2px;
}

.creator-contents div {
    width: 10%;
    min-width: 120px;
    cursor: pointer;
}

.active-creator-contents {
    color: #13141b;
    padding-bottom: 6px;
    border-bottom: 3px solid #13141b;
    border-radius: 3px;
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
    max-width: 980px;
    margin: 0 0 0 18px;
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
    width: calc(100% - 6px);
}

.single-botdImg {
    object-fit: cover;
    border-radius: 20px;
    width: calc(100% - 28px);
    margin-left: 14px;
}

@media screen and (max-width: 480px) {
    .botd {
        /* position: relative; */
        margin: 18px 0 0;
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

.collection-contents {
    min-height: calc(100dvh - 334px);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(283px, 1fr));
    gap: 15px;
    row-gap: 16px;
    padding-bottom: 20px;
    justify-items: center;
    max-width: 980px;
    margin: 16px 0 0 0;
    width: 100dvw;
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
