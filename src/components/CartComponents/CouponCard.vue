<template>
    <div class="coupon-card-wrapper" :class="{
        'active-container': isSelectedCoupon,
        'disabled-coupon-btn': couponInfo.disabled,
    }">
        <div class="coupon-card">
            <ImageFrame class="coupon-logo" border_radius="8px" v-if="couponInfo" :src="couponInfo?.logo?.src" />
            <div class="coupon-code">
                {{ couponInfo?.code }}
            </div>
            <div class="apply-btn" v-if="!isSelectedCoupon" @click="applyCoupon"
                :class="{ 'coupon-apply-loader': loading }">
                Apply
            </div>
            <div class="applied-btn" v-else>
                <span><svg data-v-00cd9d14="" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                        fill="none">
                        <path data-v-00cd9d14=""
                            d="M9.99984 18.3335C14.5832 18.3335 18.3332 14.5835 18.3332 10.0001C18.3332 5.41681 14.5832 1.66681 9.99984 1.66681C5.4165 1.66681 1.6665 5.41681 1.6665 10.0001C1.6665 14.5835 5.4165 18.3335 9.99984 18.3335Z"
                            stroke="#23D087" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path data-v-00cd9d14="" d="M6.4585 10.0001L8.81683 12.3585L13.5418 7.64178" stroke="#23D087"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg></span><span>Applied</span>
            </div>
        </div>

        <div class="coupon-title">
            {{ couponInfo?.title }}
        </div>
        <div class="coupon-description" @click="expandDescription">
            {{ expandCouponDescription }}
        </div>
        <div class="coupon-msg" v-html="couponInfo.coupon_msg" @click="goToEligibleProducts"></div>
    </div>
</template>
  
<script setup>
import { getBrandInfoFromBrandId } from "@/utils/globalAPIs";
import ImageFrame from "../ImageFrame.vue";
import { computed, ref } from "vue";
import { applyExpressCoupon, applyCartCoupon } from "@/utils/globalAPIs";
import { getCreatorUserName } from "@/utils/helperMethods.js";
import track from "~/utils/tracking-posthog";
const props = defineProps({
    couponInfo: Object,
});
const emit = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();
const store = useStore();
const creatorStore = useCreatorStore();

const expandDescriptionFlag = ref(false);
const loading = ref(false);
const expandDescription = () => {
    expandDescriptionFlag.value = true;
};
const expandCouponDescription = computed(() => {
    return expandDescriptionFlag.value
        ? props.couponInfo?.description
        : props.couponInfo?.description.substring(0, 125) +
        (props.couponInfo?.description.length > 125 ? "..." : "");
});
const isSelectedCoupon = computed(() => {
    return store.cartInfo?.coupon?.id == props.couponInfo.id;
});
const applyCoupon = async () => {
    if (loading.value || props.couponInfo.disabled) {
        return;
    }
    let payload = null;
    loading.value = true;
    if (route.query.isExpress) {
        payload = await applyExpressCoupon(props.couponInfo?.code);
    } else {
        payload = await applyCartCoupon(props.couponInfo?.code);
    }
    track('cart_coupon:coupon_apply_click', { ...store.cartDataToTrack, coupon: { ...store.cartDataToTrack?.coupon, discount_added: payload?.coupon_value?.value, discount_removed: 0 } })
    loading.value = false;
    if (payload) {
        emit("close");
    }
};
const goToEligibleProducts = async () => {
    let creator_username = null;
    creator_username = await getCreatorUserName();
    if (!creator_username) {
        return;
    }
    if (props.couponInfo.applicable_on.name == 'bundle' && props.couponInfo.disabled) {
        await goToBundleProducts(props.couponInfo);
    }
    if (
        props.couponInfo.applicable_on.name == "bxgy" &&
        props.couponInfo.disabled
    ) {
        if (props.couponInfo.applicable_on.bxgy?.sub_type == "brand") {
            let brand_info = await getBrandInfoFromBrandId(
                props.couponInfo.applicable_on.bxgy.get_ids[0]
            );
            router.push({
                name: "BrandProfile",
            });
        } else if (props.couponInfo.applicable_on.bxgy?.sub_type == "catalog") {
            store.saveBxGyGetIds([
                ...props.couponInfo.applicable_on.bxgy.get_ids,
            ]);
            router.push({
                name: "BxGy",
                params: {
                    creator_username: creator_username,
                },
            });
        }
    }
    if (
        props.couponInfo.applicable_on.name == "brand" &&
        props.couponInfo.applicable_on.ids.length == 1
    ) {
        let brand_info = await getBrandInfoFromBrandId(
            props.couponInfo.applicable_on.ids[0]
        );
        router.push({
            name: "BrandProfile",
        });
    }
};

async function goToBundleProducts(offer) {
    navigateTo({
        name: "EligibleProducts",
        params: {
            creatorUsername: await getCreatorUserName(),
            couponId: offer.id,
        },
        query: {
            isBundle: true,
        }
    });
}
</script>
  
<style scoped>
.link-eligible-items {
    border-bottom: 1px dotted #fc404d;
    cursor: pointer;
}
</style>
<style scoped>
.coupon-msg {
    margin: 9px 0 0 0;
    font-size: 12px;
}

.coupon-card {
    display: grid;
    grid-template-columns: auto 1fr 2fr;
    gap: 16px;
    align-items: center;
    justify-content: flex-start;
}

.coupon-card-wrapper {
    position: relative;
    padding: 16px;
    border: 1px solid var(--primary-border-color);
    border-radius: 8px;
    margin: 0 auto 12px;
}

.coupon-card-wrapper:hover {
    border: 1px solid #a9a9a9;
}

.coupon-logo {
    width: 60px;
    height: 60px;
}

.coupon-title {
    margin: 16px 0 8px 0;
}

.apply-btn {
    font-family: Urbanist-Bold;
    color: #fb6c23;
    justify-self: self-end;
    cursor: pointer;
}

.coupon-apply-loader {
    pointer-events: none;
}

.coupon-description {
    white-space: pre-wrap;
}

.coupon-apply-loader:after {
    content: "";
    height: 2px;
    width: 10px;
    background: #fb6c23;
    position: relative;
    left: 0;
    bottom: 0;
    display: block;
    animation: liner-loader 1.2s infinite;
}

.disabled-coupon-btn::after {
    opacity: 0.6;
    cursor: not-allowed;
    content: "";
    z-index: 72;
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100% - 42px);
    width: 100%;
    background: #ffffffff;
}

.disabled-coupon-btn:hover {
    border: 1px solid var(--primary-border-color);
}

@keyframes liner-loader {
    0% {
        left: 0;
    }

    50% {
        left: calc(100% - 10px);
    }

    100% {
        left: 0;
    }
}

.applied-btn {
    gap: 4px;
    display: flex;
    font-family: Urbanist-Bold;
    color: #23d087;
    justify-self: self-end;
    cursor: pointer;
}

.active-container {
    border: 1px solid #23d087 !important;
    box-shadow: rgb(35 208 135 / 14%) 0px 6px 9px 0px;
}
</style>