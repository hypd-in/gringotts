<template>
  <div class="header">
    <section class="desktop-header">
      <div class="logo">HYPD.</div>
      <div class="search-input-bar">
        <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
            stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M22 22L20 20" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <input v-model="searchInputQuery" @keypress.enter="goToExplore" type="text"
          placeholder="What are you looking for?" />
        <img @click="searchInputQuery = ''" v-if="searchInputQuery.length > 0" class="close-icon"
          src="/assets/icons/misc/close.svg" alt="close" />
      </div>

      <div class="header-action-btns">
        <button @click="toggleWishlist" class="wishlist-desktop action-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
              stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <span>Wishlist</span>
        </button>
        <button @click="goToCart" class="cart-desktop action-btn">
          <div class="icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.63 2H3.37001C4.45001 2 5.30001 2.93 5.21001 4V13.96C5.07001 15.59 6.36 16.99 8 16.99H18.65C20.09 16.99 21.35 15.81 21.46 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H16"
                stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M17.25 22C17.9404 22 18.5 21.4404 18.5 20.75C18.5 20.0596 17.9404 19.5 17.25 19.5C16.5596 19.5 16 20.0596 16 20.75C16 21.4404 16.5596 22 17.25 22Z"
                stroke="#292D32" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M9.25 22C9.94036 22 10.5 21.4404 10.5 20.75C10.5 20.0596 9.94036 19.5 9.25 19.5C8.55964 19.5 8 20.0596 8 20.75C8 21.4404 8.55964 22 9.25 22Z"
                stroke="#292D32" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 8H21" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>

            <span v-if="noOfCartItems > 0" class="number">{{
              noOfCartItems
            }}</span>
          </div>
          <span>Cart</span>
        </button>
        <button @click="openDropDown" :class="{ 'sign-in-btn': !store.user?.id }" class="profile-desktop action-btn">
          <span v-if="!store.user?.id">Sign in</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18.1399 21.62C17.2599 21.88 16.2199 22 14.9999 22H8.99986C7.77986 22 6.73986 21.88 5.85986 21.62C6.07986 19.02 8.74986 16.97 11.9999 16.97C15.2499 16.97 17.9199 19.02 18.1399 21.62Z"
              stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z"
              stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M15.5799 10.58C15.5799 12.56 13.9799 14.17 11.9999 14.17C10.0199 14.17 8.41992 12.56 8.41992 10.58C8.41992 8.60002 10.0199 7 11.9999 7C13.9799 7 15.5799 8.60002 15.5799 10.58Z"
              stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span v-if="store.user?.id"> Profile </span>
        </button>
        <DropDown @close="showDropDown = false" v-if="showDropDown" />
      </div>
    </section>
    <!-- <Wishlist @close="toggleWishlist" v-if="showWishlist" /> -->
    <section class="mobile-header">
      <div class="back-btn">
        <button @click="goBack" class="back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 12L2 12" stroke="#13141B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 12C5.25 11 7.25 9 8 6" stroke="#13141B" stroke-width="1.5" stroke-linecap="round" />
            <path d="M2 12C5.25 13 7.25 15 8 18" stroke="#13141B" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <div class="header-items">
        <button @click="goToExplore" v-if="route.params.creatorUsername || creatorStore?.info?.username" class="search">
          <ExploreButton :class="{ dark: darkMode }" />
        </button>
        <button @click="toggleWishlist" class="wishlist">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
              stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button class="cart" @click="goToCart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.63 2H3.37001C4.45001 2 5.30001 2.93 5.21001 4V13.96C5.07001 15.59 6.36 16.99 8 16.99H18.65C20.09 16.99 21.35 15.81 21.46 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H16"
              stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M17.25 22C17.9404 22 18.5 21.4404 18.5 20.75C18.5 20.0596 17.9404 19.5 17.25 19.5C16.5596 19.5 16 20.0596 16 20.75C16 21.4404 16.5596 22 17.25 22Z"
              stroke="#292D32" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M9.25 22C9.94036 22 10.5 21.4404 10.5 20.75C10.5 20.0596 9.94036 19.5 9.25 19.5C8.55964 19.5 8 20.0596 8 20.75C8 21.4404 8.55964 22 9.25 22Z"
              stroke="#292D32" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 8H21" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>

          <span v-if="noOfCartItems > 0" class="number">{{
            noOfCartItems
          }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import DropDown from "~/components/HeaderDropDown.vue";
// import Wishlist from "@/components/WishlistComponent.vue";
import ExploreButton from "@/components/ExploreComponents/ExploreButton.vue";
import { getCreatorUserName } from "~/utils/helperMethods";

const props = defineProps({
  darkMode: Boolean,
});

const router = useRouter();
const route = useRoute();
const store = useStore();
const product = useProductStore();
const creatorStore = useCreatorStore();

const searchInputQuery = ref("");
const showDropDown = ref(false);
const showWishlist = ref(false);

const noOfCartItems = computed(() => {
  return store.cartInfo.items?.length || 0;
});

async function goBack() {
  if (!router.options.history.state.back) {
    var creatorUsername = await getCreatorUserName();
    navigateTo({
      name: "CreatorStore",
      params: {
        creator_username: creatorUsername,
      },
    });
  } else {
    router.go(-1);
  }
}

function toggleWishlist() {
  if (!store.user?.id) {
    var flag = confirm(
      "Looks like you're not logged in. Let's get you logged in, first?"
    );
    if (flag) {
      navigateTo({
        name: "login",
        params: route.params,
        query: {
          redirection_url: route.fullPath,
        },
      });
      return;
    }
  } else {
    showWishlist.value = !showWishlist.value;
  }
}

function goToCart() {
  navigateTo({
    name: "CartItems",
  });
}
function goToExplore() {
  if (route.params.creatorUsername) {
    navigateTo({
      name: "HypdExplore",
      params: {
        creatorUsername: route.params.creatorUsername
      },
      query: {
        query: searchInputQuery.value,
      },
    })
  }
}

function openDropDown() {
  if (!store.user?.id) {
    navigateTo({
      name: "login",
      query: {
        redirection_url: route.fullPath,
      },
    });
  } else {
    showDropDown.value = true;
  }
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .header {
    z-index: 52 !important;
    height: 58px !important;
  }

  .mobile-header {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    box-sizing: border-box;
    background: none;
    width: 100dvw;
    height: 100%;
  }

  .desktop-header {
    display: none !important;
  }
}

.header {
  position: relative;
  z-index: 2;
  height: 72px;
  border-bottom: 1px solid var(--primary-border-color);
}

.desktop-header {
  display: grid;
  grid-template-columns: 70px calc(100% - 70px - 32px - 200px - 64px) 232px;
  gap: 32px;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  padding: 11px 32px;
  box-sizing: border-box;
  background: var(--plian-white, #fff);

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
}

.desktop-header .logo {
  color: #13141b;
  font-family: Ginger-Regular;
  font-size: 24px;
  line-height: 20px;
  cursor: pointer;
}

.search-input-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  box-sizing: border-box;
  background: #fafafa;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 580px;
  width: 100%;
  justify-self: center;
}

.search-input-bar .close-icon,
.search-input-bar .search-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  cursor: default;
  user-select: none;
}

.desktop-header input {
  outline: none;
  border: none;
  background: none;
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.2px;
  text-align: left;
  width: 100%;
}

input::placeholder {
  color: #a9a9a9;
}

.sign-in-btn {
  flex-direction: row !important;
  background: var(--primary-orange);
  padding: 10px 16px !important;
  gap: 12px;
  box-sizing: border-box;
  max-width: 120px;

  color: #fff;
  font-family: Urbanist-Bold !important;
  font-size: 14px !important;
  white-space: nowrap;
}

.sign-in-btn svg path {
  stroke: #fff;
}

.header-action-btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  padding: 0;
  font-family: Urbanist-Bold;
  font-size: 10px;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: center;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-header {
  display: none;
}

.header-items {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

button {
  /* padding: 4px; */
  background: var(--plian-white, #fff);
  border-radius: 8px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 52;
}

.action-btn img,
.action-btn svg {
  width: 18px;
  height: 18px;
}

.number {
  position: absolute;
  top: -7px;
  right: -7px;

  background: var(--red);
  padding: 2px;
  border-radius: 50%;
  width: 10px;
  height: 10px;

  font-family: "Urbanist-Regular";
  font-size: 8px;
  line-height: 8px;
  color: var(--plian-white, #fff);

  display: flex;
  align-items: center;
  justify-content: center;
}

.basic .mobile-header {
  background: var(--plian-white, #fff);
}

.basic .mobile-header button {
  border: none;
}

.dark section {
  background: #000 !important;
  color: #fff !important;
  border-bottom: 1px solid #272727;
}

.dark .logo,
.dark .action-btn,
.dark button {
  color: #fff;
  background: none;
}

.dark .search-input-bar {
  background: #ffffff1a;
  color: #fff !important;
  border: 1px solid #ffffff1a;
}

.dark:deep() svg path {
  stroke: #fff;
}

.dark input {
  color: #fff;
}
</style>