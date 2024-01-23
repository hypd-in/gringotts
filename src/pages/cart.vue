<template>
    <div class="cart-wrapper" :class="{
        'empty-cart-wrapper': noOfCartItems == 0,
        'cart-wrapper-error': errorMessage != '',
    }">

        <div class="cart-container" v-if="noOfCartItems > 0">
            <div class="left-container">
                <section class="address-section">
                    <AddressBar @openAddresses="toggleAddressComponent" @goToLogin="triggerLogin" class="address-bar" />
                </section>

                <!-- Gift eligible items banner-->
                <div :class="{
                    'scrollable-coupon-element':
                        getObjectLength(store.giftsEligibleForCart) > 0,
                }" class="applicable-coupons-listing">
                    <!-- Banners for Gift eligiblity -->
                    <div v-show="!route.query.isExpress &&
                        getObjectLength(store.giftsEligibleForCart) > 0 &&
                        !store.giftsEligibleForCart[key].gift &&
                        !hideBanner
                        " v-for="(giftItems, key) in store.giftsEligibleForCart" :key="key" class="applicable-coupon">
                        <img src="@/assets/img/gift.svg" alt="" />

                        <div class="coupon-info">
                            <h5>Get Free Product</h5>
                            <p>{{ getFreeGiftText(store.brandWiseGifts[key][0]) }}</p>
                            <div class="eligible-button" @click="
                                showGiftEligibleProducts(store.brandWiseGifts[key][0])
                                ">
                                See eligible items
                            </div>
                        </div>
                    </div>
                </div>
                <NuxtPage class="router-view"></NuxtPage>
            </div>

            <div class="seperator"></div>

            <div class="right-container">
                <section class="coupon-section">
                    <CouponBar @goToLogin="triggerLogin" class="coupon-bar" />
                </section>

                <section class="pricing-info">
                    <PriceInfo class="price-info" />
                </section>

                <section class="payment-section">
                    <Allpayments v-if="route.name != 'CartPayment'" @triggerLogin="triggerLogin" />
                </section>
            </div>
        </div>

        <EmptyCart v-if="noOfCartItems == 0" />
        <transition name="">
            <AddressComponent @close="toggleAddressComponent" v-if="showAddress" />
        </transition>

        <LoginFlow @close="triggerLogin" v-if="isLoggedIn" />
        <section class="button-section" v-if="noOfCartItems > 0 && route.name == 'CartItems'">
            <div v-if="errorMessage != ''" class="error">
                {{ errorMessage }}
            </div>
            <Submit @click="checkForLogin" :disabled="checkCartValidity()" defaultText="Place Order"
                @submit="completePayment" />
        </section>
    </div>
</template>
  
<script setup>

definePageMeta({
    name: "CartItems",
});



// Imports
import AddressBar from "@/components/CartComponents/AddressBar.vue";
import AddressComponent from "@/components/UserAddresses/AddressComponent.vue";
import LoginFlow from "@/components/LoginComponents/LoginFlow.vue";
import CouponBar from "@/components/CartComponents/CouponBar.vue";
import PriceInfo from "@/components/CartComponents/PriceInfo.vue";
import Allpayments from "~/components/CartComponents/Allpayments.vue";
import Submit from "@/components/SubmitButton.vue";
import EmptyCart from "~/components/CartComponents/EmptyCart.vue";
import {
    getCartItemsFromLocalStorage,
    getExpressCheckoutProductInfo,
} from "@/utils/cartMethods";
import { getObjectLength } from "@/utils/helperMethods";
import {
    computed,
    onMounted,
    ref,
} from "vue";
import {
    fetchCartInfo,
    getGiftInfo,
} from "@/utils/globalAPIs";

// uncmnt later
// import { trackingBeginCheckout } from "@/eventTracking";

// Props, Emits, Store etc..
const router = useRouter();
const route = useRoute();

const store = useStore()

const creatorStore = useCreatorStore();

// Navigation Guard
onBeforeRouteLeave(async (to, from) => {
    if (
        (from.name == "CartItems" || from.name == "CartPayment") &&
        (isLoggedIn.value || showAddress.value)
    ) {
        isLoggedIn.value = false;
        showAddress.value = false;
        return false;
    }
    if (from.query.isExpress && !to.query.isExpress) {
        if (store.user?.id) {
            await fetchCartInfo(true);
        } else {
            await getCartItemsFromLocalStorage();
        }
    }

    return true;
});

// Variables
const isLoggedIn = ref(false);
const showAddress = ref(false);
const errorMessage = computed(() => {
    if (!store.cartInfo.shipping_address?.id) {
        return "Please select an address to continue";
    } else if (store.cartItems) {
        for (const key in store.cartItems) {
            if (
                store.cartItems[key]?.variants[key]?.inventory_info?.status
                    ?.value == "out_of_stock" ||
                store.cartItems[key]?.variants[key]?.inventory_info
                    ?.unit_in_stock < store.cartItems[key]?.quantity
            ) {
                return "One or more items in your cart are out of stock";
            }
        }
    } else {
        return "";
    }
});

const giftInfo = ref({});

let hideBanner = false;

// LifecycleHooks
onMounted(async () => {
    if (store.user?.id) {
        if (route.query.isExpress && route.name != "CartPayment") {
            if (store.cartInfo?.coupon?.id) {
                store.updateCartInfo({ coupon: null, coupon_value: null });
            }
            await getExpressCheckoutProductInfo(
                route.query.pid,
                route.query.vid,
                route.query.creatorId
            );
            return;
        }
        // else {
        //   await fetchCartInfo();
        // }
    } else {
        if (route.query.isExpress) {
            await getExpressCheckoutProductInfo(
                route.query.pid,
                route.query.vid,
                route.query.creatorId
            );
            return;
        } else {
            await getCartItemsFromLocalStorage();
        }
    }

    giftInfo.value = await getGiftInfo();
    store.setBrandWiseGift({ ...giftInfo.value });
});

const noOfCartItems = computed(() => {
    return Object.keys(store.cartItems)?.length;
});

function showGiftEligibleProducts(gift) {
    router.push({
        name: "GiftEligibleProducts",
        params: {
            creator_username: creatorStore?.info?.username,
            id: gift.id,
            giftData: JSON.stringify({
                products: gift.type == "catalog" ? [...gift.buy_catalog_ids] : null,
                type: gift.type,
            }),
            isGift: true,
        },
    });
}

function getFreeGiftText(gift) {
    // brand Level

    hideBanner = false;

    if (gift.type == "brand" && gift.buy_count) {
        return `Add ${gift.buy_count -
            store.brandWiseCartItems[gift.brand_id]?.totalQuantity
            } more product(s) from ${store.brandWiseCartItems[gift.brand_id]?.name
            } and complete the offer.`;
    }

    // catalogs with purchase limit
    else if (
        gift.type == "catalog" &&
        gift.buy_count &&
        store.brandWiseCartItems[gift.brand_id]
    ) {
        let count = 0;
        store.brandWiseCartItems[gift.brand_id].items.forEach((item) => {
            let check = checkBxgy(item);
            if (gift.buy_catalog_ids.includes(item.catalog_id)) {
                if (check) {
                    count += item?.quantity - item?.coupon_applied?.quantity;
                } else {
                    count += item?.quantity;
                }
            }
        });
        return `Add ${gift.buy_count - count
            } more product(s) from this list and complete the offer.`;
    }

    // catalogs with no purchase limit (i.e. buy all)
    else if (
        gift.type == "catalog" &&
        !gift.buy_count &&
        store.brandWiseCartItems[gift.brand_id]
    ) {
        let count = 0;
        store.brandWiseCartItems[gift.brand_id].items.forEach((item) => {
            let check = checkBxgy(item);
            if (gift.buy_catalog_ids.includes(item.catalog_id)) {
                if (check) {
                    count += item?.quantity - item?.coupon_applied?.quantity;
                } else {
                    count += item.quantity;
                }
            }
        });
        return `Add ${gift.buy_catalog_ids.length - count
            } more product(s) from this list and complete the offer.`;
    }

    // value with flat value on cart
    else if (
        gift.type == "value" &&
        gift.value_type == "flat" &&
        store.brandWiseCartItems[gift.brand_id]
    ) {
        return `Add products worth ₹${gift.min_purchase_value.value -
            store.brandWiseCartItems[gift.brand_id]?.totalRetailPrice
            } more from ${store.brandWiseCartItems[gift.brand_id]?.name
            } to complete this offer.`;
    }

    // value with ranges in cart
    else if (
        gift.type == "value" &&
        gift.value_type == "range" &&
        store.brandWiseCartItems[gift.brand_id]
    ) {
        for (let i = 0; i < gift.ranges.length - 1; i++) {
            if (
                store.brandWiseCartItems[gift.brand_id]?.totalRetailPrice >
                gift.ranges[i].max_value &&
                store.brandWiseCartItems[gift.brand_id]?.totalRetailPrice <
                gift.ranges[i + 1].min_value
            ) {
                return `Add product(s) worth ₹${gift.ranges[i + 1].min_value -
                    store.brandWiseCartItems[gift.brand_id]?.totalRetailPrice
                    } more from ${store.brandWiseCartItems[gift.brand_id]?.name
                    } to complete this offer.`;
            } else if (
                store.brandWiseCartItems[gift.brand_id]?.totalRetailPrice <
                gift.ranges[i].min_value
            ) {
                return `Add product(s) worth ₹${gift.ranges[i].min_value -
                    store.brandWiseCartItems[gift.brand_id]?.totalRetailPrice
                    } more from ${store.brandWiseCartItems[gift.brand_id]?.name
                    } to complete this offer.`;
            } else {
                hideBanner = true;
            }
        }
    }
}

function checkBxgy(item) {
    return (
        item.retail_price?.value * item.coupon_applied?.quantity -
        item.coupon_applied?.value ==
        item.coupon_applied?.quantity &&
        item.quantity - item.coupon_applied?.quantity >= 0
    );
}

function checkForLogin() {
    if (
        !store.user?.id ||
        !store.user?.full_name ||
        !store.user?.email ||
        store.user?.full_name == "" ||
        store.user?.email == ""
    ) {
        triggerLogin();
    } else if (errorMessage.value?.includes("out of stock")) {
        var oosItems = document.querySelector(".out-of-stock-items");
        if (oosItems) {
            oosItems.scrollIntoView({
                behavior: "smooth",
            });
        }
    }
}

function completePayment() {
    if (store.user?.id) {
        router.push({
            name: "CartPayment",
            query: {
                ...route.query,
            },
        });
        localStorage.setItem(
            "isExpress",
            JSON.stringify({
                express: true,
                url: {
                    name: "CartPayment",
                    query: {
                        ...route.query,
                    },
                },
            })
        );


        // uncmnt later
        // trackingBeginCheckout(store.cartInfo);
    } else if (
        !store.user?.id ||
        !store.user?.full_name ||
        !store.user?.email ||
        store.user?.full_name == "" ||
        store.user?.email == ""
    ) {
        triggerLogin();
        return;
    }
}

function triggerLogin() {
    isLoggedIn.value = !isLoggedIn.value;
}

function toggleAddressComponent() {
    showAddress.value = !showAddress.value;
}

function checkCartValidity() {
    let adderss_flag = false;
    let oos_flag = false;
    if (!store.cartInfo.shipping_address?.id) {
        adderss_flag = true;
    }
    if (store.cartItems) {
        for (const key in store.cartItems) {
            if (
                store.cartItems[key]?.variants[key]?.inventory_info?.status
                    ?.value == "out_of_stock" ||
                store.cartItems[key]?.variants[key]?.inventory_info
                    ?.unit_in_stock < store.cartItems[key]?.quantity
            ) {
                return true;
            }
        }
    }
    return adderss_flag || oos_flag;
}
</script>
  
<style scoped>
.listing-child {
    display: flex;
}

h5 {
    color: var(--primary-dark, #13141b);
    font-family: Urbanist-Bold;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.2px;
    margin: 2px 0 0;
}

p {
    margin: 2px 0 4px;
    color: var(--secondary-text, #5c5c5c);
    font-family: Urbanist-Regular;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.2px;
}

.coupon-info .eligible-button {
    color: var(--primary-orange, #fb6c23);
    font-family: Urbanist-Bold;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 0.2px;
    background: none;
    height: auto;
    margin: 5px 0 0 0;
    width: auto;
    cursor: pointer;
}

.coupon-info button:hover {
    text-decoration: underline;
}

.applicable-coupons-listing {
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-start;
    overflow: scroll hidden;
    /* padding: 16px; */
}

.applicable-coupons-listing::-webkit-scrollbar {
    height: 0;
    width: 0;
}

.scrollable-coupon-element .applicable-coupon {
    min-width: calc(100% - 64px);
}

.applicable-coupon {
    width: 100%;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #e6f9ee;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    position: relative;
}

.applicable-coupon .code {
    display: inline-flex;
    padding: 2px 4px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;

    border-radius: 2px;
    border: 1px dashed #004d23;
    background: #01c159;

    color: #fff;
    font-family: Urbanist-Medium;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
}

.cart-wrapper {
    height: calc(100vh);
    height: calc(100dvh);
    overflow: hidden scroll;
}

.cart-wrapper * {
    box-sizing: border-box;
}

.cart-wrapper::-webkit-scrollbar {
    width: 0;
}

.cart-container {
    display: grid;
    grid-template-columns: calc(50% - 16px - 1px) calc(14px) calc(50% - 16px - 8px);

    max-width: 1029px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin: 0 auto 0;
    padding: 16px;
}

.left-container,
.right-container {
    max-width: 520px;
}

.seperator {
    width: 1px;
    background: rgba(0, 0, 0, 0.1);
    height: 100%;
    justify-self: center;
}

.header-section {
    padding: 0;
}

.button-section {
    display: none;
    background: var(--plain-white, #fff);
    padding: 5px 16px 10px;
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 24;
    margin: 0;
}

button {
    display: flex;
    width: calc(100%);
    margin: 0 auto;
    height: 48px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 14px;
    background: var(--primary-orange, #fb6c23);

    color: var(--back-ground, #fff);
    font-family: Urbanist-Bold;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.2px;
}

.address-bar,
.coupon-bar,
.price-info {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: var(--back-ground, #fff);
    overflow: hidden;
}

section,
.router-view {
    margin: 8px 0;
}

@media only screen and (max-width: 520px) {
    .payment-section {
        display: none;
    }

    .cart-container {
        display: block;
        padding: 0;
        top: 0;
        width: 100%;
        margin: 0;
    }

    section,
    .router-view {
        margin: 4px 0;
    }

    .address-bar,
    .coupon-bar,
    .price-info {
        border-radius: 0;
        border: 0;
        background: var(--back-ground, #fff);
    }

    .cart-wrapper {
        padding: 0;
        height: calc(100vh - 49px - 69px);
        height: calc(100dvh - 49px - 69px);
        margin: 0 auto 69px;
        background: var(--background-grey, #f9f9f9);
    }

    .cart-wrapper.cart-wrapper-error {
        height: calc(100dvh - 49px - 80px);
        margin: 0 auto 80px;
    }

    .empty-cart-wrapper {
        margin: 49px auto 0;
        height: calc(100vh - 49px) !important;
        height: calc(100dvh - 49px) !important;
    }

    .button-section {
        display: block !important;
    }

    .error {
        font-family: "Urbanist-Regular";
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.2px;
        padding: 0 0 4px;
        text-align: center;
        color: var(--red);
    }
}
</style>