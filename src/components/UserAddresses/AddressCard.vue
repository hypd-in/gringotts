<template>
  <div class="address-card" :class="{
    'selected-address':
      store.cartInfo?.shipping_address?.id == address.id &&
      (route.name == 'CartPayment' || route.name == 'CartItems'),
  }">
    <div class="address-type">
      <img v-if="address?.address_name == 'office'" :src="addressIcon['office']" alt="" />
      <img v-else-if="address?.address_name == 'home'" :src="addressIcon['home']" alt="" />
      <img v-else :src="addressIcon['other']" alt="" />
    </div>

    <div class="address-details">
      <div class="address-name">
        {{ address?.address_name }}
      </div>

      <div class="contact-info">
        <p>{{ `${address?.display_name}, ${address?.contact_number?.prefix} ${address?.contact_number?.number}` }}</p>
      </div>

      <div class="address">
        {{ address?.plain_address }}
      </div>

      <div class="address-buttons">
        <button @click="manipulateAddress('edit')" class="edit-btn">
          Edit
        </button>
        <button @click="manipulateAddress('remove')" class="remove-btn">
          Remove
        </button>
      </div>
    </div>

    <div v-if="route.name == 'CartItems' || route.name == 'CartPayment'" @click="selectAddress" class="checkbox" :class="{
      'selected-checkbox':
        store.cartInfo?.shipping_address?.id == address.id,
    }">
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.32507 3.99996L4.43807 7.11296L10.6751 0.886963" stroke="white" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  address: Object,
});
const emit = defineEmits(["edit", "remove", "goBack"]);
const store = useStore();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();

const addressIcon = ref({
  home: "/_nuxt/assets/icons/address/home-address.svg",
  other: "/_nuxt/assets/icons/address/home-address.svg",
  office: "/_nuxt/assets/icons/address/office-address.svg",
});

function manipulateAddress(type) {
  emit(type, props.address);
}

async function selectAddress() {
  if (route.query.isExpress) {
    store.updateCartInfo({
      billing_address: { ...props.address },
      shipping_address: { ...props.address },
    });
    emit("goBack");
    return;
  }
  var data = { ...props.address };
  data["address_id"] = props.address?.id;
  data["id"] = store.user?.id;
  try {
    var response = await $fetch(config.public.entityURL + "/api/app/cart/address", {
      method: "POST",
      credentials: 'include',
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.payload) {
      store.updateCartInfo({
        ...store?.cartInfo,
        shipping_address: {
          ...props.address,
          user_id: store.user?.id,
        },
      });
      emit("goBack");
      await fetchCartInfo();
    }
  } catch (err) {
    console.log(err);
  }
}
</script>

<style scoped>
.address-card {
  display: grid;
  grid-template-columns: 48px calc(100% - 48px - 22px - 32px) 22px;
  align-items: flex-start;
  gap: 16px;
  box-sizing: border-box;

  padding: 21px;
  border: 1px solid var(--primary-border-color);
  border-radius: 16px;
  margin: 16px 0;
  transition: border 0.2s ease-in-out;
}

.address-card:hover {
  border: 1px solid var(--primary-black);
}

.address-name {
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 17px;
  letter-spacing: -0.4px;
  text-transform: capitalize;
}

.contact-info {
  color: #13141b;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 18px;
}

.contact-info p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.address {
  color: #a9a9a9;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
}

.address-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0 0;
}

.address-buttons button {
  padding: 6px 14px;
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 17px;
  letter-spacing: -0.3px;
  border-radius: 6px;
}

.address-buttons .edit-btn {
  color: #fff;
  background: var(--green, #23d087);
}

.address-buttons .remove-btn {
  color: #a9a9a9;
  background: #f5f5f5;
}

.address-details div {
  user-select: none;
  cursor: pointer;
}

.selected-address,
.selected-address:hover {
  border: 1px solid var(--primary-black, #13141b);
}

.checkbox {
  width: 12px;
  height: 12px;
  padding: 4px;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--dark-hover);

  cursor: pointer;
  transition: border 0.2s ease-in-out;
}

.address-card:hover .checkbox {
  border: 1px solid var(--primary-dark) !important;
}

.selected-checkbox {
  border: 1px solid var(--primary-dark);
  background: var(--primary-dark);
}
</style>