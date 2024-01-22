<template>
  <div class="explore-icon-wrapper">
    <div class="explore-icon">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.0001 10.2857C18.0001 14.7857 14.3572 18.4285 9.85721 18.4285C5.35721 18.4285 1.71436 14.7857 1.71436 10.2857C1.71436 5.78568 5.35721 2.14282 9.85721 2.14282"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18.8574 19.2857L17.1431 17.5714"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg
        class="star"
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.9865 5.02597C9.67149 4.96878 9.36632 4.89087 9.07944 4.79439C6.97651 4.08719 5.78773 2.36903 5.3966 0.157167C5.35946 -0.0523748 5.05719 -0.0524032 5.02005 0.157167C4.56548 2.72735 3.0526 4.54492 0.443204 5.02924C0.235681 5.06774 0.235738 5.3668 0.443318 5.40521C3.02863 5.88341 4.56799 7.69755 5.02099 10.2472C5.04951 10.4079 5.21913 10.4087 5.20947 10.405C5.30219 10.4048 5.38153 10.3381 5.39754 10.2468C5.62818 8.93199 6.27571 7.14567 8.05103 6.10271C8.61818 5.76984 9.26953 5.53417 9.98693 5.40214C10.0777 5.38545 10.1436 5.30623 10.1435 5.2139C10.1434 5.12154 10.0773 5.04246 9.9865 5.02597Z"
          fill="#F4A32C"
        />
      </svg>
      <svg
        class="small-star"
        width="4"
        height="5"
        viewBox="0 0 4 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.58775 1.986C2.84385 1.73929 2.35177 1.18491 2.11234 0.418741C2.06932 0.281198 1.92433 0.282705 1.92984 0.28461C1.84627 0.28461 1.77237 0.338923 1.7474 0.418628C1.51542 1.15915 1.02997 1.7257 0.271961 1.98523C0.100182 2.04406 0.100011 2.2881 0.27199 2.34699C1.02508 2.60478 1.51369 3.16687 1.74763 3.91439C1.79079 4.05224 1.93553 4.05022 1.93044 4.04846C2.01415 4.04832 2.08803 3.99372 2.11277 3.91373C2.28577 3.3542 2.59097 2.92159 3.01989 2.6279L3.01992 2.62787C3.48885 2.30661 3.71907 2.39982 3.71872 2.16716C3.71864 2.08487 3.66586 2.0119 3.58775 1.986Z"
          fill="#F4D44E"
        />
      </svg>
    </div>
    <!-- <transition name="horizontal-collapse">
        <span v-show="!store.exploreAnimation">HYPD Explore</span>
      </transition> -->
  </div>
</template>

<script setup>
const store = useStore();

const timeout = ref(null);
onMounted(() => {
  if (store.exploreAnimation) {
    showAnimation();
  }
});

function showAnimation() {
  if (!timeout.value) {
    timeout.value = setTimeout(() => {
      store.toggleExploreAnimation();
    }, 2000);
  } else {
    clearTimeout(timeout.value);
  }
}
</script>

<style scoped>
.hide-title span {
  display: none !important;
}
.explore-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  cursor: pointer;
}
span {
  color: #000;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.2px;
  padding: 0 0 0 8px;
  user-select: none;
  white-space: nowrap;
  max-width: calc(100% - 16px);
  text-overflow: ellipsis;
  overflow: hidden;
}

.explore-icon {
  position: relative;
  will-change: max-width;
  display: flex;
  align-items: center;
  justify-content: center;
}

.explore-icon .star {
  position: absolute;
  top: 0px;
  right: 0;
  animation: scale-toggle 3s ease-in-out infinite 0s;
}

.explore-icon .small-star {
  position: absolute;
  right: 7px;
  top: 7px;
  width: 8px;
  height: 8px;
  animation: scale-toggle 3s ease-in-out infinite 1s;
}

@keyframes scale-toggle {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}

.horizontal-collapse-enter-from,
.horizontal-collapse-leave-to {
  max-width: 0;
}

.horizontal-collapse-enter-to,
.horizontal-collapse-leave-from {
  max-width: 95.13px;
}

.horizontal-collapse-leave-active,
.horizontal-collapse-enter-active {
  transition: all 0.5s ease-in-out;
}

.dark span {
  color: #fff !important;
}
</style>