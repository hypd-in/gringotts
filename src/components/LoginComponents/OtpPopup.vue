<template>
  <div class="otp-popup-wrapper">
    <div class="backdrop" @click="goBack"></div>
    <div class="bottom-sheet-container otp-popup">
      <div class="heading">Verify OTP</div>
      <div class="sub-heading">
        We have sent an OTP on your number +91{{ number }}
        <button @click="changeNumber" class="change-btn">change</button>
      </div>
      <div class="otp-input-container">
        <OTP ref="otpInputs" @autoSubmit="confirmOTP" />
      </div>
      <div class="timer">00:{{ `${timer > 9 ? timer : "0" + timer}` }}</div>
      <div class="resend">
        Didn't Receive OTP?
        <span @click="resendCode" :class="{ 'disabled-resend': timer > 0 }">Resend Code</span>
      </div>

      <Submit @submit="confirmOTP" defaultText="Submit OTP" type="primary" :disabled="checkOTP()"
        :loading="submittingOTP" />

      <div class="disclaimer pt-16">
        You are confirming to our <span>Terms of Use</span> and
        <span>Privacy Policy</span>.
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { fetchCartInfo, fetchUserInfo } from "@/utils/globalAPIs";
import OTP from "../OtpInput.vue";

import Submit from "@/components/SubmitButton.vue";
import { addLocalStorageItemsToCart } from "@/utils/cartMethods";
import { onMounted, ref } from "vue";

const router = useRouter();
const route = useRoute();
const emit = defineEmits(["verifyOTP", "changeNumber"]);
const props = defineProps({
  number: String,
});

const runtimeConfig = useRuntimeConfig()

const timer = ref(30);
const otpInputs = ref(null);
const inputOTP = ref(null);
const submittingOTP = ref(false);
const timerInterval = ref(null);
const generatingOTP = ref(false);

function checkOTP() {
  return otpInputs.value?.otp?.length !== 6;
}

onMounted(() => {
  startTimer();
});

async function resendCode() {
  if (generatingOTP.value) {
    return;
  } else {
    otpInputs.value.clearOTP();
    clearInterval(timerInterval.value);
    timer.value = 30;
    startTimer();
    await sendOTP();
  }
}

function validatePhoneNumber() {
  if (props.number?.toString()?.length == 10) {
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
        data: {
          phone_no: {
            prefix: "+91",
            number: props.number,
          },
        },
      });
      if (response.payload) {
        generatingOTP.value = false;
      }
    } catch (err) {
      generatingOTP.value = false;
      console.log("Error generating OTP", err);
    }
  }
}

function startTimer() {
  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else if (timer.value == 0) {
      clearInterval(timerInterval.value);
    }
  }, 1000);
}

function changeNumber() {
  emit("changeNumber", props.number);
}

async function confirmOTP() {
  submittingOTP.value = true;
  try {
    var response = await $fetch(runtimeConfig.public.entityURL + "/api/customer/otp/confirm?isWeb=true", {
      method: "POST",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        phone_no: {
          prefix: "+91",
          number: props.number,
        },
        otp: otpInputs.value?.otp,
      },
    });
    if (response.data.payload) {
      submittingOTP.value = false;
      emit("verifyOTP");
      await fetchUserInfo();
      if (!route.query.isExpress) {
        await fetchCartInfo();
      }
      await addLocalStorageItemsToCart();
    }
  } catch (err) {
    otpInputs.value.clearOTP();
    submittingOTP.value = false;
    console.log("Error verifying OTP", err);
  }
}

function goBack() {
  router.go(-1);
}
</script>
  
<style scoped>
.otp-popup {
  max-width: 420px;
}

.otp-input-container {
  padding: 12px 0 0;
}

.change-btn {
  color: var(--dark-blue, #4791ff);
  font-family: Urbanist-Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

.timer {
  padding: 16px 0;
  color: #13141b;
  font-family: Urbanist-Bold;
  font-size: 21px;
  line-height: 27px;
}

.resend {
  color: #585858;
  font-family: Urbanist-Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  cursor: pointer;
  user-select: none;
  padding: 0 0 16px;
}

.resend span {
  color: var(--dark-blue);
  font-family: Urbanist-Bold;
  cursor: pointer;
}

span.disabled-resend {
  color: var(--primary-border-color);
}

.submit-btn {
  margin: 0 auto 16px;
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