<template>
  <section class="variant-section">
    <div class="heading-wrapper">
      <h2>
        Select
        <span style="text-transform: capitalize">{{ variantType }}</span>
        <span class="error">(Please select a variant)</span>
      </h2>
      <div class="variant-listing">
        <div v-for="variant in productVariants" :key="variant.id" class="variant-wrapper" :class="{
          'selected-variant': isSelected(variant.id),
          'oos-variant': isOutOfStock(variant),
        }">
          <div @click="selectVariant(variant)" class="variant">
            {{ variant.attribute }}
          </div>
          <div v-if="variant?.inventory_info?.unit_in_stock < 10 && variant?.inventory_info?.unit_in_stock > 0"
            class="low-in-stock tag">
            {{ variant.inventory_info?.unit_in_stock }} Left
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import track from '~/utils/tracking-posthog';

// import { computed, onUpdated, watch } from "vue";

const product = useProductStore();
const productVariants = computed(() => {
  return product.info?.variants;
});
const variantType = computed(() => {
  return product.info?.variant_type;
});

// watch(productVariants, (newValue) => {
//   if (
//     newValue?.length == 1 &&
//     newValue[0]?.inventory_info?.status?.value !== "out_of_stock"
//   ) {
//     store.dispatch("product/updateProductInfo", {
//       selected_variant: newValue[0],
//     });
//   } 
// });

function selectVariant(variant) {

  track('pdp:select_variant_click', {
    item_id: product.info.id,
    brand_id: product.info.brand_id,
    variant_id: variant.id,
  })

  if (variant.id == product.info?.selected_variant?.id) {
    return;
  } else {
    product.updateProductInfo({
      selected_variant: { ...variant },
    });
  }
}

function isSelected(id) {
  if (id && product.info?.selected_variant?.id) {
    return product.info?.selected_variant?.id == id;
  } else {
    return false;
  }
}

function isOutOfStock(variant) {
  return (
    variant?.inventory_info?.status?.value == "out_of_stock" ||
    variant?.inventory_info?.unit_in_stock == 0
  );
}
</script>

<style scoped>
.variant-section {
  padding: 0px;
}

h2 {
  color: var(--primary-black, #13141b);
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
  margin: 0;
  padding: 16px 16px 0;
}

.variant-listing {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  padding: 16px;
  overflow: scroll hidden;
}

.variant {
  height: 49px;
  min-width: 49px;
  width: fit-content;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--primary-border-color);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;

  color: var(--primary-black, #13141b);
  text-align: center;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
}

.variant:hover {
  background: #4791ff;
  color: var(--plain-white, #fff);
  font-family: "Urbanist-Medium";
  border: 1px solid var(--primary-border-color);
  text-decoration: underline;
}

.oos-variant .variant {
  background: var(--light-hover, #dededeee);
  pointer-events: none;
  font-family: "Urbanist-Bold";
  opacity: 50%;
  position: relative;
}

.oos-variant .variant::after {
  content: "";
  position: absolute;
  right: 0;
  top: 24px;
  height: 1px;
  width: 100%;
  transform: rotate(150deg);
  background: var(--secondary-text, #595959);
}

.selected-variant .variant {
  background: #4791ff;
  color: var(--plain-white, #fff);
  font-family: "Urbanist-Bold";
  border: 1px solid var(--links, #4791ff);
}

.selected-variant .variant:hover {
  font-family: "Urbanist-Bold" !important;
  border: 1px solid var(--links, #4791ff) !important;
  text-decoration: none !important;
}

.low-in-stock {
  font-family: "Urbanist-Bold";
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
  text-align: center;
  color: var(--green);
  border: 1px solid var(--green);
  border: 1px solid var(--green);
  border-radius: 4px;
  padding: 2px;
  box-sizing: border-box;
  margin: 6px 0 0;
  white-space: nowrap;
}

.wiggle .variant-listing {
  animation: wiggle 0.2s ease-in 0s 3;
}

@keyframes wiggle {
  0% {
    transform: translateX(0px);
  }

  25% {
    transform: translateX(-4px);
  }

  50% {
    transform: translateX(0px);
  }

  75% {
    transform: translateX(4px);
  }

  100% {
    transform: translateX(0px);
  }
}

.error {
  display: none;
  font-family: "Urbanist-Regular";
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.2px;
  color: var(--red);
  vertical-align: middle;
  padding: 0 0 0 4px;
  animation: wiggle 0.25s linear 0s 1;
}

.wiggle .error {
  display: inline;
}
</style>