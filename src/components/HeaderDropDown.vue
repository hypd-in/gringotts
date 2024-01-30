<template>
  <div class="drop-down-container">
    <div class="overlay" @click="closeMenu"></div>
    <div class="drop-down">
      <div class="user-info">
        <div class="user-name">
          Hello,
          <span v-if="fullName">{{ fullName }}</span>
          <span v-else> Shopper! </span>
          <div @click="goToLogin" v-if="!store.user?.id" class="sign-in">
            Let's get you signed in!
          </div>
          <div class="phone-no" v-else>
            {{ phoneNumber }}
          </div>
        </div>
      </div>

      <div class="menu" v-if="store.user?.id">
        <div
          @click="routeToPath(item.path)"
          v-for="item in menuItems"
          :key="item.name"
          class="menu-item"
        >
          <div class="icon default-icon" v-html="item.icon"></div>
          <div class="icon active-icon" v-html="item.activeIcon"></div>
          <div class="item-text">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <AddressComponent v-if="showAddress" @close="toggleAddressComponent"/>
  </div>
</template>

<script setup>
// import { logoutUser } from "@/API/APIs";
import AddressComponent from "@/components/UserAddresses/AddressComponent.vue"

const emit = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();
const store = useStore();

const fullName = computed(() => {
  return store.user.full_name;
});

const phoneNumber = computed(() => {
  return (
    store.user?.phone_no?.prefix +
    " " +
    store.user?.phone_no?.number
  );
});

const showAddress = ref(false);
const menuItems = ref([
  {
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.17004 7.43994L12 12.5499L20.77 7.46991" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 21.6099V12.5399" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17 13.24V9.58002L7.51001 4.09998" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activeIcon:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.17004 7.43994L12 12.5499L20.77 7.46991" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 21.6099V12.5399" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M17 13.24V9.58002L7.51001 4.09998" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    name: "My Orders",
    path: "Orders",
  },
  {
    icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6673 5.99999V9.99999C14.6673 11.6667 14.334 12.8333 13.5873 13.5867L9.33398 9.33332L14.4873 4.17999C14.6073 4.70666 14.6673 5.30666 14.6673 5.99999Z" stroke="#232D32" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.4873 4.17998L4.18064 14.4866C2.17398 14.0266 1.33398 12.64 1.33398 9.99998V5.99998C1.33398 2.66665 2.66732 1.33331 6.00065 1.33331H10.0007C12.6407 1.33331 14.0273 2.17332 14.4873 4.17998Z" stroke="#232D32" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5864 13.5867C12.833 14.3333 11.6664 14.6666 9.99969 14.6666H5.99969C5.30636 14.6666 4.70635 14.6066 4.17969 14.4866L9.33303 9.33331L13.5864 13.5867Z" stroke="#232D32" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.16018 5.31998C4.61351 3.36665 7.54685 3.36665 8.00018 5.31998C8.26018 6.46665 7.54017 7.43998 6.90684 8.03998C6.44684 8.47998 5.72019 8.47998 5.25352 8.03998C4.62019 7.43998 3.89351 6.46665 4.16018 5.31998Z" stroke="#232D32"/><path d="M6.06405 5.80001H6.07003" stroke="#232D32" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activeIcon:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6673 5.99999V9.99999C14.6673 11.6667 14.334 12.8333 13.5873 13.5867L9.33398 9.33332L14.4873 4.17999C14.6073 4.70666 14.6673 5.30666 14.6673 5.99999Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.4873 4.17998L4.18064 14.4866C2.17398 14.0266 1.33398 12.64 1.33398 9.99998V5.99998C1.33398 2.66665 2.66732 1.33331 6.00065 1.33331H10.0007C12.6407 1.33331 14.0273 2.17332 14.4873 4.17998Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.5864 13.5867C12.833 14.3333 11.6664 14.6666 9.99969 14.6666H5.99969C5.30636 14.6666 4.70635 14.6066 4.17969 14.4866L9.33303 9.33331L13.5864 13.5867Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.16018 5.31998C4.61351 3.36665 7.54685 3.36665 8.00018 5.31998C8.26018 6.46665 7.54017 7.43998 6.90684 8.03998C6.44684 8.47998 5.72019 8.47998 5.25352 8.03998C4.62019 7.43998 3.89351 6.46665 4.16018 5.31998Z" stroke="#fff"/><path d="M6.06405 5.80001H6.07003" stroke="#12141B" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    name: "My Addresses",
    path: "MyAddresses",
  },
  {
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.7001 16.25C19.0001 17.33 19.84 18.17 20.92 18.47" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    activeIcon:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.7001 16.25C19.0001 17.33 19.84 18.17 20.92 18.47" stroke="#fff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    name: "Edit Profile",
    path: "EditProfile",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="16.75" viewBox="0 0 15 16.75"><path id="icon" d="M11.5,2A7.522,7.522,0,0,0,4,9.5v1.875A3.1,3.1,0,0,0,7.125,14.5a.59.59,0,0,0,.625-.625v-5a.59.59,0,0,0-.625-.625,3.025,3.025,0,0,0-1.813.625,6.216,6.216,0,0,1,12.375,0,3.025,3.025,0,0,0-1.812-.625.59.59,0,0,0-.625.625v5a.59.59,0,0,0,.625.625A2.288,2.288,0,0,0,17,14.25a6.377,6.377,0,0,1-3.062,2.812,1.61,1.61,0,0,0-1.562-1.375,1.521,1.521,0,0,0-1.5,1.5,1.588,1.588,0,0,0,1.562,1.563h.25A7.469,7.469,0,0,0,19,11.375V9.5A7.522,7.522,0,0,0,11.5,2Z" transform="translate(-4 -2)" fill="#293D32" /></svg>',
    activeIcon:
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="16.75" viewBox="0 0 15 16.75"><path id="icon" d="M11.5,2A7.522,7.522,0,0,0,4,9.5v1.875A3.1,3.1,0,0,0,7.125,14.5a.59.59,0,0,0,.625-.625v-5a.59.59,0,0,0-.625-.625,3.025,3.025,0,0,0-1.813.625,6.216,6.216,0,0,1,12.375,0,3.025,3.025,0,0,0-1.812-.625.59.59,0,0,0-.625.625v5a.59.59,0,0,0,.625.625A2.288,2.288,0,0,0,17,14.25a6.377,6.377,0,0,1-3.062,2.812,1.61,1.61,0,0,0-1.562-1.375,1.521,1.521,0,0,0-1.5,1.5,1.588,1.588,0,0,0,1.562,1.563h.25A7.469,7.469,0,0,0,19,11.375V9.5A7.522,7.522,0,0,0,11.5,2Z" transform="translate(-4 -2)" fill="#fff" /></svg>',
    name: "Help Center",
    path: "ContactUs",
  },
  {
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8.8999 7.55999C9.2099 3.95999 11.0599 2.48999 15.1099 2.48999H15.2399C19.7099 2.48999 21.4999 4.27999 21.4999 8.74999V15.27C21.4999 19.74 19.7099 21.53 15.2399 21.53H15.1099C11.0899 21.53 9.2399 20.08 8.9099 16.54" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.0001 12H3.62012" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.85 8.65002L2.5 12L5.85 15.35" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>',
    activeIcon:
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8.8999 7.55999C9.2099 3.95999 11.0599 2.48999 15.1099 2.48999H15.2399C19.7099 2.48999 21.4999 4.27999 21.4999 8.74999V15.27C21.4999 19.74 19.7099 21.53 15.2399 21.53H15.1099C11.0899 21.53 9.2399 20.08 8.9099 16.54" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.0001 12H3.62012" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.85 8.65002L2.5 12L5.85 15.35" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>',
    name: "Logout",
    path: "logOut",
  },
]);

function closeMenu() {
  emit("close");
}

function toggleAddressComponent(){
  showAddress.value = !showAddress.value;
}

function goToLogin() {
  navigateTo({
    name: "login",
    query: {
      redirection_url: route.fullPath,
    },
  });
}

function routeToPath(pathName) {
  if (pathName == "logOut") {
    // logoutUser({
    //   name: "creator_store",
    //   params: {
    //     creator_username: store.creator.info?.username || "hypd_store",
    //   },
    // });
    return;
  } else if(pathName == 'MyAddresses'){
    toggleAddressComponent();
  } else {
    navigateTo({
      name: pathName,
    });
  }
}
</script>

<style scoped>
.drop-down-container {
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  width: 100dvw;
  height: 100dvh;
}
.drop-down {
  position: absolute;
  top: 72px;
  right: 32px;
  z-index: 34;

  background: var(--plain-white, #fff);
  border: 1px solid var(--primary-border-color);
  box-sizing: border-box;
  min-width: 220px;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.drop-down .user-info {
  font-family: "Urbanist-Bold";
  font-size: 14px;
  letter-spacing: 0.2px;
  line-height: 18px;
  background: var(--light-hover);
  padding: 12px;
  cursor: pointer;
  user-select: none;
}

.drop-down .sign-in,
.drop-down .phone-no {
  padding: 4px 0 0;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: -0.2px;
  color: var(--primary-orange);
  cursor: pointer;
  user-select: none;
}

.drop-down .sign-in {
  color: var(--primary-orange);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  user-select: none;
  color: var(--secondary-black);
  font-family: "Urbanist-Regular";
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.2px;
  box-sizing: border-box;
  border-top: 1px solid var(--primary-border-color);
}

.menu-item:last-of-type {
  padding: 16px 12px 12px;
  border-top: 2px solid var(--primary-border-color);
  border-bottom: none;
}

.menu-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.menu-item .icon.icon.active-icon {
  display: none;
}
.menu-item:hover .icon.active-icon {
  display: flex !important;
}

.menu-item:hover .icon.default-icon {
  display: none;
}

.menu-item:hover {
  background: var(--primary-dark);
  color: var(--plain-white);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
  z-index: 32;
}
</style>