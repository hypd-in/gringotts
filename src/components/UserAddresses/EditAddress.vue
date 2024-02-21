<template>
  <div class="edit-address-wrapper" :key="address">
    <div class="input-wrapper display-name">
      <div class="first-name">
        <label for="firstName">First Name</label>
        <input type="text" placeholder="First Name" v-model="firstName" @input="updateFirstName" />
      </div>
      <div class="last-name">
        <label for="lastName">Last Name</label>
        <input type="text" placeholder="Last Name" v-model="lastName" @input="updateLastName" />
      </div>
    </div>

    <div class="input-wrapper phone-no">
      <label for="phoneNumber">Phone Number</label>
      <div class="phone-input-wrapper flex">
        <input style="width: 42px; text-align: center" class="disabled" type="tel" value="+91" readonly />
        <input type="tel" maxlength="10" placeholder="Phone No" v-model="address.contact_number.number"
          @input="updatePhoneNumber" />
      </div>
    </div>

    <div class="input-wrapper flex gap-16">
      <div class="pincode">
        <label for="pincode">Pin code</label>
        <input type="tel" @input="fetchPincodeInfo" v-model="address.postal_code" placeholder="Pin-code" />
      </div>

      <div class="city">
        <label for="city">District/City</label>
        <input v-model="address.city" type="text" placeholder="Enter City" />
      </div>
    </div>

    <div class="input-wrapper">
      <div class="state">
        <label for="state">State</label>
        <input readonly v-model="address.state.name" type="text" class="disabled" @click="toggleStateDropdown"
          placeholder="Enter State" />
      </div>
      <div v-if="showStateDropDown" class="states-dropdown">
        <div class="dropdown-item" v-for="state in states" :key="state.iso_code" @click="updateAddressState(state)">
          {{ state.name }}
        </div>
      </div>
    </div>

    <div class="input-wrapper">
      <div class="line-1">
        <label for="lineOne">FLAT, HOUSE NO., BUILDING</label>
        <input type="text" v-model="address.line1" autocomplete="address" placeholder="Enter flat, house no., building" />
      </div>
    </div>

    <div class="input-wrapper">
      <div class="line-2">
        <label for="lineTwo">Area, Street</label>
        <input v-model="address.line2" autocomplete="address-area" type="text" placeholder="Enter area, street" />
      </div>
    </div>

    <div class="input-wrapper">
      <div class="line-3">
        <label for="lineThree">Locality</label>
        <input v-model="address.line3" type="text" autocomplete="address-landmark" placeholder="Enter Locality" />
      </div>
    </div>

    <div class="input-wrapper">
      <label for="addressType"> Select type of address </label>
      <div class="address-name">
        <div :class="{
          'selected-type': selectedAddressType == type,
        }" class="selector" v-for="type in addressTypes" :key="type" @click="updateAddressType(type)">
          {{ type }}
        </div>
        <input v-if="selectedAddressType.toLowerCase() == 'others'" type="text" placeholder="Enter address type"
          autocomplete="organization" v-model="address.address_name" />
      </div>
    </div>

    <SubmitButton class="submit-btn" @submit="submitAddress" :disabled="validateAddress()" :loading="submittingAddress"
      defaultText="Submit" type="primary" />
  </div>
</template>

<script setup>
import SubmitButton from "@/components/SubmitButton.vue";

const emit = defineEmits(["close", "selectAddress"]);
const props = defineProps({
  address: Object,
});
const route = useRoute();
const store = useStore();
const config = useRuntimeConfig();
const address = ref({
  address_name: "home",
  display_name: "",
  line1: "",
  line2: "",
  line3: "",
  district: "",
  city: "",
  is_billing_address: true,
  is_shipping_address: true,
  is_default_address: true,
  state: { iso_code: "", name: "" },
  postal_code: null,
  country: { iso_code: "IND", name: "India" },
  plain_address: "",
  contact_number: { prefix: "+91", number: null },
});

const states = ref([
  { iso_code: "AN", name: "Andaman and Nicobar Islands" },
  { iso_code: "AP", name: "Andhra Pradesh" },
  { iso_code: "AR", name: "Arunachal Pradesh" },
  { iso_code: "AS", name: "Assam" },
  { iso_code: "BR", name: "Bihar" },
  { iso_code: "CG", name: "Chandigarh" },
  { iso_code: "CH", name: "Chhattisgarh" },
  { iso_code: "DH", name: "Dadra and Nagar Haveli" },
  { iso_code: "DD", name: "Daman and Diu" },
  { iso_code: "DL", name: "Delhi" },
  { iso_code: "GA", name: "Goa" },
  { iso_code: "GJ", name: "Gujarat" },
  { iso_code: "HR", name: "Haryana" },
  { iso_code: "HP", name: "Himachal Pradesh" },
  { iso_code: "JK", name: "Jammu and Kashmir" },
  { iso_code: "JH", name: "Jharkhand" },
  { iso_code: "KA", name: "Karnataka" },
  { iso_code: "KL", name: "Kerala" },
  { iso_code: "LD", name: "Lakshadweep" },
  { iso_code: "MP", name: "Madhya Pradesh" },
  { iso_code: "MH", name: "Maharashtra" },
  { iso_code: "MN", name: "Manipur" },
  { iso_code: "ML", name: "Meghalaya" },
  { iso_code: "MZ", name: "Mizoram" },
  { iso_code: "NL", name: "Nagaland" },
  { iso_code: "OR", name: "Odisha" },
  { iso_code: "PY", name: "Puducherry" },
  { iso_code: "PB", name: "Punjab" },
  { iso_code: "RJ", name: "Rajasthan" },
  { iso_code: "SK", name: "Sikkim" },
  { iso_code: "TN", name: "Tamil Nadu" },
  { iso_code: "TS", name: "Telangana" },
  { iso_code: "TR", name: "Tripura" },
  { iso_code: "UK", name: "Uttarakhand" },
  { iso_code: "UP", name: "Uttar Pradesh" },
  { iso_code: "WB", name: "West Bengal" },
]);

const firstName = ref("");
const lastName = ref("");
const selectedAddressType = ref("home");

const submittingAddress = ref(false);

const showStateDropDown = ref(false);
const fetchedState = ref(false);

onBeforeMount(() => {
  if (store.user?.id) {
    address.value.contact_number = { ...store.user?.phone_no };
    if (/^[a-zA-Z]+$/.test(store.user?.full_name)) {
      address.value.display_name = store.user?.full_name;
    } else {
      address.value.display_name = "";
    }
  }
  if (props.address?.id) {
    address.value = { ...props.address };
    if (props.address?.address_name) {
      updateAddressType(props.address?.address_name);
    }
    if (address.value.state.name) {
      fetchedState.value = true;
    }
    trimAddress();
  }
  getFirstAndLastName();
});

const addressTypes = ["home", "office", "others"];

function updatePhoneNumber(event) {
  address.value.contact_number.number = returnMaxLength(event, 10);
  address.value.contact_number.number = returnNumber(event);
}

function updateFirstName(event) {
  firstName.value = returnAlphabets(event);
  event.target.value = firstName.value;
}

function updateLastName(event) {
  lastName.value = returnAlphabets(event);
  event.target.value = lastName.value;
}

function updateAddressType(type) {
  if (type.toLowerCase() != "home" && type.toLowerCase() != "office") {
    selectedAddressType.value = "others";
  } else {
    selectedAddressType.value = type;
  }
  address.value.address_name = type;
}

function updateAddressState(state) {
  address.value.state = { ...state };
  toggleStateDropdown();
}

function validateAddress() {
  if (
    address.value?.address_name?.length > 0 &&
    address.value?.city?.length > 2 &&
    address.value?.contact_number?.number?.toString()?.length > 0 &&
    address.value?.contact_number?.number?.toString()?.length == 10 &&
    firstName?.value?.length > 0 &&
    address.value?.postal_code?.length == 6 &&
    address.value?.state?.name?.length > 0 &&
    address.value?.line1?.length > 0 &&
    address.value?.line2?.length > 0
  ) {
    return false;
  } else {
    return true;
  }
}

function toggleStateDropdown() {
  if (fetchedState.value) {
    return;
  }
  showStateDropDown.value = !showStateDropDown.value;
}

function getFirstAndLastName() {
  var splitName = address.value.display_name.split(" ");
  if (splitName.length > 1) {
    lastName.value = splitName[splitName.length - 1];
    firstName.value = splitName
      .filter((string) => {
        return string != lastName.value;
      })
      .join(" ");
  } else if (splitName.length == 1) {
    firstName.value = splitName.join(" ");
  }
}

async function fetchPincodeInfo(event) {
  address.value.postal_code = returnMaxLength(event, 6);
  address.value.postal_code = returnNumber(event);
  fetchedState.value = false;
  if (address.value?.postal_code?.length == 6) {
    await fetchPincodeDetails();
  } else {
    address.value.district = "";
    address.value.city = "";
    address.value.state = {
      iso_code: "",
      name: "",
    };
  }
}

async function fetchPincodeDetails() {
  try {
    var response = await $fetch("https://api.postalpincode.in/pincode/" + address?.value?.postal_code, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });
    if (response[0].PostOffice?.length > 0) {
      fetchedState.value = true;
      showStateDropDown.value = false;
      var info = response[0]?.PostOffice[0];
      if (info?.Block != "NA") {
        address.value.city = info?.Block;
      } else {
        address.value.city = info?.District;
      }

      address.value.district = info?.District;
      address.value.state.name = info?.State;

      states.value.forEach((state) => {
        if (state.name == address.value.state.name) {
          address.value.state.iso_code = state.iso_code;
        }
      });
    } else {
      fetchedState.value = false;
      showStateDropDown.value = true;
    }
  } catch (err) {
    showStateDropDown.value = true;
    fetchedState.value = false;
    console.log(err);
  }
}

function trimAddress() {
  if (
    address.value.line1?.length > 0 &&
    address.value.line1?.trim()?.at(-1) == ","
  ) {
    address.value.line1 = address.value.line1.trim().slice(0, -1);
  }

  if (
    address.value.line2?.length > 0 &&
    address.value.line2?.trim()?.at(-1) == ","
  ) {
    address.value.line2 = address.value.line2.trim().slice(0, -1);
  }

  if (
    address.value.line3?.length > 0 &&
    address.value.line3?.trim()?.at(-1) == ","
  ) {
    address.value.line3 = address.value.line3.trim().slice(0, -1);
  }

  if (
    address.value.district?.length > 0 &&
    address.value.district?.trim()?.at(-1) == ","
  ) {
    address.value.district = address.value.district.trim().slice(0, -1);
  }
}
function createPlainAddress() {
  address.value.plain_address = "";
  address.value.plain_address += address.value.line1
    ? `${address.value.line1}`
    : "";

  address.value.plain_address +=
    address.value.line1 && address.value.line2
      ? `, ${address.value.line2}`
      : address.value.line2 && !address.value.line1
        ? `${address.value.line2}`
        : "";

  address.value.plain_address +=
    address.value.line1 || address.value.line2
      ? `, ${address.value.line3}`
      : address.value.line3 && !(address.value.line1 && address.value.line2)
        ? `${address.value.line3}`
        : address.value.line3
          ? address.value.line3
          : "";

  address.value.plain_address +=
    address.value.city.length > 0 ? `, ${address.value.city}` : "";

  address.value.plain_address +=
    address.value.district?.length > 0 ? `, ${address.value?.district}` : "";

  address.value.plain_address +=
    address.value.state.name.length > 0 ? `, ${address.value.state.name}` : "";

  address.value.plain_address += `, India`;

  address.value.plain_address +=
    address.value.postal_code.length > 0
      ? `- ${address.value.postal_code}`
      : "";
}
async function submitAddress() {
  submittingAddress.value = true;
  var data = {};
  createPlainAddress();
  address.value.display_name =
    firstName.value +
    `${lastName.value.length > 0 ? " " + lastName.value : ""}`;
  data = { ...address.value };
  data.user_id = store.user?.id;

  if (data.id) {
    data["address_id"] = data.id;
    delete data.id;
  }

  await $fetch(`${config.public.entityURL}/api/customer/address${data.address_id ? "/edit" : ""}`, {
    method: "PUT",
    credentials: "include",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (response.payload) {
      if (!data.address_id) {
        emit("selectAddress", {
          ...address.value,
          address_id: response.payload.id,
        });
      } else {
        delete data?.user_id;
        emit("selectAddress", data);
      }
      emit("close");
      await fetchUserAddresses();
      submittingAddress.value = false;
      if (!data.id) {
        trackingAddShippingInfo(store.cartInfo);
      }
    }
  }).catch((error) => {
    emit("close");
    submittingAddress.value = false;
    alert("Oops! there was an error saving your address");
    console.log("Error saving address", error);

  })
}
</script>

<style scoped>
.edit-address-wrapper {
  padding: 0 0 16px;
}

.display-name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  gap: 16px;
}

label {
  color: var(--input-grey, #a9a9a9);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.input-wrapper {
  margin: 18px 0;
}

.flex {
  display: flex;
  align-items: center;
}

.phone-input-wrapper {
  gap: 6px;
}

.pincode,
.city {
  width: 100%;
}

.selector {
  padding: 8px;
  display: inline-flex;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: var(--background-grey, #f9f9f9);

  color: var(--primary-black, #13141b);
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  margin: 0 6px 16px 0;
  text-transform: capitalize;

  user-select: none;
  cursor: pointer;
}

.address-name {
  padding: 12px 0 0;
}

.selected-type,
.others {
  background: var(--primary-purple);
  color: var(--plain-white, #fff);
}

.submit-btn {
  background: var(--primary-orange);
  width: 100%;
  padding: 12px;
  border-radius: 18px;

  color: #fff;
  text-align: center;
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 30px;
  letter-spacing: -0.4px;
  user-select: none;
}

input {
  border: none;
  border-radius: 0;
  outline: none;
  background: none;
  border-bottom: 1px solid var(--primary-border-color);
  padding: 11px 0;
  width: 100%;

  color: var(--primary-black, #13141b);
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
}

input::placeholder {
  color: var(--input-grey, #dedede);
}

.disabled {
  cursor: default;
  user-select: none;
  background: var(--light-hover);
}

.disabled-btn {
  background: var(--dark-hover);
  color: var(--plain-white);
}

.state {
  position: relative;
  cursor: pointer;
}

.states-dropdown {
  position: absolute;
  height: 132px;
  background: var(--plain-white);
  z-index: 2;

  width: calc(100% - 32px);
  max-width: 452px;
  box-sizing: border-box;
  overflow: hidden scroll;
  border: 1px solid var(--primary-border-color);
  border-radius: 0 0 12px 12px;
}

.dropdown-item {
  padding: 12px;
  border-bottom: 1px solid var(--primary-border-color);
  cursor: pointer;
  user-select: none;
}

.dropdown-item:last-of-type {
  border-bottom: 0;
}

.dropdown-item:hover {
  background: var(--light-hover);
}

.states-dropdown::-webkit-scrollbar {
  width: 0;
}
</style>