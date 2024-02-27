<template>
  <div class="login-popup-wrapper">
    <div class="backdrop" @click="goBack"></div>
    <div class="bottom-sheet-container login-popup">
      <div class="heading">Login/Sign up</div>
      <div class="sub-heading">
        Login using your 10 digit phone number
      </div>

      <div class="input-container">
        <label for="phoneNo"> Phone No </label>
        <div class="input-wrapper">
          <input style="width: 28px" value="+91" readonly />
          <input type="tel" maxlength="10" placeholder="Enter Phone No" v-model="phoneNumber" @input="updatePhoneNumber"
            @keyup.enter="sendOTP" />
        </div>
      </div>

      <SubmitButton defaultText="Send OTP" @submit="sendOTP" :disabled="!validatePhoneNumber()"
        :loading="generatingOTP" />

      <div class="disclaimer">
        You are confirming to our <span>Terms of Use</span> and
        <span>Privacy Policy</span>.
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { returnMaxLength, returnNumber } from "@/utils/helperMethods";
import { onMounted, ref } from "vue";
import SubmitButton from "@/components/SubmitButton.vue";

const router = useRouter();
const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(["sendOTP"]);
const props = defineProps({
  number: String,
});

const phoneNumber = ref(null);
const generatingOTP = ref(false);
const errorMessage = ref("");

onMounted(() => {
  if (props.number) {
    phoneNumber.value = props.number;
  }
});
function updatePhoneNumber(event) {
  phoneNumber.value = phoneNumber.value.replace(/\s/g, "")
  phoneNumber.value = returnMaxLength(event, 10);
  phoneNumber.value = returnNumber(event);
}

function validatePhoneNumber() {
  if (phoneNumber.value?.toString()?.length == 10) {
    return true;
  }
  return false;
}

async function sendOTP() {
  if (validatePhoneNumber) {
    generatingOTP.value = true;
    try {
      var response = await $fetch(runtimeConfig.public.entityURL + "/api/customer/otp/generate", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          phone_no: {
            prefix: "+91",
            number: phoneNumber.value,
          },
        },
      });
      if (response.payload) {
        generatingOTP.value = false;
        emit("sendOTP", phoneNumber.value);
      }
    } catch (err) {
      generatingOTP.value = false;
      console.log("Error generating OTP", err);
    }
  }
}

function goBack() {
  router.go(-1);
}
</script>
  
<style scoped>
.bottom-sheet-container{
  z-index: 55 !important;
}
.login-popup {
  max-width: 420px;
}

label {
  color: var(--disabled-text, #bebebe);
  font-family: Urbanist-Bold;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 1px;
  text-transform: uppercase;
  user-select: none;
}

.input-container {
  padding: 16px 0 0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  border-bottom: 1px solid var(--primary-border-color);

  color: var(--primary-black, #13141b);
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
}

input {
  width: 100%;
  border: none;
  outline: none;
  margin: 0;
  padding: 16px 0;

  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.2px;
}

input::placeholder {
  color: var(--input-grey, #dedede);
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.2px;
}

.disabled-btn {
  background: var(--dark-hover);
  color: var(--plain-white);
}

button {
  margin: 16px auto;
  padding: 16px;
  text-align: center;
  width: 100%;

  border-radius: 14px;
  background: var(--PrimaryOrange, #fb6c23);
  box-sizing: border-box;

  color: var(--plain-white, #fff);
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

button svg path {
  stroke: #fff;
}

.disclaimer {
  color: var(--Secondary-Text, #5c5c5c);
  text-align: center;
  font-family: Urbanist-Regular;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  width: 80%;
  margin: 0 auto;
  user-select: none;
}

.disclaimer span {
  color: var(--dark-blue);
  cursor: pointer;
}
</style>