<template>
    <div class="name-email-wrapper">
      <div class="backdrop" @click="goBack"></div>
      <div class="bottom-sheet-container name-email-popup">
        <div class="heading">Enter your details</div>
        <div class="sub-heading">All the details needs to be filled out</div>
  
        <div class="input-container">
          <label for="firstName">First Name</label>
          <input
            v-model="firstName"
            @input="updateFirstName"
            type="text"
            name="firstName"
            placeholder="Enter first name"
          />
        </div>
  
        <div class="input-container">
          <label for="lastName">Last Name</label>
          <input
            v-model="lastName"
            @input="updateLastName"
            type="text"
            name="lastName"
            placeholder="Enter last name"
          />
        </div>
  
        <div class="input-container">
          <label for="emailAddress">Email</label>
          <div
            class="email-input-wrapper"
            :class="{ success: emailVerified, loading: verifyingEmail }"
          >
            <input
              v-model="userEmail"
              @input="verifyEmailAddress"
              type="email"
              name="email"
              placeholder="user@xyz.com"
            />
            <svg
              v-if="emailVerified"
              class="verified"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z"
                stroke="#23D087"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.75 11L9.58 13.83L15.25 8.17004"
                stroke="#23D087"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span v-else-if="verifyingEmail" class="loader"></span>
          </div>
          <div v-if="emailError != ''" class="error">{{ emailError }}</div>
        </div>
  
        <SubmitButton
          @submit="saveUserDetails"
          :loading="savingDetails"
          :disabled="!checkValidity"
          defaultText="Save details"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { returnAlphabets } from "@/utils/helperMethods";
  import { computed, onMounted, ref } from "vue";
  import SubmitButton from "@/components/SubmitButton.vue";
  import { updateUser } from "@/utils/globalAPIs";
  
  const router = useRouter();

  const runtimeConfig = useRuntimeConfig()

  const userEmail = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const emailError = ref("");
  const emailVerified = ref(null);
  const verifyingEmail = ref(false);
  const errorTimeout = ref(null);
  const savingDetails = ref(false);
  
  const checkValidity = computed(() => {
    return (
      emailVerified.value &&
      userEmail.value.length > 0 &&
      firstName.value.length > 0
    );
  });
  
  const fullName = computed(() => {
    return `${firstName.value}${
      lastName.value.length > 0 ? " " + lastName.value : ""
    }`;
  });
  
  onMounted(() => {
    if (store.user?.email) {
      userEmail.value = store.user?.email;
      emailVerified.value = true;
    }
    if (store.user?.full_name != "") {
      getFirstAndLastName();
    }
  });
  function verifyEmailAddress(evt) {
    emailVerified.value = null;
    if (evt.target.value.length == 0) {
      emailVerified.value = null;
    } else if (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail.value) &&
      store.user?.email != userEmail.value &&
      evt.target.value.length > 0
    ) {
      checkEmailAddress();
    } else if (store.user?.email == userEmail.value) {
      emailVerified.value = true;
    }
  }
  async function checkEmailAddress() {
    try {
      verifyingEmail.value = true;
      var response = await $fetch(runtimeConfig.publicentityURL + "/api/user/auth/email/check",{
        method: "POST",
        body: {
          email: userEmail.value,
        },
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        verifyingEmail.value = false;
        emailVerified.value = true;
        emailError.value = "";
      }
    } catch (err) {
      if (err.response.data.error[0].message.includes("already exists")) {
        emailError.value = `${userEmail.value} is already associated with another account`;
      } else {
        emailError.value = "There was an error verifying your email address";
      }
      verifyingEmail.value = false;
      emailVerified.value = false;
    }
  }
  
  function getFirstAndLastName() {
    var splitName = store.user?.full_name.split(" ");
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
  
  function updateFirstName(event) {
    firstName.value = returnAlphabets(event);
    event.target.value = firstName.value;
  }
  
  function updateLastName(event) {
    lastName.value = returnAlphabets(event);
    event.target.value = lastName.value;
  }
  
  async function saveUserDetails() {
    try {
      savingDetails.value = true;
      var formData = {
        id: store.user?.customer_id,
        user_id: store.user?.id,
      };
      if (emailVerified.value && userEmail.value != store.user.email) {
        formData["email"] = userEmail.value;
      }
      if (fullName.value != store.user.full_name) {
        formData["full_name"] = fullName.value;
      }
      var response = await $fetch(runtimeConfig.public.entityURL + "/api/customer",{
        method: "PUT",
        body: { ...formData },
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.payload) {
        savingDetails.value = false;
        await updateUser();
        goBack();
      }
    } catch (err) {
      alert(err.response.data.error[0].message);
      savingDetails.value = false;
    }
  }
  
  function goBack() {
    router.go(-1);
  }
  </script>
  
  <style scoped>
  .input-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 12px 0;
  }
  
  input {
    border: none;
    outline: none;
    padding: 11px 0;
    border-bottom: 1px solid var(--primary-border-color);
    width: 100%;
  
    color: var(--primary-black, #13141b);
    font-family: Urbanist-Bold;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
  
  input::placeholder {
    color: var(--input-grey, #bebebe);
    font-family: Urbanist-Medium;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
  }
  
  label {
    color: var(--input-grey, #a9a9a9);
    font-family: Urbanist-Bold;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  button {
    padding: 14px 16px;
    width: 100%;
    border-radius: 14px;
    background: var(--PrimaryOrange, #fb6c23);
  
    color: var(--plain-white, #fff);
    font-family: Urbanist-Bold;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.2px;
  }
  .error {
    font-family: "Urbanist-Regular";
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: var(--red);
    padding: 6px 0 0;
  }
  
  .email-input-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
    border-bottom: 1px solid var(--primary-border-color);
    border-radius: 0;
  }
  .email-input-wrapper.success {
    border-bottom: 1px solid var(--green);
  }
  .email-input-wrapper.loader {
    border-bottom: 1px solid var(--input-grey);
  }
  
  .email-input-wrapper input {
    border-bottom: none;
  }
  
  .loader {
    width: 24px;
    height: 22px;
    border: 2px solid var(--primary-orange);
    border-bottom-color: transparent;
    border-radius: 120%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    will-change: transform;
  }
  
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>