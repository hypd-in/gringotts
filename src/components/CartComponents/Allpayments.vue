<template>
  <div class="payment-methods">
    <!-- Mobile Net Banking Banks Sheet -->
    <div class="mobile-net-banking" v-if="activePaymentMethod == 'Net banking' && showBanks">
      <div class="backdrop" @click="showBanks = false"></div>
      <div class="bottom-sheet-banks">
        <div class="handle-parent">
          <div class="handle"></div>
        </div>
        <div style="padding-top: 32px">
          <div class="bank" @click="selectActiveBank({ name: bankName, value: bankValue })"
            v-for="(bankName, bankValue) of netbankingBanks" :key="bankName">
            {{ bankName }}
          </div>
        </div>
      </div>
    </div>
    <!-- Ends -->

    <!-- Desktop Netbanking List -->
    <div class="desktop-net-banking" v-show="activePaymentMethod == 'Net banking' && showBanks">
      <div class="backdrop" @click="showBanks = false"></div>
      <div class="banks-container">
        <div class="bank" @click="selectActiveBank({ name: bankName, value: bankValue })"
          v-for="(bankName, bankValue) of netbankingBanks" :key="bankName">
          {{ bankName }}
        </div>
      </div>
    </div>
    <!-- ends -->

    <a id="upi-intent" :href="UPIAppLink"></a>
    <div class="payment-txt">Payment Method</div>
    <section class="payment-method" v-for="method in paymentMethods" :key="method.methodName">
      <div class="payment-collapsed" @click="expandPaymentMethod(method.methodName)">
        <div class="payment-head">
          <img :src="method.icon" alt="" />
          <span class="method">
            {{ method.methodName }}
          </span>
        </div>
        <div class="payment-tail" :class="{
          'expanded-payment': activePaymentMethod == method.methodName,
        }">
          <img src="@/assets/icons/misc/arrow-down-new.svg" alt="" />
        </div>
      </div>
      <transition name="expand" enter-stagger="500">
        <div class="payment-expanded mt-10" v-show="activePaymentMethod == method.methodName">
          <!-- Method : CARD -->
          <div v-show="(activePaymentMethod == 'Credit/Debit Card' && !savedCards) ||
            addNewCard
            " class="method-expanded">
            <div class="cards">
              <form class="juspay_inline_form" v-show="activePaymentMethod == 'Credit/Debit Card'" id="payment_form_card">
                <input type="hidden" class="merchant_id" :value="juspayMerchantId" />
                <input type="hidden" class="order_id" :value="orderId" />
                <div class="input-container">
                  <div class="card-number-txt">CARD NUMBER</div>
                  <div class="card-number juspay-class">
                    <!-- Juspay card number field -->
                    <div class="card_number_div"></div>
                    <!-- Card Brand -->
                    <div class="card_brand_image">
                      <img v-show="cardBrand == 'VISA'" src="@/assets/icons/cards/visa.svg" alt="" />
                      <img v-show="cardBrand == 'MASTERCARD'" src="@/assets/icons/cards/mastercard.svg" alt="" />
                      <img v-show="cardBrand == 'MAESTRO'" src="@/assets/icons/cards/maestro.svg" alt="" />
                      <img v-show="cardBrand == 'RUPAY'" src="@/assets/icons/cards/rupay.svg" alt="" />
                      <img v-show="cardBrand == 'DINERS'" src="@/assets/icons/cards/diners.svg" alt="" />
                      <img v-show="cardBrand == 'AMEX'" src="@/assets/icons/cards/amex.svg" alt="" />
                    </div>
                  </div>
                  <div v-if="!isCardSupported()" class="card-not-allowed">
                    We dont support this card
                  </div>
                </div>

                <div class="flex-space-between mt-28">
                  <div class="input-container" style="width: 100px; border-bottom: 1px solid #e0e0e0">
                    <div class="card-validity-txt">VALID THRU</div>
                    <div style="display: flex; align-items: center; gap: 10px">
                      <div class="card_exp_month_div"></div>
                      <div style="color: #13141b">/</div>
                      <div class="card_exp_year_div"></div>
                    </div>
                  </div>
                  <div class="input-container" style="width: 100px; border-bottom: 1px solid #e0e0e0">
                    <div class="card-cvv-txt">CVV</div>
                    <div class="flex-together gap-18">
                      <div class="security_code_div"></div>
                      <img src="@/assets/icons/payment-icons/cvv.svg" alt="" />
                    </div>
                  </div>
                </div>

                <div class="input-container mt-28">
                  <div class="card-name-txt">NAME ON CARD</div>
                  <div class="name_on_card_div juspay-class"></div>
                </div>
                <input type="hidden" class="redirect" value="false" />
                <button v-show="false" type="submit" class="make_payment" ref="juspayButton"></button>
              </form>
            </div>
            <SubmitButton class="pay-desktop" defaultText="Pay Now" :disabled="verifyPaymentDetails()" @submit="checkout"
              :loading="checkingOut" />
          </div>
          <div v-show="activePaymentMethod == 'Credit/Debit Card' &&
            savedCards &&
            !addNewCard
            ">
            <div class="saved-add-cards mt-15">
              <div class="saved-card mb-10" :class="{
                'selected-saved-card':
                  selectedSavedCard.trim() == card.cardNumber.trim(),
              }" v-for="card in savedCards" :key="card.cardNumber">
                <div class="head">
                  <div class="brand">
                    <img v-show="card.brand == 'VISA'" src="@/assets/icons/cards/visa.svg" alt="" />
                    <img v-show="card.brand == 'DINERS'" src="@/assets/icons/cards/diners.svg" alt="" />
                  </div>
                  <div class="bank-number">
                    <div class="bank">{{ card.bank }}</div>
                    <div class="number">{{ card.cardNumber }}</div>
                  </div>
                </div>
                <div class="tail">
                  <div class="cvv">cvv</div>
                </div>
              </div>

              <div class="new-card" @click="addCard">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 12H16" stroke="#FB6C23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 16V8" stroke="#FB6C23" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#FB6C23" />
                </svg>

                Add new Card Details
              </div>
            </div>
          </div>
          <!-- CARD ends -->

          <!-- Method : UPI -->
          <div v-if="activePaymentMethod == 'UPI'" class="method-expanded">
            <div class="upi-parent">
              <UPIBanks :class="{ 'mobile-upi': app.appName !== 'Enter UPI ID' }" v-for="app in method.upiApps"
                :key="app.appName" :brandIcon="app && app.appIcon" :brandName="app && app.appName"
                @selectActiveApp="selectActiveApp" :activeApp="selectedApp" />
            </div>

            <!-- UPI Collect Juspay -->
            <div class="custom-upi-id" v-if="selectedApp == 'Enter UPI ID'">
              <div class="upi-collect-text">ENTER UPI ID</div>
              <div class="upi-input">
                <input type="text" @input="upiId = $event.target.value" v-model="upiId" />
              </div>

              <!-- Juspay Form -->

              <form class="juspay_inline_form" id="payment_form">
                <input type="hidden" class="merchant_id" ref="merchant_id" :value="juspayMerchantId" />
                <input type="hidden" class="order_id" :value="orderId" ref="order_id" />
                <input type="hidden" class="upi_vpa" :value="upiId" ref="upi_id" />
                <input type="hidden" class="payment_method_type" value="UPI" />
                <input type="hidden" class="payment_method" value="UPI" />
                <input type="hidden" class="txn_type" value="UPI_COLLECT" />
                <button type="submit" v-show="false" class="make_payment" ref="juspayButtonUPI"></button>
                <input type="hidden" class="redirect" value="false" />
              </form>

              <!-- Form ends -->
            </div>
            <!-- UPI ends -->
            <SubmitButton class="pay-desktop" defaultText="Pay Now" :disabled="verifyPaymentDetails()" @submit="checkout"
              :loading="checkingOut" />
          </div>

          <!-- Method : NET-BANKING -->
          <div v-if="activePaymentMethod == 'Net banking'">
            <div class="net-banking-parent method-expanded">
              <UPIBanks v-for="bank in topBanks" :key="bank.name" :brandIcon="bank.icon" :brandName="bank.name"
                :bankObj="bank" :isBank="true" @selectActiveApp="selectActiveBank" :activeApp="selectedBank.name" />
              <div class="show-more" @click="showMoreBanks">
                <span v-if="showMore"> Show more</span>

                <span v-if="showBankName"> {{ selectedBank.name }}</span>
                <img src="@/assets/icons/misc/arrow-down-new.svg" alt="" />
              </div>

              <!-- Juspay Netbanking Form -->
              <form class="juspay_inline_form" id="payment_form" v-show="activePaymentMethod == 'Net banking'">
                <input type="hidden" class="merchant_id" :value="juspayMerchantId" />
                <input type="hidden" class="order_id" :value="orderId" />
                <input type="hidden" class="payment_method_type" value="NB" />
                <select v-show="false" class="payment_method">
                  <option :value="selectedBank.value" :label="selectedBank.name"></option>
                </select>
                <button v-show="false" type="submit" class="make_payment" ref="juspayButtonNB"></button>
                <input type="hidden" class="redirect" ref="redirect" value="false" />
              </form>
              <!-- Juspay form ends -->
            </div>
            <SubmitButton class="pay-desktop" defaultText="Pay Now" :disabled="verifyPaymentDetails()" @submit="checkout"
              :loading="checkingOut" />
          </div>
          <!-- NET-BANKING ends -->

          <!-- Method : COD -->
          <div v-if="activePaymentMethod == 'Cash on Delivery'">
            <div class="cod method-expanded mb-15 mt-15" :style="{
              border: !CODNotEligible
                ? '1px solid black'
                : '1px solid rgb(224, 224, 224)',
              color: CODNotEligible ? '#BEBEBE' : '#000',
            }" @click="selectCOD">
              <div class="title">
                Pay in Cash or UPI to your delivery partner
              </div>
              <div v-if="store.cartInfo?.shipping_charges_value > 0" class="sub-title">
                {{ convertToINR(store.cartInfo?.shipping_charges_value) }}
                will be added to your delivery on selecting COD option
              </div>
            </div>
            <div v-if="CODNotEligible" class="mb-15" :key="store.cartInfo.grand_total.value">
              <div style="user-select: none" :class="allPayments.codText" v-html="codHTMLText"></div>
            </div>
            <SubmitButton class="pay-desktop" defaultText="Pay Now" :disabled="verifyPaymentDetails()" @submit="checkout"
              :loading="checkingOut" />
          </div>
          <!-- </transition> -->
        </div>
      </transition>
    </section>

    <div class="pay-now pay-mobile">
      <SubmitButton defaultText="Pay Now" :disabled="verifyPaymentDetails()" @submit="checkout" :loading="checkingOut" />
    </div>

    <!-- Payment Loader -->
    <div class="loader-page" v-if="paymentLoader">
      <div class="container1">
        <img src="@/assets/loaders/page-loader.svg" alt="" />
        <div>
          {{ paymentLoaderText }}
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>

import SubmitButton from "@/components/SubmitButton.vue";

// import {
//   trackingAddPaymentInfo,
//   trackingJuspayRedirection,
// } from "../eventTracking";

import { brandCODRanges } from "../../data/constants";
import { fetchCartInfo, calculateShippingCharges } from "@/utils/globalAPIs";
import { getObjectLength, convertToINR } from "@/utils/helperMethods";
import UPIBanks from "./UPIBanks.vue";

// Global Objects
const runtimeConfig = useRuntimeConfig()
const router = useRouter();
const route = useRoute();
const store = useStore();
const creatorStore = useCreatorStore()

// props and emits
const props = defineProps(["user"]);
const emits = defineEmits(["transactionLoader", "getCartInfo", "triggerLogin"]);

// Juspay details
const juspayMerchantId = ref("hypd");
const isValidCardNumber = ref(false);
const isValidExpiryMonth = ref(false);
const isValidExpiryYear = ref(false);
const isValidSecurityCode = ref(false);
const isValidCardHolderName = ref(false);
const validCardDetails = ref(false);
const cardBrand = ref("");
const upiId = ref("");

// Juspay Button Refs
const juspayButton = ref(null);
const juspayButtonNB = ref(null);
const juspayButtonUPI = ref(null);

const juspayCardSetup = ref(false);

// goKwik Data
const goKwikData = ref(null);

const orderId = ref(null);
const skipPayment = ref(false);
const processingCOD = ref(false);

// const discount = ref(store.cartInfo.coupon_value.value);

const paymentLoader = ref(false);

const pay = ref("pay");

const paymentLoaderText = ref(
  "Kindly do not close this tab as we are processing your transaction."
);
const selectedMethod = ref("");
const paymentMethods = ref([
  {
    methodName: "Credit/Debit Card",
    icon: "/icons/payment-icons/CARDS.svg",
  },
  {
    methodName: "UPI",
    upiApps: [
      {
        appName: "Google Pay",
        appIcon: "/icons/payment-icons/gpay.png",
      },
      {
        appName: "PhonePe",
        appIcon: "/icons/payment-icons/phonepe.png",
      },
      {
        appName: "Paytm",
        appIcon: "/icons/payment-icons/paytm.png",
      },
      {
        appName: "Enter UPI ID",
        appIcon: "/icons/payment-icons/UPI2.svg",
      },
    ],
    icon: "/icons/payment-icons/UPI.svg",
  },
  {
    methodName: "Net banking",
    icon: "/icons/payment-icons/NETBANKING.svg",
  },
  {
    methodName: "Cash on Delivery",
    icon: "/icons/payment-icons/COD.svg",
  },
]);
const activePaymentMethod = ref("UPI");
const selectedApp = ref("");
const selectedBank = ref({ name: "AXIS", value: "NB_AXIS" });
const netbankingBanks = ref({});
const topBanks = ref([
  {
    name: "AXIS",
    value: "NB_AXIS",
    icon: "/icons/payment-icons/axis.png",
  },
  {
    name: "ICICI",
    value: "NB_ICICI",
    icon: "/icons/payment-icons/icici.png",
  },
  {
    name: "SBI",
    value: "NB_SBI",
    icon: "/icons/payment-icons/sbu.png",
  },
]);
const showBanks = ref(false);
const savedCards = ref(null);
const addNewCard = ref(false);
const selectedSavedCard = ref("3610 102023 2131");
const isPaying = ref(false);
const gokwikRequestId = ref("");
const gokwikFlag = ref(null);
const paymentStatusInterval = ref(null);
const UPIAppLink = ref(null);
const isSafari = ref(null);

const isUpiValid = ref(false);
const isNetBankingValid = ref(false);
const CODNotEligible = ref(false);

const codHTMLText = ref("");

const brandCODFlagObj = ref({});

const brandTotalCODFlag = ref(null);

const brandTotalCODNotEligibleObj = ref({});

const brandItemsTotalObject = ref({});

const cartCODRange = ref({
  min: 99,
  max: 4999,
});

const cartCODFlag = ref(null);
const lowerOrHigher = ref(null);

const codShippingCharges = ref(0);
const prepaidShippingCharges = ref(0);

const checkingOut = ref(false);

// Computed
const showMore = computed(() => {
  return (
    !selectedBank.value ||
    selectedBank.value.name == "AXIS" ||
    selectedBank.value.name == "SBI" ||
    selectedBank.value.name == "ICICI"
  );
});

const showBankName = computed(() => {
  return (
    selectedBank.value &&
    selectedBank.value.name !== "AXIS" &&
    selectedBank.value.name !== "SBI" &&
    selectedBank.value.name !== "ICICI"
  );
});

const couponCatalogItemsInCart = ref(0);

const shippingAddress = computed(() => store.cartInfo.shipping_address);
const brandCODEligibility = computed(() => store.cartInfo.brandCODEligibility);

const brandWiseCart = computed(() => store.brandWiseCartItems);
// watcher

watch(shippingAddress, (newAdd, oldAdd) => {
  if (
    newAdd?.id !== oldAdd?.id ||
    newAdd?.contact_number?.number !== oldAdd?.contact_number?.number ||
    newAdd?.postal_code !== oldAdd?.postal_code
  ) {
    checkCODEligible();
  }
});

watch(brandWiseCart, (newVal, oldVal) => {
  checkBrandCODRange();
  checkCODEligibleText();
});

watch(brandCODEligibility, (newValue, oldValue) => {
  if (newValue?.flag !== oldValue?.flag) {
    // brandCODFlagObj.value.flag = newValue?.flag;
    brandCODFlagObj.value = {
      ...newValue,
    };
    checkCODEligibleText();
    checkCartCODRange();
  }
});

// Methods

// Checks
function verifyCardDetails() {
  if (
    isValidCardNumber.value &&
    isValidCardHolderName.value &&
    isValidExpiryMonth.value &&
    isValidExpiryYear.value &&
    isValidSecurityCode.value &&
    isCardSupported()
  ) {
    validCardDetails.value = true;
  } else {
    validCardDetails.value = false;
  }
  return !validCardDetails.value;
}

function checkUPI() {
  if (selectedApp.value !== "" && selectedApp.value !== "Enter UPI ID") {
    isUpiValid.value = true;
  } else if (selectedApp.value == "Enter UPI ID") {
    if (/^[\w.-]+@[\w.-]+$/.test(upiId.value)) {
      isUpiValid.value = true;
    } else {
      isUpiValid.value = false;
    }
  } else {
    isUpiValid.value = false;
  }
  return !isUpiValid.value;
}

function checkNetBanking() {
  if (selectedBank.value !== "") {
    isNetBankingValid.value = true;
  } else {
    isNetBankingValid.value = false;
  }
  return !isNetBankingValid.value;
}

function isCardSupported() {
  return cardBrand.value == "DINERS" ? false : true;
}
function checkCOD() {
  return (
    CODNotEligible.value && activePaymentMethod.value == "Cash on Delivery"
  );
}

const checkOutOfStockItems = computed(() => {
  if (getObjectLength(store.cartItems) == 0) {
    return true;
  }
  var flag = false;
  let items = Object.values(store.cartItems);
  items.forEach((item) => {
    if (
      item?.variants[item?.variant_id]?.inventory_info?.status?.value ==
      "out_of_stock" ||
      item?.quantity >
      item?.variants[item?.variant_id]?.inventory_info?.unit_in_stock
    ) {
      flag = true;
    }
  });
  return flag;
});

function verifyPaymentDetails() {
  if (!store.cartInfo?.shipping_address?.id) {
    return true;
  } else if (checkOutOfStockItems.value) {
    return true;
  } else if (activePaymentMethod.value == "Credit/Debit Card") {
    return verifyCardDetails();
  } else if (activePaymentMethod.value == "UPI") {
    return checkUPI();
  } else if (activePaymentMethod.value == "Net banking") {
    return checkNetBanking();
  } else if (activePaymentMethod.value == "Cash on Delivery") {
    return checkCOD();
  } else {
    return true;
  }
}

function calculateCODShippingCharges(mode) {
  if (mode === "cod") {
    for (let obj in store.cartInfo.shipping_charges) {
      codShippingCharges.value +=
        store.cartInfo.shipping_charges[obj].total_cod_shipping_charges ||
        0;
    }
  } else if ("prepaid") {
    for (let obj in store.cartInfo.shipping_charges) {
      prepaidShippingCharges.value +=
        store.cartInfo.shipping_charges[obj]
          .total_prepaid_shipping_charges || 0;
    }
  }
}
const addCartToLocalStorage = () => {
  localStorage.removeItem("cartInfo");

  let cartForLocalStorge = {};
  cartForLocalStorge["items"] = store.cartInfo.items;
  cartForLocalStorge["coupon"] = store.cartInfo?.coupon;
  cartForLocalStorge["shipping_charges"] =
    store.cartInfo.shipping_charges_value || 0;

  localStorage.setItem("cartInfo", JSON.stringify(cartForLocalStorge));
};

async function checkout() {
  if (/.*\d.*/.test(store.cartInfo?.shipping_address?.display_name)) {
    alert("Please don't use a number in your address's name.");
    return;
  }
  if (checkingOut.value) {
    return;
  }
  if (
    !store.user?.id ||
    store.user?.full_name == "" ||
    store.user?.email == ""
  ) {
    emits("triggerLogin");
    return;
  }

  if (checkOutOfStockItems.value) {
    var oosItems = document.querySelector(".out-of-stock-items");
    oosItems.scrollIntoView({
      behavior: "smooth",
    });
    return;
  }
  if (verifyPaymentDetails()) {
    return;
  }
  isPaying.value = true;

  //   Initiating Order
  let formData = {
    platform: "web",
  };
  // Payment method COD
  if (activePaymentMethod.value == "Cash on Delivery") {
    processingCOD.value = true;
    formData["is_cod"] = true;
    formData["request_id"] = gokwikRequestId?.value;
  }

  if (route.query.isExpress || store.cartInfo?.is_express_checkout) {
    let items = Object.values(store.cartItems).reduce(
      (array, itemInfo) => {
        return [
          ...array,
          {
            catalog_id: itemInfo?.catalog_id,
            variant_id: itemInfo?.variant_id,
            quantity: itemInfo?.quantity,
            source: { ...itemInfo?.source },
          },
        ];
      },
      []
    );
    var address = { ...store.cartInfo?.shipping_address };
    delete address.is_billing_address;
    delete address.is_shipping_address;
    delete address.is_default_address;
    delete address.country;

    address["phone_no"] = {
      ...store.cartInfo?.shipping_address?.contact_number,
    };
    delete address.contact_number;

    formData = {
      ...formData,
      items: [...items],
      address: { ...address },
      is_express_checkout: true,
    };

    if (store.cartInfo.coupon) {
      formData["coupon"] = store.cartInfo.coupon.code;
    }
  } else {
    formData = {
      ...formData,
      source: "cart",
    };
  }
  let response;
  checkingOut.value = true;
  try {
    response = await $fetch(runtimeConfig.public.checkoutURL + "/api/checkout", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
      // params: params,
    });
    if (response.payload) {
      orderId.value = response.payload.order_id;

      // Free Transaction
      skipPayment.value = response.payload.skip_payment;
      paymentLoader.value = true;
      checkingOut.value = false;
      emits("transactionLoader", true);
      addCartToLocalStorage();

      // uncmnt later
      // trackingAddPaymentInfo(
      //   store.cartInfo.paymentMethod,
      //   store.cartInfo
      // );
    }
  } catch (err) {
    console.log("Error while checking out", err);
    alert(err.response.data.error[0].message);
    checkingOut.value = false;
    emits("transactionLoader", false);
  }

  if (activePaymentMethod.value == "Cash on Delivery") {
    sendDetailsToGoKwik(response.payload.go_kwik, "cod");
    store.saveCartItemsFailSuccess([...store.cartInfo.items])
  } else if (orderId.value && activePaymentMethod.value != "Cash on Delivery") {
    if (skipPayment.value) {
      paymentLoader.value = false;
      isPaying.value = false;
      emits("transactionLoader", false);
      router.push(
        "/payment-success?orderID=" +
        orderId.value +
        "&order_amount=" +
        `${store.cartInfo?.grand_total?.value}`
      );
    } else {
      // Juspay
      await checkoutWithJuspay();
    }
  }
}

async function checkoutWithJuspay() {
  // Gpay Paytm PhonePe
  if (
    activePaymentMethod.value == "UPI" &&
    selectedApp.value != "" &&
    selectedApp.value != "Enter UPI ID"
  ) {
    isPaying.value = true;
    emits("transactionLoader", true);
    await getUPIAppsLink();
  } else if (
    activePaymentMethod.value == "Net banking" ||
    activePaymentMethod.value == "UPI"
  ) {
    // Juspay Integration Starts
    isPaying.value = true;
    emits("transactionLoader", true);


    // uncmnt later
    // trackingJuspayRedirection(
    //   activePaymentMethod.value,
    //   orderId.value,
    //   store.cartInfo.grand_total.value
    // );

    Juspay.Setup({
      payment_form: "#payment_form",
      success_handler: function (status) {
        isPaying.value = false;
        paymentLoader.value = false;
        emits("transactionLoader", false);
        router.push(
          "/payment-success?orderID=" +
          orderId.value +
          "&order_amount=" +
          `${store.cartInfo.grand_total.value}`
        );
      },
      error_handler: function (
        error_code,
        error_message,
        bank_error_code,
        bank_error_message,
        gateway_id
      ) {
        isPaying.value = false;
        paymentLoader.value = false;
        emits("transactionLoader", false);
        store.saveCartItemsFailSuccess([...store.cartInfo.items])
        router.push("/payment-failed?orderID=" + orderId.value);
      },
    });

    setTimeout(() => {
      if (activePaymentMethod.value == "Net banking") {
        juspayButtonNB.value[0].click();
      } else if (activePaymentMethod.value == "UPI") {
        juspayButtonUPI.value[0].click();
      }
    }, 100);
    window.addEventListener("focus", orderConfirmation, true);
    // Keeps checking transaction status
    keepCheckingStatus();

    //Juspay Integration Ends
    // Creating goKwikData Object to send every payment details to GoKwik to train CoD model
    goKwikData.value = {
      ...goKwikData.value,
      request_id: gokwikRequestId.value,
      moid: orderId.value,
    };
    let a = {};
    a["data"] = goKwikData;
    sendDetailsToGoKwik([a], goKwikData.order_type);
  }
  // Juspay Card Payment
  else if (activePaymentMethod.value == "Credit/Debit Card") {
    isPaying.value = true;
    paymentLoader.value = true;

    // uncmnt later
    // trackingJuspayRedirection(
    //   activePaymentMethod.value,
    //   orderId.value,
    //   store.cartInfo.grand_total.value
    // );
    setTimeout(() => {
      juspayButton.value[0].click();
    }, 100);

    window.addEventListener("focus", orderConfirmation, true);
    // Keeps checking transaction status
    keepCheckingStatus();
  } else {
    alert("Please select a payment method before you proceed");
    return;
  }
}

async function getUPIAppsLink() {
  try {
    let response = await $fetch(runtimeConfig.public.orderURL + "/api/order/transaction/juspay/process", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        order_id: orderId.value,
      },
    });
    var oglink = response.payload;
    var paypart = oglink.substring(6);

    switch (selectedApp.value) {
      case "Google Pay":
        UPIAppLink.value = "tez://upi/" + paypart;
        break;
      case "Paytm":
        if (isSafari.value) {
          UPIAppLink.value = "paytm://upi/" + paypart;
        } else {
          UPIAppLink.value = oglink;
        }
        break;
      case "PhonePe":
        UPIAppLink.value = "phonepe://" + paypart;
        break;
      default:
        return;
    }
    setTimeout(() => {
      document.getElementById("upi-intent").click();
    }, 150);
    isPaying.value = false;
    paymentLoader.value = true;
    window.addEventListener("focus", orderConfirmation, true);
    keepCheckingStatus();
  } catch (err) {
    console.log(err);
    alert(err.response.data.error[0].message);
  }
}

function keepCheckingStatus() {
  paymentStatusInterval.value = setInterval(orderConfirmation, 10000);
}

async function orderConfirmation() {
  // api req to validate transaction
  try {
    let response = await $fetch(runtimeConfig.public.orderURL +
      "/api/order/transaction/status?order_id=" +
      orderId.value, {
      method: "GET",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.payload == "initiated") {
      paymentLoaderText.value =
        "Awaiting payment, please do not close this window.";
      return;
    } else if (response.payload == "failed") {
      paymentLoader.value = false;
      isPaying.value = false;
      emits("transactionLoader", false);

      // stops checking transaction status
      clearInterval(paymentStatusInterval.value);
      store.saveCartItemsFailSuccess([...store.cartInfo.items])
      router.push("/payment-failed?orderID=" + orderId.value);
      window.removeEventListener("focus", orderConfirmation, true);
    } else if (response.payload == "confirmed") {
      // stops checking transaction status
      clearInterval(paymentStatusInterval.value);
      paymentLoader.value = false;
      isPaying.value = false;
      emits("transactionLoader", false);
      window.removeEventListener("focus", orderConfirmation, true);
      router.push(
        "/payment-success?orderID=" +
        orderId.value +
        "&order_amount=" +
        `${store.cartInfo.grand_total.value}`
      );
      store.saveCartItemsFailSuccess([...store.cartItems])
      await fetchCartInfo();
    }

    // Creating goKwikData Object to send every payment details to GoKwik to train their CoD model
    goKwikData.value = {
      ...goKwikData.value,
      request_id: gokwikRequestId.value,
      moid: orderId.value,
    };

    let obj = {};
    obj["data"] = goKwikData;
    sendDetailsToGoKwik([obj], goKwikData.order_type);
  } catch (err) {
    console.log(err);
    alert(err.response.data.error[0].message);
  }
}

function sendDetailsToGoKwik(dataArray, orderType) {
  setTimeout(() => {
    var gokwik_Script = document.createElement("script");
    gokwik_Script.setAttribute(
      "src",
      "https://checkout.gokwik.co/integration.js"
    );
    document.head.appendChild(gokwik_Script);

    gokwik_Script.onload = () => {
      for (let i in dataArray) {
        let merchantInfo = {
          order_type: orderType,
          mid: dataArray[i].data.mid,
          moid: dataArray[i].data.moid,
          environment: runtimeConfig.public.gokwik_env,
          request_id: dataArray[i].data.request_id,
          gokwik_oid: dataArray[i].data.gokwik_oid,
          showModal: false,
        };
        gokwikSdk.initPayment(merchantInfo);
      }
      // gokwikSdk.close();
      processingCOD.value = false;
      if (orderType == "cod") {
        emits("transactionLoader", false);
        router.push(
          "/payment-success?orderID=" +
          orderId.value +
          "&order_amount=" +
          `${store.cartInfo.grand_total.value}`
        );
      }
    };
  }, 800);
}

async function checkCODEligible() {
  gokwikFlag.value = null;
  let response;
  try {
    if (route.query.isExpress || store.cartInfo?.is_express_checkout) {
      let formData = {
        user_id: store.user?.id,
        address: {
          id: store.cartInfo.shipping_address.id,
          display_name: store.cartInfo.shipping_address.display_name,
          phone_no: store.cartInfo.shipping_address.contact_number,
          line1: store.cartInfo.shipping_address.line1,
          district: store.cartInfo.shipping_address.district,
          city: store.cartInfo.shipping_address.city,
          state: store.cartInfo.shipping_address,
          postal_code: store.cartInfo.shipping_address.postal_code,
          plain_address: store.cartInfo.shipping_address.plain_address,
        },
        items: [
          {
            catalog_id: store.cartInfo.items[0].catalog_id,
            variant_id: store.cartInfo.items[0].variant_id,
            quantity: 1,
          },
        ],
      };

      if (creatorStore.info?.id) {
        formData.items[0]["source"] = {
          id: store?.creator?.info?.id,
          type: "express_checkout",
        };
      }

      if (store.cartInfo?.coupon) {
        formData["coupon"] = { ...store.cartInfo.coupon };
      }

      response = await $fetch(runtimeConfig.public.entityURL + "/api/app/express-checkout/check/cod", {
        method: "POST",
        credentials: 'include',
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      response = await $fetch(runtimeConfig.public.entityURL + "/api/app/check/cod", {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    gokwikRequestId.value = response.payload.data.request_id;
    if (response.payload.data.risk_flag == "High Risk") {
      gokwikFlag.value = true;
    } else {
      gokwikFlag.value = false;
    }
    if (response.payload.error) {
      gokwikFlag.value = true;
    }
  } catch (err) {
    gokwikFlag.value = true;
  }
  checkCODEligibleText();
}

function checkCODEligibleText() {
  // Added check for specific product
  var flag = false;
  Object.values(store.cartItems).forEach((item) => {
    if (item.catalog_id == "###") {
      CODNotEligible.value = true;
      codHTMLText.value = `<div>Cash on Delivery is not available for Advent Calendar Box by Mars Cosmetics</div>`;
      flag = true;
    }
  });

  if (flag) {
    return;
  }
  // GoKwik Flag
  else if (gokwikFlag.value) {
    CODNotEligible.value = true;
    codHTMLText.value = `<div>Cash on Delivery is not available due to high Return to Origin/Cancellation of Orders. Please, use the other payment methods.</div>`;
  }

  // // Brand Level COD Support
  else if (brandCODFlagObj.value.flag == false) {
    CODNotEligible.value = true;
    codHTMLText.value = `<div>Sorry! Cash on delivery is not supported by
              ${brandCODFlagObj.value.brandName}. Please use another payment method.</div>`;
  }

  // Brand Level COD Support Range check
  else if (brandTotalCODFlag.value == false) {
    CODNotEligible.value = true;
    codHTMLText.value = `<div>  You cart total for ${brandTotalCODNotEligibleObj.value.name
      } products is currently
              <span style="color: #fc404d"> ₹${brandTotalCODNotEligibleObj.value.total
      } </span>. Please
              add products worth
              <span style="color: #fc404d;"> ₹${brandCODRanges[brandTotalCODNotEligibleObj.value.brandId].range
        .min - brandTotalCODNotEligibleObj.value.total
      } </span>
              more to make COD eligible at checkout.`;
  }

  // Cart Range COD check
  else if (!cartCODFlag.value) {
    CODNotEligible.value = true;
    if (lowerOrHigher.value == "low") {
      codHTMLText.value = `<div> You are
                    <span style="color: red"
                      >₹${Math.abs(
        cartCODRange.value.min -
        store.cartInfo.grand_total.value
      )}</span
                    >
                    away from being eligible for COD!</div>`;
    }
    if (lowerOrHigher.value == "high") {
      codHTMLText.value = `<div> Maximun cart value eligible for COD is
                    <span style="color: red">₹${cartCODRange.value.max}!</span></div>`;
    }
  } else {
    CODNotEligible.value = false;
    codHTMLText.value = "";
  }
}

function getCartItemCountWithApplicableCoupon(coupon) {
  couponCatalogItemsInCart.value = 0;
  for (let itemInCart of store.cartInfo.items) {
    if (coupon.applicable_on.ids.includes(itemInCart.catalog_id)) {
      couponCatalogItemsInCart.value += itemInCart.quantity;
    }
  }
}

function getCartItemCount(coupon) {
  couponCatalogItemsInCart.value = 0;
  for (let itemInCart of store.cartInfo.items) {
    couponCatalogItemsInCart.value += itemInCart.quantity;
  }
}

function checkBrandCODRange() {
  brandItemsTotalObject.value = {};
  let coupon = store.cartInfo?.coupon;
  if (
    coupon &&
    coupon.applicable_on.name == "catalog" &&
    coupon.type == "flat_off"
  ) {
    getCartItemCountWithApplicableCoupon(coupon);
  }
  if (
    coupon &&
    coupon.applicable_on.name == "cart" &&
    coupon.type == "flat_off"
  ) {
    getCartItemCount(coupon);
  }

  // Looping on COD ranges
  for (let key in brandCODRanges) {
    // Looping on  cart items for brandIds
    for (let key2 in store.cartItems) {
      // checking brand ID of cart item and COD range
      if (store.cartItems[key2].brand_id == key) {
        // creating a local object with total, name, id & discount
        brandItemsTotalObject.value[key] = {
          brandTotal: brandItemsTotalObject.value[key]?.brandTotal
            ? brandItemsTotalObject.value[key].brandTotal +
            store.cartItems[key2].retail_price.value *
            store.cartItems[key2].quantity -
            getCouponDiscount(store.cartItems[key2])
            : store.cartItems[key2].retail_price.value *
            store.cartItems[key2].quantity -
            getCouponDiscount(store.cartItems[key2]),
          brandName: store.cartItems[key2].brand_info.name,
          brandId: store.cartItems[key2].brand_id,
          brandTotalDiscount: brandItemsTotalObject.value[key]
            ?.brandTotalDiscount
            ? brandItemsTotalObject.value[key]?.brandTotalDiscount +
            getCouponDiscount(store.cartItems[key2])
            : getCouponDiscount(store.cartItems[key2]),
        };
      }
    }
  }
  // Storing globally
  store.saveBrandTotalCartValue(brandItemsTotalObject.value);

  // Checking for brand COD thresh-hold
  for (let brandRange in brandCODRanges) {
    if (
      brandItemsTotalObject.value[brandRange] &&
      brandItemsTotalObject.value[brandRange].brandTotal >=
      brandCODRanges[brandRange]?.range?.min
    ) {
      brandTotalCODFlag.value = true;
    } else if (
      brandItemsTotalObject.value[brandRange] &&
      brandItemsTotalObject.value[brandRange].brandTotal <
      brandCODRanges[brandRange]?.range?.min
    ) {
      brandTotalCODFlag.value = false;
      brandTotalCODNotEligibleObj.value["name"] =
        brandItemsTotalObject.value[brandRange]?.brandName;
      brandTotalCODNotEligibleObj.value["total"] =
        brandItemsTotalObject.value[brandRange]?.brandTotal;
      brandTotalCODNotEligibleObj.value["brandId"] =
        brandItemsTotalObject.value[brandRange]?.brandId;
      return;
    }
  }
}

function getCouponDiscount(item) {
  // for flat off
  let couponValue = store.cartInfo?.coupon_value?.value;

  // using percent value for percent off
  let coupon = store.cartInfo?.coupon;
  let discount = 0;
  if (coupon && coupon.type == "percent_off") {
    if (
      (coupon.applicable_on.name == "brand" &&
        coupon.applicable_on.ids.includes(item.brand_id)) ||
      (coupon.applicable_on.name == "catalog" &&
        coupon.applicable_on.ids.includes(item.catalog_id)) ||
      coupon.applicable_on.name == "cart"
    ) {
      discount = Math.floor(
        (item.retail_price.value * item.quantity * coupon.value) / 100
      );
    }
  } else if (coupon && coupon.type == "flat_off") {
    if (
      coupon.applicable_on.name == "brand" &&
      coupon.applicable_on.ids.includes(item.brand_id)
    ) {
      let off =
        couponValue /
        store.brandWiseCartItems[item.brand_id].totalQuantity;
      discount = Math.floor(
        store.brandWiseCartItems[item.brand_id].totalQuantity * off
      );
    }
    if (
      coupon.applicable_on.name == "catalog" &&
      coupon.applicable_on.ids.includes(item.catalog_id)
    ) {
      let off = couponValue / couponCatalogItemsInCart.value;
      discount = Math.floor(item.quantity * off);
    }
    if (coupon.applicable_on.name == "cart") {
      let off = couponValue / couponCatalogItemsInCart.value;
      discount = Math.floor(item.quantity * off);
    }
  }
  return discount;
}

function checkCartCODRange() {
  if (
    store.cartInfo.grand_total.value >= cartCODRange.value.min &&
    store.cartInfo.grand_total.value <= cartCODRange.value.max
  ) {
    cartCODFlag.value = true;
  } else {
    // Cart total lesser than min value
    if (store.cartInfo.grand_total.value < cartCODRange.value.min) {
      lowerOrHigher.value = "low";
    }
    // Cart total higher than max value
    if (store.cartInfo.grand_total.value > cartCODRange.value.max) {
      lowerOrHigher.value = "high";
    }
    cartCODFlag.value = false;
  }
}

function showMoreBanks() {
  showBanks.value = true;
}
async function getBanksList() {
  let response = await $fetch("https://api.juspay.in/merchants/hypd/paymentmethods", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.payment_methods) {
    response.payment_methods.map((method) => {
      if (
        method.payment_method_type === "NB" &&
        method.payment_method !== "NB_DUMMY"
      ) {
        netbankingBanks.value[method.payment_method] = method.description;
      }
    });
  }
}
function selectActiveApp(app) {
  selectedApp.value = app;
}
function selectActiveBank(bank) {
  selectedBank.value = { name: bank.name, value: bank.value };
  showBanks.value = false;
}

function setupJuspayForCard() {
  Juspay.Setup({
    payment_form: "#payment_form_card",
    iframe_elements: {
      card_number: {
        /* Class name of the <div> which will hold the iframe element for card number. */
        container: ".card_number_div",
        attributes: {
          /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
          placeholder: "**** **** **** ****",
        },
      },
      name_on_card: {
        /* Class name of the <div> which will hold the iframe element for card holder name. */
        container: ".name_on_card_div",
        attributes: {
          /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
          placeholder: "Enter Name",
        },
      },
      card_exp_month: {
        /* Class name of the <div> which will hold the iframe element for card expiry month. */
        container: ".card_exp_month_div",
        attributes: {
          /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
          placeholder: "MM",
        },
      },
      card_exp_year: {
        /* Class name of the <div> which will hold the iframe element for card expiry year. */
        container: ".card_exp_year_div",
        attributes: {
          /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
          placeholder: "YY",
        },
      },
      security_code: {
        /* Class name of the <div> which will hold the iframe element for card security code. */
        container: ".security_code_div",
        attributes: {
          /* Field Attributes, which you want to set for the <input> field inside the iframe element. */
          placeholder: "***",
        },
      },
    },

    /* Set `auto_tab_enabled` flag to true if you want to enable auto-switching between fields when the user types the valid data (recommended but optional).
     * It will have the following order:`card_exp_month` -> `card_exp_year` ->`security_code`. */
    auto_tab_enabled: true,

    /* Set `auto_tab_from_card_number` to either `card_exp_month` or `name_on_card` based on which field is rendered after card_number (recommended but optional).
     * Note 1: Please set `auto_tab_enabled` to `true` as shown above to enable this functionality. */
    auto_tab_from_card_number: "card_exp_month",

    styles: {
      /* Add common styling for all input fields here */
      body: {
        height: "auto",
        "font-family": "inherit",
      },
      input: {
        border: "none",
        outline: "none",
        padding: "12px 0",
        "border-bottom": "1px solid #e0e0e0",
        color: "#000",
        "font-size": "18px",
        "text-align": "left",
        position: "relative",
        width: "100%",
      },
      /* Add the styling for card number input field here */
      ".card_number": {
        height: "auto",
      },
      /* Add the styling for card holder name input field here */
      ".name_on_card": {
        "line-height": "20px",
        "font-size": "18px",
        padding: "12px 0",
      },
      /* Add the styling for card expiry month input field here */
      ".card_exp_month": {
        "font-size": "18px",
        width: "60px",
        border: "none",
      },
      /* Add the styling for card expiry year input field here */
      ".card_exp_year": {
        "font-size": "18px",
        width: "60px",
        border: "none",
      },
      /* Add the styling for card security code input field here */
      ".security_code": {
        "font-size": "18px",
        width: "60px",
        border: "none",
      },
      /* Add the styling to be added to input fields in focus state */
      ":focus": {},
    },
    iframe_element_callback: function (event) {
      if (event.target_element == "card_number") {
        if (event.card_brand != "none") {
          cardBrand.value = event.card_brand;
        } else {
          cardBrand.value = "";
        }
      }
      if (event.empty !== undefined && !event.empty) {
        //For Card Number
        if (event.target_element == "card_number") {
          isValidCardNumber.value = false;
          // Check if card_number is valid
          if (event.valid) {
            isValidCardNumber.value = true;
            // document.querySelector(".card_exp_month_iframe").focus();
          }
        }
        //For Card Holder's Name
        if (event.target_element == "name_on_card") {
          isValidCardHolderName.value = false;
          // Check if name is valid
          if (event.valid) isValidCardHolderName.value = true;
        }
        //For Expiry Month
        if (event.target_element == "card_exp_month") {
          isValidExpiryMonth.value = false;
          // Check if expiry_month is valid
          if (event.valid) {
            isValidExpiryMonth.value = true;
            // document.querySelector(".card_exp_year_iframe").focus();
          }
        }

        //For Expiry Year
        if (event.target_element == "card_exp_year") {
          isValidExpiryYear.value = false;
          // Check if expiry_year is valid
          if (event.valid && event.expiry_valid) {
            isValidExpiryYear.value = true;
            // document.querySelector(".security_code_iframe").focus();
          }
        }

        //For Security Code
        if (event.target_element == "security_code") {
          isValidSecurityCode.value = false;
          // Check if security code is valid
          if (event.valid) isValidSecurityCode.value = true;
        }
      } else if (event.empty) {
        if (event.target_element == "card_number") {
          cardBrand.value = "";
        }
      }
      if (
        isValidCardNumber.value &&
        isValidCardHolderName.value &&
        isValidExpiryMonth.value &&
        isValidExpiryYear.value &&
        isValidSecurityCode.value
      ) {
        validCardDetails.value = true;
      }
    },
  });

  juspayCardSetup.value = true;
}

function selectDefaultUPI() {
  if (window.screen.width > 520) {
    selectedApp.value = "Enter UPI ID";
  } else {
    selectedApp.value = "Google Pay";
  }
}

function expandPaymentMethod(method) {
  if (method == activePaymentMethod.value) {
    activePaymentMethod.value = "";
    selectedApp.value = "";
    selectedBank.value = "";
    store.updateCartInfo({
      paymentMethod: "",
    });
    calculateShippingCharges();
    return;
  } else {
    store.updateCartInfo({
      paymentMethod: method,
    });
    activePaymentMethod.value = method;
    selectDefaultUPI();
    selectedBank.value = { name: "AXIS", value: "AXIS" };
    calculateShippingCharges();
  }

  if (method == "Credit/Debit Card" && !juspayCardSetup.value) {
    setTimeout(() => {
      setupJuspayForCard();
    }, 500);
  }
}

function addCard() {
  addNewCard.value = true;
}
onUnmounted(() => {
  if (paymentStatusInterval.value) {
    window.removeEventListener("focus", orderConfirmation, true);
    clearInterval(paymentStatusInterval.value);
  }
});
onUpdated(() => {
  if (store.cartInfo?.paymentMethod !== activePaymentMethod.value) {
    store.updateCartInfo({
      paymentMethod: activePaymentMethod.value,
    });
  }
  checkCartCODRange();
});
onMounted(async () => {
  clearInterval(paymentStatusInterval.value);
  if (activePaymentMethod.value) {
    store.updateCartInfo({
      paymentMethod: activePaymentMethod.value,
    });
  }
  calculateShippingCharges();

  isSafari.value =
    !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  goKwikData.value = {
    order_type: "non-gk",
    mid: runtimeConfig.public.gokwick_mid,
    environment: runtimeConfig.public.gokwik_env,
    gokwik_oid: "",
  };
  await getBanksList();

  // Check Gokwik Flag
  if (store.user?.id && store.cartInfo.shipping_address) {
    await checkCODEligible();
  }
  if (!store.cartInfo.brandCODEligibility?.flag) {
    brandCODFlagObj.value = {
      ...store.cartInfo.brandCODEligibility,
    };
  } else {
    brandCODFlagObj.value.flag = true;
  }
  selectDefaultUPI();
  checkCartCODRange();
  checkCODEligibleText();
});
</script>
  
  
<style module='allPayments'>
.codText {
  font-family: "Urbanist-Medium";
  font-size: 12px;
  line-height: 17px;
  letter-spacing: -0.30000001192092896px;
  text-align: left;
  color: #e14a67;
}
</style>
  
<style scoped>
.mobile-upi {
  display: none;
}

.payment-expanded {
  height: auto;
  will-change: height;
}

.pay-mobile {
  display: none;
  box-sizing: border-box;
  background: var(--plain-white) !important;
  padding: 8px 16px !important;
  margin: 0 !important;
  width: 100% !important;
  height: 69px;
}

.pay-mobile button {
  width: 100%;
  background: var(--primary-orange);
  padding: 16px;
  border-radius: 14px;

  color: var(--plain-white, #fff);

  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

.pay-desktop {
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-methods {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--back-ground, #fff);
  padding: 16px 0;
}

.payment-txt {
  font-family: Urbanist-Bold;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.20000000298023224px;
  text-align: left;
  padding: 16px;
}

.desktop-net-banking {
  display: block;
}

/* desktop */
.backdrop {
  z-index: 53;
}

.banks-container {
  height: 400px;
  bottom: 12px;
  overflow: scroll;
  position: absolute;
  z-index: 99;
  color: #13141b;
  width: 375px;
  right: 50px;
  box-shadow: 0px 4px 14px 0px #0000000f;
  border-radius: 12px;
  font-size: 14px;
  padding: 8px 0;
  background: #fff;
  cursor: pointer;
  overflow: scroll;
}

.banks-container>.bank:hover {
  background: #342546;
  color: #fff;
}

/*  */
.card-not-allowed {
  color: red;
  font-size: 12px;
  margin: 6px 0px;
}

.mobile-net-banking {
  display: none;
}

.bottom-sheet-banks {
  position: fixed;
  bottom: 0;
  background: #fff;
  height: 60vh;
  width: calc(100vw);
  color: #000000;
  border-radius: 32px 32px 0 0;
  z-index: 2147483002;
  overflow: scroll;
  animation: transform-bottom-sheet 0.4s linear;
}

.handle {
  border: 2px solid;
  width: 25px;
  border-radius: 50px;
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  background: #fff;
}

.handle-parent {
  height: 20px;
  position: fixed;
  width: calc(100vw);
  z-index: 1011000010001;
  background: #fff;
  padding: 20px 0 0;
  border-radius: 32px 32px 0 0;
}

.bank {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.button-disabled {
  background: #5d5d5d1a !important;
  color: #13141b1a !important;
  /* pointer-events: none; */
}

.active-method {
  border: 1px solid;
}

.loader-page {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  background: white;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.loader-page .container1 {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.new-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #fb6c23;
  color: #fb6c23;
  padding: 10px;
  border-radius: 12px;
  font-family: Urbanist-Medium;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.4000000059604645px;
  text-align: left;
  cursor: pointer;
}

.selected-saved-card {
  border: 1px solid #000 !important;
}

.saved-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #13141b1a;
  padding: 8px;
}

.head {
  display: flex;
  align-items: center;
  gap: 15px;
}

.head .brand img {
  height: 40px;
}

.bank-number {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bank-number .bank {
  font-family: Urbanist-Medium;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: 0.4000000059604645px;
  text-align: left;
}

.bank-number .number {
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4000000059604645px;
  text-align: left;
}

.cvv {
  background: #fff;
  border: 1px solid #dedede;
  padding: 8px 15px;
  font-family: Urbanist-Medium;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.4000000059604645px;
  text-align: left;
}

.cod {
  border-radius: 12px;
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
}

.cod .title {
  font-family: "Urbanist-Bold";
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.30000001192092896px;
  text-align: left;
  user-select: none;
  cursor: pointer;
}

.cod .sub-title {
  font-family: Urbanist-Regular;
  font-size: 12px;
  line-height: 17px;
  letter-spacing: -0.30000001192092896px;
  text-align: left;
  margin: 8px 0 0;
}

.show-more {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: #f8f8f8;
  border-radius: 16px;
  padding: 15px;
  height: 68px;
  box-sizing: border-box;
  color: #fb6c23;
  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: -0.30000001192092896px;
  text-align: left;
}

.upi-parent,
.net-banking-parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(162px, 1fr));
  gap: 12px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.upi-parent {
  padding-bottom: 16px;
}

.cards {
  display: flex;
  padding: 15px 0;
}

.card_brand_image {
  width: 40px;
}

.card_brand_image img {
  object-fit: contain;
  width: 100%;
}

.card_number_div html {
  font-family: "Urbanist-Bold";
}

.security_code_div {
  height: 45px;
  width: 100%;
}

.card_exp_year_div,
.card_exp_month_div {
  height: 45px;
  width: 40px;
}

/* juspay class name */
.juspay-class {
  border-bottom: 1px solid #e0e0e0;
  height: 45px;
}

/*  */
.card-number {
  display: flex;
  justify-content: space-between;
  gap: 18px;
}

.card-number-txt,
.card-name-txt,
.card-validity-txt,
.card-cvv-txt,
.upi-collect-text {
  font-family: "Urbanist-Bold";
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 1px;
  text-align: left;
  color: #a9a9a9;
}

.custom-upi-id {
  margin-top: 10px;
  width: 100%;
}

.upi-input input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #dedede;
  outline: none;
  padding: 10px 1px;
  margin-bottom: 15px;
}

.payment-method {
  padding: 16px;
  border-top: 1px solid #eee;
  background: #fff;
  overflow: hidden;
}

.payment-collapsed {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  cursor: pointer;
}

.payment-head {
  display: flex;
  align-items: center;
  gap: 18px;
  font-family: "Urbanist-Medium";
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.4000000059604645px;
  text-align: left;
}

.payment-head img {
  height: 24px;
  width: 24px;
}

/* Expand Animation */
.expand-enter-active {
  transition: all 0.5s linear;
}

.expand-leave-active {
  transition: all 0.1s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 265px;
}

/* aniamtion ends */
.payment-tail {
  transition: transform 0.25s linear;
}

.expanded-payment {
  transform: rotate(180deg);
}

.pay-now {
  width: 100%;
  padding: 10px;
  background: #fb6c23;
  padding: 16px;
  border-radius: 14px;
  color: #fff;
  border: none;

  font-family: Urbanist-Bold;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.2px;
}

@media screen and (max-width: 480px) and (min-width: 0) {
  .mobile-upi {
    display: flex;
  }

  .pay-desktop {
    display: none;
  }

  .pay-mobile {
    display: block;
  }

  .mobile-net-banking {
    display: block;
  }

  .desktop-net-banking {
    display: none;
  }

  .payment-txt {
    padding: 10px;
    font-family: "Urbanist-Bold";
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.20000000298023224px;
    text-align: left;
    color: #5c5c5c;
  }

  .payment-methods {
    border-radius: 12px;
    border: none;
    padding: 0;
  }

  .pay-now {
    width: calc(100% - 20px);
    position: fixed;
    bottom: 0;
    padding: 10px;
    background: #fb6c23;
    padding: 20px;
    margin: 10px;
    border-radius: 14px;
    color: #fff;
    border: none;
  }

  .upi-input input {
    margin-bottom: 0;
  }
}
</style>
  