<template>
  <button
    v-if="disabled"
    :class="{ secondary: type == 'secondary' }"
    class="disabled"
  >
    {{ defaultText }}
  </button>
  <button
    v-else-if="loading"
    :class="{ secondary: type == 'secondary' }"
    class="loading"
  >
    <div class="custom-loader"></div>
  </button>
  <button
    @click="emit('submit')"
    v-else
    :class="{ secondary: type == 'secondary' }"
    class="submit-btn"
  >
    {{ defaultText }}
  </button>
</template>

<script setup>
const emit = defineEmits(["submit"]);
const props = defineProps({
  defaultText: String,
  disabled: Boolean,
  loading: Boolean,
  type: String,
});
</script>

<style scoped>
button {
  width: 100%;
  border: 1px solid var(--primary-orange);
  background: var(--primary-orange);
  color: var(--plain-white);

  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  padding: 12px;
  border-radius: 12px;
  /* height: 54px; */
}

button:hover {
  text-decoration: underline;
}

.loading {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: wait;
}
.disabled {
  cursor: not-allowed;
  border: 1px solid var(--dark-hover) !important;
  background: var(--dark-hover) !important;
}

.custom-loader {
  height: 2px;
  width: 50px;
  background: linear-gradient(var(--primary-orange) 0 0),
    linear-gradient(var(--primary-orange) 0 0), #fff;
  background-size: 60% 100%;
  background-repeat: no-repeat;
  animation: horizontal-loading 2s infinite;
}

@keyframes horizontal-loading {
  0% {
    background-position: -150% 0, -150% 0;
  }
  66% {
    background-position: 250% 0, -150% 0;
  }
  100% {
    background-position: 250% 0, 250% 0;
  }
}
</style>