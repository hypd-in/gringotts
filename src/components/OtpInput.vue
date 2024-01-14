<template>
  <div class="otp-inputs">
    <input
      type="text"
      maxlength="6"
      pattern="\d*"
      ref="otpField"
      placeholder="*"
      v-for="(el, index) in 6"
      :key="el + index"
      :class="`input-${index} otp-input`"
      autocomplete="off"
      v-model="otpValues[index]"
      @input="updateOTP($event, index)"
      @focus="selectInput($event, index)"
      @keyup.delete="clearInput($event, index)"
    />
  </div>
</template>

<script setup>
import { returnMaxLength, returnNumber } from "~/utils/helperMethods";

const emit = defineEmits(["autoSubmit"]);
const otpField = ref(null);
const otpValues = ref([]);
const timer = ref(30);
const timerInterval = ref(null);

const otp = computed(() => {
  return otpValues.value.join("");
});

watch(otp, (newValue) => {
  if (newValue.length == 6 && /^[0-9]*$/.test(newValue)) {
    emit("autoSubmit");
  }
});

function clearOTP() {
  otpValues.value = [];
  changeFocus(0);
}

defineExpose({
  otp,
  clearOTP,
});
onMounted(() => {
  otpField.value[0].focus();
});

async function updateOTP(event, index) {
  event.target.value = await returnNumber(event);
  otpValues.value[index] = event.target.value;
  if (otp.value?.length > 6) {
    event.target.value = await returnNumber(event);
    event.target.value = await returnMaxLength(event, 1);
    otpValues.value[index] = event.target.value;
    return;
  }

  if (event.target.value.length > 1 && event.target.value.length <= 6) {
    var otpInput = await event.target.value.split("");
    otpValues.value = [...otpInput];
    if (otpValues.value.length == 6) {
      await changeFocus(5);
      return;
    }
    await changeFocus(otpValues.length);
    return;
  } else if (event.target.value.length == 1) {
    otpValues.value[index] = event.target.value;
    changeFocus(index + 1);
    return;
  }
}

async function changeFocus(index) {
  await otpField?.value[index]?.focus();
}

function selectInput(event, index) {
  if (event.target.value.length == 1 && index < 6) {
    otpField?.value[index]?.select();
  }
}

function clearInput(event, index) {
  if (event.target.value.length == 0 && index > 0) {
    changeFocus(index - 1);
  }
}
</script>

<style scoped>
.otp-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
}
.otp-input {
  min-width: 14px;
  width: auto;
  border-radius: 0;
  text-align: center;
}

input {
  font-family: Edmondsans-Bold;
  font-size: 21px;
  border: 0;
  letter-spacing: 1px;
  outline: none;
  padding: 4px 0;
  border-bottom: 1px solid #e8e8e8;
}

input:focus {
  border-color: var(--black, #000);
}
</style>
