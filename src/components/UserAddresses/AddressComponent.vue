<template>
  <div class="address-listing-wrapper" :key="store.addresses">
    <div class="backdrop" @click="goBack()"></div>
    <div class="address-listing-container">
      <div class="close-btn" @click="goBackToAddresses()">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.97913 15.0503L14.8786 5.1508" stroke="#292D32" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M14.8786 15.0504L4.97913 5.15088" stroke="#292D32" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
      <div class="heading">
        <span>{{ heading }}</span>
      </div>
      <div class="edit-address" v-if="editOrCreateNewAddress">
        <EditAddress :address="editAddress" @selectAddress="selectAddress" @close="goBackToAddresses" />
      </div>
      <div class="address-listing-wrapper" v-else>
        <div class="empty-address-container" v-if="noOfUserAddresses == 0">
          <img src="~/assets/illustrations/no-address.svg" alt="" />
          <div style="margin: 16px auto">
            <span>
              Looks like, we don't have your addresses saved in your profile.
            </span>
          </div>
        </div>
        <div class="address-listing" v-else>
          <AddressCard :address="address" @edit="goToEditAddress" @remove="removeAddress" @goBack="emits('close')"
            v-for="address in store.addresses" :key="address.id" />
        </div>
        <section class="button-section">
          <button @click="goToEditAddress" class="add-new-btn">
            Add New Address
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { fetchCartInfo, fetchUserAddresses } from "@/API/APIs";

import AddressCard from "./AddressCard.vue";
import EditAddress from "./EditAddress.vue";

const emits = defineEmits(["close"]);
const route = useRoute();
const router = useRouter();
const store = useStore();
const config = useRuntimeConfig();
onMounted(async () => {
  if (noOfUserAddresses.value == 0 && store.user.id) {
    await fetchUserAddresses();
  }
  document.body.style.overflowY = "hidden";
});

onBeforeUnmount(() => {
  document.body.style.overflowY = "scroll";
});

const editAddress = ref({});
const editOrCreateNewAddress = ref(false);

const heading = computed(() => {
  if (editOrCreateNewAddress.value && editAddress.value?.id) {
    return "Edit Address";
  } else if (editOrCreateNewAddress.value) {
    return "New Address";
  }
  return "My Addresses";
});
const noOfUserAddresses = computed(() => {
  return Object.keys(store.addresses)?.length || 0;
});
function goBack() {
  emits("close");
}

function goToEditAddress(address) {
  if (address.id) {
    editAddress.value = { ...address };
  } else {
    editAddress.value = {};
  }
  editOrCreateNewAddress.value = true;
}

function goBackToAddresses() {
  if (editOrCreateNewAddress.value) {
    editAddress.value = {};
    editOrCreateNewAddress.value = false;
  } else {
    goBack();
  }
}

async function removeAddress(address) {
  var params = {};
  params = {
    user_id: store.user?.id,
    address_id: address?.id,
  }
  await $fetch(`${config.public.entityURL}/api/customer/address`, {
    method: "DELETE",
    params: params,
    credentials: include,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (response.payload) {
      await fetchCartInfo();
      store.removeAddress(address);
    }
  }).catch((error) => {
    alert("Oops! there was an error removing this address");
    console.log("Error removing address", error);
  })
}

async function selectAddress(address) {
  if (route.query.isExpress) {
    store.updateCartInfo({
      billing_address: { ...address },
      shipping_address: { ...address },
    })
    return;
  }
  var data = { ...address };
  data["id"] = store.user?.id;
  var response = await $fetch(`${config.public.entityURL}/api/app/cart/address`, {
    method: "POST",
    credentials: "include",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (response.payload) {
      await fetchCartInfo();
    }
  }).catch((error) => {
    alert("Oops! there was an error selecting this address");
    console.log("Error selecting address", error);
  })
}
</script>

<style scoped>
.address-listing-wrapper {
  box-sizing: border-box;
}

.address-listing-container {
  background: var(--plain-white, #fff);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 41;
  width: 100%;
  max-width: 520px;
  height: 100%;
  padding: 0 32px 16px;
  box-sizing: border-box;
  overflow: hidden scroll;
}

.empty-address-container {
  width: auto;
  margin: 20vh auto 0;
  margin: 20dvh auto 0;
  text-align: center;
}

.address-listing-container::-webkit-scrollbar {
  width: 4px;
}

.address-listing-container::-webkit-scrollbar-thumb {
  background: var(--dark-hover);
}

.heading {
  color: #13141b;
  text-align: center;
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 24px;
  width: 100%;
  padding: 21px 0 12px;
  position: sticky;
  top: 0;
  background: var(--plain-white);
}

@media only screen and (max-width: 520px) {
  .backdrop {
    background: var(--plain-white, #fff);
    height: calc(100vh - 49px);
    height: calc(100dvh - 49px);
    margin: 49px auto 0;
  }

  .heading {
    position: fixed !important;
    top: 11px;
    margin: 0;
    padding: 0px;
    background: var(--plain-white);
    z-index: 42;
    width: 50%;
    text-align: left;
    white-space: nowrap;
    left: 64px;
    color: var(--primary-black, #13141b);
  }

  .address-listing-container {
    margin: 49px auto 0;
    height: calc(100vh - 49px);
    height: calc(100dvh - 49px);
    padding: 0 16px 16px !important;
  }

  .close-btn {
    top: 8px !important;
    left: 12px !important;
  }
}

.add-new-btn {
  width: 100%;
  max-width: 320px;
  padding: 12px 16px;
  border: 1px dashed var(--primary-orange);
  border-radius: 16px;

  color: var(--primary-orange, #fb6c23);
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.45px;
  background: none;
}

.button-section {
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: fixed;
  background: var(--plain-white);
  width: 30px;
  height: 30px;
  z-index: 43;

  top: 18px;
  left: calc(100% - 64px);

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>