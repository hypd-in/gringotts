<template>
    <div class="login-flow">
      <Login
        v-if="getNumber && !store.state.user.id && !getNameAndEmail"
        :number="number"
        @sendOTP="sendOTP"
      />
      <Otp
        :number="number"
        @changeNumber="changeNumber"
        @verifyOTP="verifyOTP"
        v-else-if="getOTP && !store.state.user.id && !getNameAndEmail"
      />
      <NameEmail
        v-else-if="
          getNameAndEmail &&
          store.state.user.id &&
          (store.state.user.full_name == '' || store.state.user.email == '')
        "
      />
    </div>
  </template>
  
  <script setup>
  import Login from "@/components/LoginComponents/LoginPopup.vue";
  import Otp from "@/components/LoginComponents/OtpPopup.vue";
  import { computed, onBeforeUnmount, onMounted, ref } from "vue";
  import NameEmail from "../LoginComponents/NameEmailPopup.vue";
  
  onMounted(() => {
    document.body.style.overflowY = "hidden";
  });
  
  onBeforeUnmount(() => {
    document.body.style.overflowY = "scroll";
  });
  
  const route = useRoute();
  const emit = defineEmits(["close"]);
  
  const getOTP = ref(false);
  const getNameAndEmail = computed(() => {
    return (
      store.state.user?.id &&
      (store.state.user?.full_name == "" ||
        store?.state.user?.email == "" ||
        !store.state.user?.full_name ||
        !store.state.user?.email)
    );
  });
  
  const getNumber = computed(() => {
    return !store.state.user?.id && !getOTP.value && !getNameAndEmail.value;
  });
  const number = ref(null);
  
  function sendOTP(phoneNumber) {
    getOTP.value = true;
    getNumber.value = false;
    number.value = phoneNumber;
  }
  
  function changeNumber(phoneNumber) {
    number.value = phoneNumber;
    getOTP.value = false;
    getNumber.value = true;
  }
  
  function verifyOTP() {
    getUserNameAndEmail();
  }
  
  function getUserNameAndEmail() {
    getNameAndEmail.value = true;
    getOTP.value = false;
    getNumber.value = false;
  }
  </script>
  
  <style scoped>
  </style>