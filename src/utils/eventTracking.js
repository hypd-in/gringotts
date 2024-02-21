// import axios from "axios";
// import store from "../src/store/index";
// Tracking Tab change on Creator Store
var tracking_data_array = [];
var tracking_data = {};

function getCreatorInfo(id) {
  const creatorStore = useCreatorStore();
  if (useCookie("creators").value && useCookie("creators").value[id]) {
    return {
      username: useCookie("creators").value[id].username,
      name: useCookie("creators").value[id].name,
    };
  } else if (id && creatorStore.info?.id == id) {
    return {
      username: creatorStore.info.username,
      name: creatorStore.info.name,
    };
  } else {
    return {
      username: null,
      name: null,
    };
  }
}

// Tracking User Landing on HYPD Store
export function trackingUserLanding() {
  var formData = {};
  startTrackingTimer();
  const cookie = useCookie("firstSiteVisit");

  if (cookie.value) {
    formData["event"] = "first_site_visit";
    sendTrackingData(formData);
    var expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000);
    cookie.value = false;
    useCookie("firstSiteVisit", {
      expires: expiryDate,
      path: "/",
    });
  } else {
    formData["event"] = "site_visit";
    sendTrackingData(formData);
  }
}

// Tracking Landing Events
export function trackingLandingEvent(event_name) {
  const creatorStore = useCreatorStore();
  var formData = {};
  formData["event"] = event_name;
  formData["creator_username"] = creatorStore.info?.username;
  sendTrackingData(formData);
}

// Tracking User Login Event
// event_name can be user_login_success or user_login_failed
export function trackingUserLogin() {
  var formData = {};
  const store = useStore();
  formData["event"] = "user_logged_in";
  formData["phone_number"] = store.user?.phone_no?.number;
  sendTrackingData(formData);
}

// Tracking click on Track Your Order
export function trackingClickEvent(event_name) {
  var formData = {};
  formData["event"] = event_name;
  sendTrackingData(formData);
}

// Tracking Click on Order from Order Listing
export function trackingClickOnOrder(order, id) {
  var formData = {};
  formData["event"] = "clicked_on_order";
  formData["order_id"] = order?.order_id;
  formData["item_id"] = id;
  sendTrackingData(formData);
}

// Tracking ProductClick From Web Store
export function trackingProductClicks(
  event,
  creator,
  product_id,
  origin,
  source
) {
  var formData = {};
  formData["event"] = event;
  formData["creator_username"] = creator?.username;
  formData["product_id"] = product_id;
  formData["origin"] = origin;
  formData["source"] = source;
  sendTrackingData(formData);
}

//Tracking Search on Web Store
export function trackingSearch(search_query, creatorUsername) {
  var formData = {};
  formData["event"] = "user_actions";
  formData["event_action"] = "user_searched";
  formData["search_query"] = search_query;
  if (creatorUsername) {
    formData["creator_username"] = creatorUsername;
  }
  sendTrackingData(formData);
}

export function trackingPaymentSuccessPage(
  gaEvent,
  eventCategoryValue,
  eventActionValue,
  eventLabelValue,
  orderId,
  order_amount,
  user
) {
  var formData = {};
  formData["event"] = gaEvent;
  formData["event_category"] = eventCategoryValue;
  formData["event_action"] = eventActionValue;
  formData["user_id"] = user?.id;
  formData["order_id"] = orderId;
  formData["order_amount"] = order_amount;
  sendTrackingData(formData);
}

// Transaction Successfull
export function trackingPaymentSuccessPageWithData(
  gaEvent,
  eventCategoryValue,
  eventActionValue,
  eventLabelValue,
  creatorId,
  creatorUsername,
  productId,
  productName,
  orderId,
  order_amount,
  user
) {
  var formData = {};
  formData["event"] = eventCategoryValue;
  formData["event_action"] = eventActionValue;
  formData["creator_id"] = creatorId;
  formData["product_id"] = productId;
  formData["user_id"] = user?.id;
  formData["order_id"] = orderId;
  formData["order_amount"] = order_amount;
  sendTrackingData(formData);
}
export function trackingPaymentFailed(orderId, userInfo) {
  var formData = {};
  formData["event"] = "transaction";
  formData["event_action"] = "payment_failed";
  formData["order_id"] = orderId;
  formData["user_id"] = userInfo?.id;
  sendTrackingData(formData);
}
// Tracking Apply Coupon tab

export function trackingApplyCouponCode(couponCode) {
  var formData = {};
  formData["event"] = "apply_coupon_code";
  formData["coupon_code"] = couponCode;
  sendTrackingData(formData);
}

export function trackingBrandPageLanding(brandInfo) {
  var formData = {};
  formData["event"] = "brand_page_landing";
  formData["brand_id"] = brandInfo?.id;
  formData["brand_username"] = brandInfo?.username;
  sendTrackingData(formData);
}

var trackingURL = "";

if (process.env.ENVIRONMENT != "production") {
  trackingURL = "https://tracking.getshitdone.in";
} else {
  trackingURL = "https://tracking.hypd.store";
}
// Tracking Starts
// Create session_id
var session_id =
  Date.now().toString(36) +
  Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(
    36
  );

export function trackingStoreLanding(creator) {
  var formData = {};
  formData["event"] = "store_visit";
  formData["event_action"] = "creator_visited";
  formData["creator_id"] = creator?.id;
  formData["creator_name"] = creator?.name;
  formData["creator_username"] = creator?.username;
  sendTrackingData(formData);
}

// Tracking Creator's Featured Collection
export function trackingClickOnCreatorCollection(creatorInfo, collectionId) {
  var formData = {};
  formData["event"] = "collection_click";
  formData["creator_id"] = creatorInfo?.id;
  formData["creator_username"] = creatorInfo?.username;
  formData["creator_name"] = creatorInfo?.name;
  formData["collection_id"] = collectionId;
  sendTrackingData(formData);
}

export function trackingClickOnCreatorPebble(creatorInfo, pebbleId) {
  var formData = {};
  formData["event"] = "pebble_click";
  formData["creator_id"] = creatorInfo?.id;
  formData["creator_username"] = creatorInfo?.username;
  formData["creator_name"] = creatorInfo?.name;
  formData["pebble_id"] = pebbleId;
  sendTrackingData(formData);
}

//Tracking Juspay Redireciton
export function trackingJuspayRedirection(payment_method, order_id, value) {
  var formData = {};
  formData["event"] = "juspay_redirection";
  formData["selected_payment_method"] = payment_method;
  formData["order_id"] = order_id;
  formData["order_value"] = value;
  sendTrackingData(formData);
}

//Event Listner for page_visibility_change
// document.addEventListener("visibilitychange", async () => {
//   if (
//     document.visibilityState === "hidden" &&
//     tracking_data_array.length !== 0
//   ) {
//     //Sending Analytics Data
//     await sendingAnalytics();
//   }
// });

// Sending Analytics for tracking
async function sendingAnalytics() {
  const store = useStore();
  const creatorStore = useCreatorStore();
  trackingTimer = 0;
  if (useCookie("clientRequestId").value) {
    // Saving Tracking URL
    let url = trackingURL + "/api/track";

    // Tracking Data Object

    // adding client id, session id, user id & creator info for a particular session
    tracking_data["client_id"] = useCookie("clientRequestId").value;
    tracking_data["session_id"] = session_id;
    tracking_data["user_id"] = store.user?.id;
    tracking_data["creator_id"] = creatorStore?.info?.id;
    tracking_data["creator_username"] = creatorStore?.info?.username;

    // adding Array of events for tracking_data
    tracking_data["events"] = tracking_data_array;

    // Checking if beacon exists
    if (navigator && navigator.sendBeacon) {
      const headers = {
        "type": "application/json",
      };

      // Creating Blob for tracking data
      let event_data = new Blob([JSON.stringify(tracking_data)], headers);
      var data_sent = navigator.sendBeacon(url, event_data);
      if (data_sent) {
        tracking_data_array = [];
      }
    }

    // Sending data using api request, if beacon doesn't exist
    else {
      tracking_data_array = [];
      try {
        await $fetch(url, {
          method: "POST",
          body: tracking_data,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.log("Error sending tracking info");
      }
    }
  }
}

var trackingTimer = 0,
  trackingTimerInterval;
function startTrackingTimer() {
  trackingTimerInterval = setInterval(async () => {
    trackingTimer += 1;
    if (trackingTimer == 45) {
      if (tracking_data_array.length > 0) {
        await sendingAnalytics();
      } else {
        trackingTimer = 0;
      }
    }
  }, 1000);
}

// Internal API for tracking
async function sendTrackingData(formData) {
  if (formData) {
    formData["timestamp"] = new Date().toISOString();
    tracking_data_array.push(formData);
  }
  if (tracking_data_array.length == 20) {
    //Sending Analytics Data
    await sendingAnalytics();
  } else if (formData && formData["event"]) {
    if (
      formData["event"] == "transaction" ||
      formData["event"] == "juspay_redirection"
    ) {
      await sendingAnalytics();
    }
  }
}

// Create funnel Events
export function trackingViewItems(user) {
  const store = useStore();
  const product = useProductStore();
  const creator = useCreatorStore();
  dataLayer.push({
    event: "view_item",
    user_id: user?.id,
    user_name: user?.full_name,
    ecommerce: {
      currency: "INR",
      value: product.info?.retail_price?.value,
      items: [
        {
          item_id: product.info?.id,
          item_name: product.info?.name,
          affiliation: creator.info?.username,
          price: product.info?.retail_price.value,
          creator_username: creator.info?.username,
          creator_name: creator.info?.name,
          brand: product.info?.brand_info?.name,
        },
      ],
    },
  });
}

// Create funnel Events GA4
export function trackingUser() {
  const store = useStore();
  dataLayer.push({
    "user_id": store.user?.id,
  });
}

export function trackingBuyNow(product, creator, selected_variant_id) {
  var formData = {};
  formData["event"] = "buy_now";
  formData["product_id"] = product?.id;
  formData["creator_username"] = creator?.username;
  formData["variant_id"] = selected_variant_id;
  sendTrackingData(formData);
}

export function trackingAddToCart(product, creator, selected_variant_id) {
  dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: "INR",
      value: product?.retail_price?.value,
      items: [
        {
          item_id: product?.id || product?.item_id,
          brand: product?.brand_info?.name,
          creator_username: creator?.username,
          creator_name: creator?.name,
          item_name: product?.name || product?.item?.catalog_info?.name,
          affiliation: creator?.username,
          item_variant:
            product?.variants?.filter((variant) => {
              if (variant.id == selected_variant_id) {
                return variant.attribute;
              }
            })[0]?.attribute || product?.variant_type,
          price: product?.retail_price?.value,
          quantity: 1,
        },
      ],
    },
  });

  var formData = {};
  formData["event"] = "add_to_cart";
  formData["product_id"] = product?.id;
  formData["creator_username"] = creator?.username;
  formData["variant_id"] = selected_variant_id;
  sendTrackingData(formData);
}

export function trackingRemoveFromCart(product) {
  dataLayer.push({
    event: "remove_from_cart",
    ecommerce: {
      currency: "INR",
      value: product?.retail_price?.value,
      items: [
        {
          item_id: product?.catalog_info?.id,
          item_name: product?.catalog_info?.name,
          brand: product?.brand_info?.name,
          creator_username: getCreatorInfo(product?.source?.id)?.username,
          creator_name: getCreatorInfo(product?.source?.id)?.name,
          affiliation: getCreatorInfo(product?.source?.id)?.username,
          item_variant: product?.variants[product?.variant_id]?.attribute,
          price: product?.retail_price?.value,
          quantity: 1,
        },
      ],
    },
  });

  var formData = {};
  formData["event"] = "remove_from_cart";
  formData["product_id"] = product.catalog_info?.id;
  formData["creator_username"] = getCreatorInfo(product?.source?.id)?.username;
  formData["variant_id"] = product?.variant_id;
  sendTrackingData(formData);
}

// Tracking Adding Products to Wishlist
export function trackingWishlistingProducts(product) {
  const creatorStore = useCreatorStore();
  // GA4 Tracking
  dataLayer.push({
    event: "add_to_wishlist",
    ecommerce: {
      currency: "INR",
      value: product?.retail_price?.value,
      items: [
        {
          item_id: product?.id,
          brand: product?.brand_info?.name,
          creator_username: creatorStore?.info?.username,
          creator_name: creatorStore?.info?.name,
          item_name: product?.catalog_info?.name,
          affiliation: creatorStore?.info?.username,
          price: product?.retail_price?.value,
        },
      ],
    },
  });

  //In House Tracking
  var formData = {};
  formData["event"] = "add_to_wishlist";
  formData["product_id"] = product?.id;
  sendTrackingData(formData);
}

export function trackingBeginCheckout(cart_details) {
  let items = [];
  cart_details?.items?.forEach((item) => {
    items.push({
      item_id: item?.catalog_info?.id,
      brand: item?.brand_info?.name,
      item_name: item?.catalog_info?.name,
      creator_username: getCreatorInfo(item?.source?.id)?.username,
      creator_name: getCreatorInfo(item?.source?.id)?.name,
      affiliation: getCreatorInfo(item?.source?.id)?.username,
      item_variant: item.variants[item?.variant_id]?.attribute,
      price: item?.retail_price?.value,
      quantity: item?.quantity,
    });
  });
  dataLayer.push({
    event: "begin_checkout",
    // user_id: store.state.user?.id,
    // user_name: store.state.user?.full_name,
    ecommerce: {
      currency: "INR",
      value: cart_details?.grand_total?.value,
      coupon: cart_details?.coupon?.code,
      items: items,
    },
  });

  var formData = {};
  formData["event"] = "begin_checkout";
  formData["cart_value"] = cart_details?.grand_total?.value;
  formData["coupon_applied"] = cart_details?.coupon?.code;
  formData["items"] = items.map((item) => {
    return { "catalog_id": item?.id, "quantity": item?.quantity };
  });
  sendTrackingData(formData);
}
export function trackingAddShippingInfo(cart_details) {
  let items = [];
  cart_details?.items?.forEach((item) => {
    items.push({
      item_id: item?.catalog_info?.id,
      item_name: item?.catalog_info?.name,
      brand: item?.brand_info?.name,
      creator_username: getCreatorInfo(item?.source?.id)?.username,
      creator_name: getCreatorInfo(item?.source?.id)?.name,
      affiliation: getCreatorInfo(item?.source?.id)?.username,
      item_variant: item.variants[item?.variant_id]?.attribute,
      price: item?.retail_price?.value,
    });
  });
  dataLayer.push({
    event: "add_shipping_info",
    // user_id: store.state.user?.id,
    // user_name: store.state.user?.full_name,
    ecommerce: {
      currency: "INR",
      value: cart_details?.grand_total?.value,
      coupon: cart_details?.coupon?.code,
      items: items,
    },
  });
}

export function trackingAddPaymentInfo(payment_method, cart_details) {
  let items = [];
  cart_details?.items?.forEach((item) => {
    items.push({
      item_id: item?.catalog_info?.id,
      item_name: item?.catalog_info?.name,
      brand: item?.brand_info?.name,
      creator_username: getCreatorInfo(item?.source?.id)?.username,
      creator_name: getCreatorInfo(item?.source?.id)?.name,
      affiliation: getCreatorInfo(item?.source?.id)?.username,
      item_variant: item.variants[item?.variant_id]?.attribute,
      price: item?.retail_price?.value,
      quantity: item?.quantity,
    });
  });
  dataLayer.push({
    event: "add_payment_info",
    // user_id: store.state.user?.id,
    // user_name: store.state.user?.full_name,
    ecommerce: {
      currency: "INR",
      value: cart_details?.grand_total?.value,
      coupon: cart_details?.coupon?.code,
      items: items,
      payment_type: payment_method,
    },
  });

  var formData = {};
  formData["event"] = "add_payment_info";
  formData["payment_methods"] = payment_method;
  formData["coupon_applied"] = cart_details?.coupon?.code;
  formData["cart_value"] = cart_details?.grand_total?.value;
  sendTrackingData(formData);
}

export function trackingPurchase(order_id, cartInfo, value) {
  const store = useStore();
  let items = [];
  if (cartInfo?.items) {
    cartInfo.items.forEach((item) => {
      items.push({
        item_id: item?.id,
        item_name: item?.catalog_info?.name,
        brand: item?.brand_info?.name,
        creator_username: getCreatorInfo(item?.source?.id)?.username,
        creator_name: getCreatorInfo(item?.source?.id)?.name,
        affiliation: getCreatorInfo(item?.source?.id)?.username,
        item_variant: item.variants[item?.variant_id]?.attribute,
        price: item?.retail_price?.value,
        tax: 0,
        shipping: 0,
        quantity: item?.quantity,
      });
    });
  }
  dataLayer.push({
    event: "purchase",
    user_id: store.user?.id,
    user_name: store.user?.full_name,
    ecommerce: {
      transaction_id: order_id,
      currency: "INR",
      value: value,
      coupon: cartInfo?.coupon?.code,
      items: items,
    },
  });
  var formData = {};
  formData["event"] = "purchase";
  formData["order_id"] = order_id;
  formData["order_value"] = value;
  formData["coupon_applied"] = cartInfo?.coupon?.code;
  formData["items"] = items.map((item) => {
    return { "catalog_id": item.item_id, "quantity": item.quantity };
  });
  sendTrackingData(formData);
}

export function trackingRefund(orderData) {
  let items = [
    {
      item_id: orderData?.item?.catalog_info.id,
      item_name: orderData?.item?.catalog_info?.name,
      brand: orderData?.brand_info?.name,
      creator_username: orderData?.item?.source?.username,
      affiliation: orderData?.item?.source?.username,
      item_variant: orderData?.item?.catalog_info?.variant?.attribute,
      price: orderData.item?.retail_price?.value,
    },
  ];
  dataLayer.push({
    event: "refund",
    ecommerce: {
      transaction_id: orderData?.order_id,
      currency: "INR",
      value: orderData?.grand_total?.value,
      tax: 0,
      shipping: 0,
      items: items,
    },
  });

  var formData = {};
  formData["event"] = "refund";
  formData["order_id"] = orderData?.order_id;
  formData["order_value"] = orderData?.grand_total?.value;
  formData["items"] = items.map((item) => {
    return { "catalog_id": item?.item_id, "quantity": item?.quantity };
  });
  sendTrackingData(formData);
}

// export function trackingSaleCollectionClick(
//   saleName,
//   collectionTitle,
//   collectionIndex,
//   subCollectionId,
//   collectionType
// ) {
//   const creatorStore = useCreatorStore();
//   dataLayer.push({
//     "event": "sale_collection_click",
//     "sale_name": saleName,
//     "sub_collection_name": collectionTitle + " - " + (collectionIndex + 1),
//     "sub_collection_id": subCollectionId,
//     "collection_type": collectionType,
//     "creator_username": creatorStore.info?.username,
//   });
// }
