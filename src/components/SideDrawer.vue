<template>
  <div class="side-drawer" v-if="store.user?.id">
    <section class="user-info-wrapper">
      <NuxtImg class="profile-image" style="border-radius: 16px; object-fit: cover;" :placeholder="[30, 30, 50, 20]"
        v-if="userProfileImage" :src="userProfileImage" />
      <div class="user-info">
        <h2>{{ userFullName }}</h2>
        <h3>
          {{
            `${store.user?.phone_no?.prefix} ${store.user?.phone_no?.number}`
          }}
        </h3>
      </div>

      <button @click="goToEditProfile" v-if="store.user?.id" class="link">
        Edit Profile
      </button>
    </section>

    <section class="menu-items">
      <div :class="{ 'active-item': route.name == item.path }" class="item-wrapper" @click="redirectToPath(item.path)"
        v-for="item in menuItems" :key="item.name">
        <div class="icon" v-html="item.icon"></div>
        <div class="active-icon" v-html="item.activeIcon"></div>

        <div class="item-name">
          {{ item?.name }}
        </div>
      </div>
    </section>

    <section class="logout" v-if="store.user?.id">
      <button @click="logout" class="logout-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="vuesax/linear/logout">
            <g>
              <path id="Vector"
                d="M8.40234 7.59847C8.72255 4.02937 10.6335 2.57199 14.817 2.57199H14.9512C19.5685 2.57199 21.4175 4.34663 21.4175 8.77826V15.2423C21.4175 19.6739 19.5685 21.4486 14.9512 21.4486H14.817C10.6645 21.4486 8.75354 20.011 8.41267 16.5014"
                stroke="#585858" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path id="Vector_2" d="M15.2667 12H3.51172" stroke="#585858" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path id="Vector_3" d="M6.04242 8.54001L2.58203 12.0004L6.04242 15.4608" stroke="#585858" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>
        </svg>

        Logout
      </button>
    </section>

    <button v-if="!showAddresses" @click="emit('closeDrawer')" class="close-btn">
      <img src="~/assets/icons/misc/close.svg" alt="">
    </button>

    <AddressComponent @close="toggleMyAddresses" v-if="showAddresses" />
  </div>

  <div v-else class="side-drawer">
    <div class="no-user">
      <div class="illustration">
        <img src="@/assets/illustrations/no-orders.png" alt="">
      </div>
      <div class="content">
        <h2>Looks like you're not logged in!</h2>
        <p>Let's get you logged in?</p>
      </div>
      <SubmitButton default-text="Go To Login" @submit="navigateToLogin"/>
    </div>
  </div>
</template>

<script setup>
// import ImageFrame from "../ImageFrame.vue";
import AddressComponent from "@/components/UserAddresses/AddressComponent.vue";
import SubmitButton from "./SubmitButton.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const creatorStore = useCreatorStore();
const emit = defineEmits(["closeDrawer"]);


const userProfileImage = computed(() => {
  if (store.user?.profile_image?.src) {
    return getReplacedSource(store.user?.profile_image?.src);
  } else {
    return "/illustrations/default_user.png"
  }
});

const userFullName = computed(() => {
  if (store.user?.full_name != "") {
    return store.user?.full_name;
  } else {
    return "Hello Shopper!";
  }
});

const showAddresses = ref(false);
const menuItems = ref([
  {
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.17004 7.43994L12 12.5499L20.77 7.46991" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 21.6099V12.5399" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17 13.24V9.58002L7.51001 4.09998" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activeIcon:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.17004 7.43994L12 12.5499L20.77 7.46991" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 21.6099V12.5399" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17 13.24V9.58002L7.51001 4.09998" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    name: "My Orders",
    path: "Orders",
  },
  {
    icon: '<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 9.93404V15.934C22 18.434 21.5 20.184 20.38 21.314L14 14.934L21.73 7.20404C21.91 7.99404 22 8.89404 22 9.93404Z" stroke="#12141B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.73 7.20403L6.26999 22.664C3.25999 21.974 2 19.894 2 15.934V9.93402C2 4.93402 4 2.93402 9 2.93402H15C18.96 2.93402 21.04 4.19403 21.73 7.20403Z" stroke="#12141B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.3795 21.314C19.2495 22.434 17.4995 22.934 14.9995 22.934H8.99954C7.95954 22.934 7.05953 22.844 6.26953 22.664L13.9995 14.934L20.3795 21.314Z" stroke="#12141B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.23929 8.91405C6.91929 5.98405 11.3193 5.98405 11.9993 8.91405C12.3893 10.6341 11.3093 12.0941 10.3593 12.9941C9.66928 13.6541 8.5793 13.6541 7.8793 12.9941C6.9293 12.0941 5.83929 10.6341 6.23929 8.91405Z" stroke="#12141B" stroke-width="1.5"/><path d="M9.09412 9.63403H9.1031" stroke="#12141B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activeIcon:
      '<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 9.93404V15.934C22 18.434 21.5 20.184 20.38 21.314L14 14.934L21.73 7.20404C21.91 7.99404 22 8.89404 22 9.93404Z" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.73 7.20403L6.26999 22.664C3.25999 21.974 2 19.894 2 15.934V9.93402C2 4.93402 4 2.93402 9 2.93402H15C18.96 2.93402 21.04 4.19403 21.73 7.20403Z" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.3795 21.314C19.2495 22.434 17.4995 22.934 14.9995 22.934H8.99954C7.95954 22.934 7.05953 22.844 6.26953 22.664L13.9995 14.934L20.3795 21.314Z" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.23929 8.91405C6.91929 5.98405 11.3193 5.98405 11.9993 8.91405C12.3893 10.6341 11.3093 12.0941 10.3593 12.9941C9.66928 13.6541 8.5793 13.6541 7.8793 12.9941C6.9293 12.0941 5.83929 10.6341 6.23929 8.91405Z" stroke="#fb6c23" stroke-width="1.5"/><path d="M9.09412 9.63403H9.1031" stroke="#fb6c23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    name: "My Addresses",
    path: "MyAddresses",
  },

  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 15 16.75"><path id="icon" d="M11.5,2A7.522,7.522,0,0,0,4,9.5v1.875A3.1,3.1,0,0,0,7.125,14.5a.59.59,0,0,0,.625-.625v-5a.59.59,0,0,0-.625-.625,3.025,3.025,0,0,0-1.813.625,6.216,6.216,0,0,1,12.375,0,3.025,3.025,0,0,0-1.812-.625.59.59,0,0,0-.625.625v5a.59.59,0,0,0,.625.625A2.288,2.288,0,0,0,17,14.25a6.377,6.377,0,0,1-3.062,2.812,1.61,1.61,0,0,0-1.562-1.375,1.521,1.521,0,0,0-1.5,1.5,1.588,1.588,0,0,0,1.562,1.563h.25A7.469,7.469,0,0,0,19,11.375V9.5A7.522,7.522,0,0,0,11.5,2Z" transform="translate(-4 -2)" fill="#293D32" /></svg>',
    activeIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 15 16.75"><path id="icon" d="M11.5,2A7.522,7.522,0,0,0,4,9.5v1.875A3.1,3.1,0,0,0,7.125,14.5a.59.59,0,0,0,.625-.625v-5a.59.59,0,0,0-.625-.625,3.025,3.025,0,0,0-1.813.625,6.216,6.216,0,0,1,12.375,0,3.025,3.025,0,0,0-1.812-.625.59.59,0,0,0-.625.625v5a.59.59,0,0,0,.625.625A2.288,2.288,0,0,0,17,14.25a6.377,6.377,0,0,1-3.062,2.812,1.61,1.61,0,0,0-1.562-1.375,1.521,1.521,0,0,0-1.5,1.5,1.588,1.588,0,0,0,1.562,1.563h.25A7.469,7.469,0,0,0,19,11.375V9.5A7.522,7.522,0,0,0,11.5,2Z" transform="translate(-4 -2)" fill="#fb6c23" /></svg>',
    name: "Help Center",
    path: "ContactUs",
  },
]);

function toggleMyAddresses() {
  showAddresses.value = !showAddresses.value;
}

function goToEditProfile() {
  navigateTo({
    name: "EditProfile",
  });
}

function navigateToLogin() {
  navigateTo({
    name: "Login",
    query: {
      'redirection_url': router.currentRoute.fullPath,
    }
  })
}

function redirectToPath(pathName) {
  if (route.name == pathName) {
    emit("closeDrawer");
  } else if (pathName == "MyAddresses") {
    toggleMyAddresses();
  } else {
    router.push({
      name: pathName,
    });
  }
}

async function logout() {
  logoutUser({
    name: "CreatorStore",
    params: {
      creatorUsername: await getCreatorUserName(),
    },
  });
  return;
}
</script>

<style scoped>
.side-drawer {
  position: fixed;
  top: 0;
  left: -100vw;
  left: -100dvw;
  transition: all 0.45s ease;
  width: 100vw;
  height: 100vh;
  width: 100dvw;
  height: 100dvh;
  box-sizing: border-box;
  background: var(--plain-white, #fff);
  z-index: 100;
  padding: 16px;
}

.side-drawer * {
  box-sizing: border-box;
}

.user-info-wrapper {
  display: grid;
  grid-template-columns: 70px calc(100% - 140px - 24px) 70px;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  margin: 42px 0 0;
}

.user-info-wrapper .profile-image {
  width: 70px;
  height: 70px;
  aspect-ratio: 1/1;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h2 {
  color: #12141b;
  font-family: Urbanist-SemiBold;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.21px;
}

h3 {
  color: #585858;
  font-family: Edmondsans-M;
  font-size: 16px;
  line-height: 24px;
}

.link {
  color: #2597df;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 21px;
  white-space: nowrap;
  background: var(--plain-white, #fff);
}

.link:hover {
  text-decoration: underline;
}

section.menu-items {
  margin: 32px 0 0;
}

.item-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;

  white-space: nowrap;
  color: #585858;
  font-family: Urbanist-SemiBold;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.21px;

  width: calc(100dvw - 32px);
  padding: 16px 0;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
}

.item-wrapper:hover {
  background: var(--light-hover);
  text-decoration: underline;
}

.active-item {
  color: var(--primary-orange);
}

.active-item .icon,
.item-wrapper .active-icon {
  display: none !important;
}

.active-item .active-icon {
  display: flex !important;
}

.item-wrapper .icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-wrapper .active-icon {
  display: none;
}

section.logout {
  position: absolute;
  bottom: 32px;
  top: auto !important;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
  width: calc(100% - 32px);
  box-sizing: border-box;
  background: var(--plain-white, #fff);
  padding: 0 0 0;
}

.no-user {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  row-gap: 16px;
}

button.logout-btn {
  display: flex;
  background: var(--plain-white, #fff);
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: calc(100dvw - 32px);
  padding: 16px 0 !important;

  color: #585858;
  font-family: Urbanist-Medium;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: -0.36px;
  cursor: pointer;
  user-select: none;
}

button.logout-btn:hover {
  background: var(--light-hover);
  text-decoration: underline;
}

button.close-btn {
  position: absolute;
  top: 16px;
  right: 21px;
  z-index: 21;
  width: 24px;
  height: 24px;
  background: var(--plain-white, #fff);
  box-sizing: border-box;
}

button.close-btn svg {
  width: 24spx;
  height: 24px;
}
</style>