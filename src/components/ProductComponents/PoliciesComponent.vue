<template>
  <div class="policies-wrapper">
    <section class="policy-section" v-for="(policy, index) in brandInfo.policies" :key="index">
      <div class="policy-heading" @click="expandPolicy(policy)">
        <h3>{{ policy.name }}</h3>
        <svg class="arrow" width="14" height="7" viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.72003 0.966675L6.0667 5.31334C6.58003 5.82668 7.42003 5.82668 7.93336 5.31334L12.28 0.966675"
            stroke="#13141B" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <transition name="expand-down">
        <div class="policy-info" v-show="!!expandedPolicies[policy.name]">
          <ol>
            <li v-for="(info, j) in policy.value" :key="j">
              {{ info.name }}
              <p>
                {{ info.value }}
              </p>
            </li>
          </ol>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup>
import track from '~/utils/tracking-posthog';

const expandedPolicies = ref({});
const brandInfo = ref({});
const product = useProductStore();
const runtimeConfig = useRuntimeConfig();

if (product.info?.brand_id) {
  const { data: brand, pending: fetchingBrandInfo } = await useFetch(
    `${runtimeConfig.public.entityURL}/api/app/brand/${product.info.brand_id}`,
    {
      key: 'brand_info',
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  brandInfo.value = { ...brand.value.payload };
}

const policies = computed(() => {
  return brandInfo.value.policies;
});
const productInfo = computed(() => {
  return product?.info;
});

function expandPolicy(policy) {
  let trackingDetails = {
    item_id: product.info.id,
    brand_id: product.info.brand_id,
  }
  if (policy.name == 'Return Policy') {
    track('pdp:return_policy_click', {
      ...trackingDetails
    })
  } else if (policy.name == 'Refund Policy') {
    track('pdp:refund_policy_click', {
      ...trackingDetails
    })
  }
  else if (policy.name == 'Cancellation Policy') {
    track('pdp:cancellation_policy_click', {
      ...trackingDetails
    })
  }
  else if (policy.name == 'Shipping Policy') {
    track('pdp:shipping_policy_click', {
      ...trackingDetails
    })
  }

  if (!!expandedPolicies.value[policy.name]) {
    delete expandedPolicies.value[policy.name];
  } else {
    expandedPolicies.value[policy.name] = { ...policy };
  }
}
</script>

<style scoped>
.policies-wrapper {
  padding: 0;
}

section {
  padding: 16px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--primary-border-color);
  background: var(--plain-white, #fff);
  cursor: pointer;
}

.policy-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

h3 {
  margin: 0;
  color: #000;
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.2px;
}

p {
  margin: 0;
}

ol {
  padding: 12px 12px 0;
  margin: 0;
}

li {
  color: var(--secondary-text, #5c5c5c);
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

.expand-down-enter-from,
.expand-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-down-enter-to,
.expand-down-leave-from {
  opacity: 1;
  max-height: 700px;
}

.expand-down-enter-active {
  transition: all 0.45s ease-in-out;
}

.expand-down-leave-active {
  transition: all 0.35s ease-in-out;
}
</style>