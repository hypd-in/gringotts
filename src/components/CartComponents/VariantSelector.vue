<template>
  <div class="variant-selector-wrapper">
    <div class="backdrop" @click="closePopup"></div>
    <div class="bottom-sheet-container">
      <div class="heading">
        <span>Select {{ itemInfo?.catalog_info?.variant_type }}</span>
      </div>
      <div class="variant-selector-container" :class="{ wiggle: showError != '' }">
        <div class="variant" :class="{
          'selected-variant': itemInfo?.variant_id == id,
          'oos-variant':
            variant.inventory_info?.status?.value == 'out_of_stock',
        }" @click="selectVariant(variant)" v-for="(variant, id) in itemInfo?.variants" :key="id">
          {{ variant?.attribute }}
        </div>
      </div>
      <div class="error">
        <transition name="slide-fade-in">
          <span v-if="showError != ''">
            {{ showError }}
          </span>
        </transition>
      </div>
      <div @click="closePopup" class="close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Close">
            <g id="add">
              <path id="Union 1" fill-rule="evenodd" clip-rule="evenodd"
                d="M16.2004 18.0007L11.9998 13.8001L7.8001 17.9998C7.30279 18.4971 6.49713 18.4971 6 18C5.50342 17.5034 5.50342 16.6978 6.00073 16.2004L10.2004 12.0007L5.99981 7.80011C5.50342 7.30371 5.50342 6.49658 6 6C6.49731 5.50269 7.30371 5.50342 7.8001 5.99982L12.0007 10.2004L16.2004 6.00074C16.6978 5.50342 17.5034 5.50341 18 5.99999C18.4971 6.49713 18.4971 7.30279 17.9998 7.80011L13.8001 11.9998L18.0007 16.2004C18.4973 16.697 18.4973 17.5027 18 18C17.5034 18.4966 16.697 18.4973 16.2004 18.0007Z"
                fill="#13141B" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { updateVariant } from "@/utils/cartMethods";
import { ref } from "vue";
import track from "~/utils/tracking-posthog";

const props = defineProps({
  itemInfo: Object,
});

onMounted(() => {
  track("cart_variant:visit", {
    ...variantDataTracking
  })
})

const emits = defineEmits(["close"]);

const showError = ref("");
const errorTimeout = ref(null);

const store = useStore()

let variantDataTracking = {
  variants: { ...props.itemInfo.variants },
  current_varient: { ...props.itemInfo.variants[props.itemInfo.variant_id] },
}

function closePopup() {
  track('cart_variant:select_variant_close', {
    ...variantDataTracking
  })
  emits("close");
}

async function selectVariant(variantInfo) {
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value);
    showError.value = "";
  }
  if (variantInfo?.inventory_info?.status?.value == "out_of_stock") {
    showError.value = "Sorry!, this variant is out of stock";
    errorTimeout.value = setTimeout(() => {
      showError.value = "";
    }, 1250);
    return;
  }
  if (store.cartItems[variantInfo.id]) {
    showError.value = "Item already in cart";
    errorTimeout.value = setTimeout(() => {
      showError.value = "";
    }, 1400);
    return;
  }
  await updateVariant(props.itemInfo?.variant_id, variantInfo);

  track('cart_variant:select_variant_click', {
    ...variantDataTracking,
    new_varient: { ...variantInfo }
  })
  emits("close");
}
</script>

<style scoped>
.error {
  position: absolute;
  bottom: 10px;
}

.error span {
  display: block;
  color: var(--red);
  font-family: "Urbanist-Regular";
  font-size: 12px;
  letter-spacing: 0.2px;
  line-height: 16px;
}

.wiggle {
  animation: wiggle 0.35s linear;
}

.backdrop {
  z-index: 54;
}

.bottom-sheet-container {
  z-index: 55;
  max-width: 420px;
  padding: 24px 24px 12px;
}

.variant-selector-container {
  width: 100%;
  overflow: auto hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 24px 0;
  position: relative;
}

.heading {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 22px;
  text-transform: capitalize;
}

.variant {
  min-width: 48px;
  height: 48px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 14px;
  background: #f9f9f9;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  text-align: center;
  user-select: none;
  cursor: pointer;
}

.selected-variant {
  border: 1px solid var(--primary-black, #13141b);
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;

  cursor: pointer;
}

.oos-variant {
  cursor: not-allowed;
  color: var(--disabled-text, #bebebe);
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}
</style>