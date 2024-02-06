<template>
  <div @keypress="keypress" class="image-preview-wrapper" :key="props.index">
    <div @click="emit('close')" class="backdrop"></div>
    <div class="image-preview-container">
      <button @click="emit('close')" class="close">
        <img src="@/assets/icons/misc/close.svg" alt="close" srcset="" />
      </button>
      <div class="navigation-btns">
        <button
          @click="changeImage('back', index)"
          :class="{ disabled: index == 0 }"
          class="back"
        >
          <img src="@/assets/icons/misc/back.svg" alt="back" srcset="" />
        </button>
        <button
          @click="changeImage('forward', index)"
          :class="{ disabled: index == mediaImages?.length - 1 }"
          class="forward"
        >
          <img src="@/assets/icons/misc/forward.svg" alt="forward" srcset="" />
        </button>
      </div>

      <div class="image-container">
        <img
          style="object-fit: contain"
          v-if="activeImage"
          :src="activeImage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ImageFrame from "../ImageFrame.vue";

const props = defineProps({
  mediaImages: Array,
  index: Number,
});

const emit = defineEmits(["updateImageIndex", "close"]);

const activeImage = computed(() => {
  if (props.mediaImages?.length > 0) {
    return props.mediaImages[props.index]?.media_info?.url;
  }
});

document.onkeydown = function (e) {
  if (e.code == "ArrowRight") {
    changeImage("forward");
  } else if (e.code == "ArrowLeft") {
    changeImage("back");
  } else if (e.code == "Escape") {
    emit("close");
  }
};

function changeImage(type) {
  if (type == "forward" && props.mediaImages?.length - 1 > props.index) {
    emit("updateImageIndex", props.index + 1);
  } else if (type == "back" && props.index > 0) {
    emit("updateImageIndex", props.index - 1);
  }
}
</script>

<style scoped>
@media only screen and (max-width: 520px) {
  .image-preview-wrapper {
    display: none;
  }
  /* .image-preview-container {
    height: 100dvh !important;
    width: 100dvw !important;
    top: 0;
    left: 0;
    transform: translate(0, 0);
    border-radius: 0 !important;
  }

  .image-container {
    height: calc(100% - 120px) !important;
    width: 100% !important;
  } */
}
.image-preview-container {
  position: fixed;
  width: calc(100dvw - 64px);
  height: calc(100dvh - 64px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 55;
  max-width: 1080px;

  background: var(--plain-white);
  border-radius: 32px;
  box-sizing: border-box;
  padding: 16px;
}

.image-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  height: calc(100% - 3px);
  max-width: calc(100% - 120px);
}
.image-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: all 0.25s linear;
  /* cursor: zoom-in; */
}

.close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--plain-white);
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
}

.navigation-btns button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 43;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  background: var(--plain-white);
  width: 32px;
  height: 32px;
}
.navigation-btns .back {
  left: 16px;
}
.navigation-btns .forward {
  right: 16px;
}

.close img,
.forward img,
.back img {
  width: 32px;
  height: 32px;
}

.disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
</style>