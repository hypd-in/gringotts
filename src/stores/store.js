import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const user = ref({});
  const exploreAnimation = ref(false);

  function saveUserInfo(userInfo) {
    user.value = { ...userInfo };
  }

  function toggleExploreAnimation(value) {
    exploreAnimation.value = value;
  }

  return {
    user,
    exploreAnimation,
    saveUserInfo,
    toggleExploreAnimation,
  };
});
