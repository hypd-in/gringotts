import {
  saveVariants,
  saveBrandWiseCart,
  fetchCartInfo,
  removeCouponFromCart,
  getBrandInfoFromBrandId,
  calculatingShippingChargesForLocalItems,
} from "@/utils/globalAPIs";


import { getUTMParams } from "./helperMethods";

// import {
//   addingCouponElegiblityList,
//   getUTMParams,
//   synthesizingCoupon,
// } from "./globalMethods";

let couponURL;
let catalogURL;
let cmsURL;
let entityURL;
let orderURL;
let trackingURL;
let routeQueries;
if (process.browser) {
  routeQueries = new URLSearchParams(window.location.search);
}

if (process.env.NODE_ENV != "production") {
  couponURL = "https://coupon.getshitdone.in";
  catalogURL = "https://catalogv2.getshitdone.in";
  cmsURL = "https://cms.getshitdone.in";
  entityURL = "https://entity.getshitdone.in";
  orderURL = "https://orderv2.getshitdone.in";
  trackingURL = "https://tracking.getshitdone.in";
} else {
  couponURL = "https://coupon.hypd.store";
  catalogURL = "https://catalog2.hypd.store";
  cmsURL = "https://cms.hypd.store";
  entityURL = "https://entity.hypd.store";
  orderURL = "https://order2.hypd.store";
  trackingURL = "https://tracking.getshitdone.in";
}
async function fetchItemInfo(id) {
  try {
    var response = await $fetch(catalogURL + "/api/app/catalog/" + id, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.payload) {
      return response.data.payload;
    } else {
      return null;
    }
  } catch (err) {
    console.log("Error fetching catalog info, with product_id", id, err);
    return null;
  }
}

export async function updateVariant(key, variantInfo) {
  if (key && variantInfo?.id) {
    try {
      var formData = {
        id: store.state.user?.id,
        catalog_id: store.state.cartItems[key]?.catalog_info?.id,
        old_variant_id: store.state.cartItems[key]?.variant_id,
        new_variant_id: variantInfo?.id,
      };
      var response = await $fetch(entityURL + "/api/app/cart/item/variant", {
        method: "PUT",
        body: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.payload) {
        console.log(response.payload);
      }
    } catch (err) {
      console.log("Error updating variant", err);
    }
  } else {
    return null;
  }
}

export async function updateCartItemQuantity(key, updateQuantity) {
  if (key && updateQuantity) {
    try {
      var formData = {
        quantity: updateQuantity,
        catalog_id: store.state.cartItems[key]?.catalog_info?.id,
        variant_id: store.state.cartItems[key]?.variant_id,
        id: store.state.user?.id,
      };
      var response = await axios({
        method: "PUT",
        url: entityURL + "/api/app/cart/item",
        body: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.payload) {
        if (store.cartInfo.coupon?.id) {
          // Removing Coupon if Coupon min purchase limit is breached
          let appliedCoupon = addingCouponElegiblityList([
            { ...store.cartInfo.coupon },
          ]);
          let coupon_info = appliedCoupon[store.cartInfo.coupon.id];
          coupon_info = synthesizingCoupon(coupon_info);
          if (
            store.cartInfo.coupon?.min_purchase_value?.value >
            coupon_info.eleigible_items_total -
              store.state.cartItems[key].retail_price.value
          ) {
            await removeCouponFromCart(true);
          }
        }
        await fetchCartInfo();
      }
    } catch (err) {
      console.log("Error updating item quantity", err);
    }
  } else {
    return;
  }
}

export async function addLocalStorageItemsToCart() {
  var localCartItems = localStorage.getItem("cart_items");
  if (!localCartItems) {
    return;
  }
  var cartItems = JSON.parse(localCartItems);
  if (cartItems && cartItems.length > 0) {
    for (var item of cartItems) {
      if (!Object.keys(store.cartItems)?.includes(item.variant_id)) {
        item = {
          ...item,
          id: store.state.user?.id,
        };
        await addItemToCart(item);
      }
    }
    await fetchCartInfo();
    clearLocalCartItems();
  }
}

export async function addItemToCart(itemInfo) {
  //itemInfo must contain a field "id" which is user's id, along with the product info
  try {
    var params = getUTMParams();
    var response = await $fetch(
      useRuntimeConfig().public.entityURL + "/api/app/cart",
      {
        method: "POST",
        parms: params,
        body: itemInfo,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      if (!routeQueries.has("isExpress")) {
        await fetchCartInfo();
      }
    }
  } catch (err) {
    console.log("Error adding item to cart", err);
  }
}

export async function getCartItemsFromLocalStorage() {
  var cartItems = localStorage.getItem("cart_items");
  if (!cartItems) {
    return;
  }
  cartItems = JSON.parse(cartItems);
  var cartItemsObject = {};
  var itemInfo = {};
  var items = [];
  for await (const item of cartItems) {
    itemInfo = { ...(await fetchItemInfo(item?.catalog_id)) };
    itemInfo["brand_info"] = await getBrandInfoFromBrandId(
      itemInfo.brand_info.id
    );
    itemInfo["catalog_id"] = item.catalog_id;
    itemInfo["catalog_info"] = { ...itemInfo };
    itemInfo["source"] = item.source;
    itemInfo["quantity"] = item.quantity;
    itemInfo["variant_id"] = item.variant_id;
    items.push(itemInfo);
  }

  items = await saveVariants(items);
  cartItemsObject = items.reduce((obj, item) => {
    return {
      ...obj,
      [item.variant_id]: item,
    };
  }, {});
  imitateCartInfo(items);
  saveBrandWiseCart(items);
  calculatingShippingChargesForLocalItems();
  store.dispatch("saveCartItems", cartItemsObject);
}

export function imitateCartInfo(items, type) {
  var cartInfo = {
    items: [],
    coupon_value: null,
    total_price: {
      iso: "inr",
      value: 0,
    },
    total_discount: {
      iso: "inr",
      value: 0,
    },
    grand_total: {
      iso: "inr",
      value: 0,
    },
    is_cod_eligible: true,
  };

  if (store.cartInfo?.shipping_address?.id) {
    (cartInfo["shipping_address"] = {
      ...store.cartInfo?.shipping_address,
    }),
      (cartInfo["billing_address"] = {
        ...store.cartInfo?.billing_address,
      });
  }

  if (type == "express") {
    cartInfo["is_express_checkout"] = true;
    if (store.cartInfo?.coupon?.code) {
      cartInfo["coupon"] = { ...store.cartInfo.coupon };
      cartInfo["coupon_value"] = { ...store.cartInfo.coupon_value };
    }
  }

  cartInfo["items"] = [...items];

  if (items.length > 0) {
    items.forEach((item) => {
      cartInfo["total_price"]["value"] +=
        item.base_price.value * item?.quantity;

      cartInfo["total_discount"]["value"] +=
        ((item?.base_price?.value || 0) - (item?.retail_price?.value || 0)) *
        item.quantity;

      if (!item.brand_info?.is_cod_available) {
        cartInfo.is_cod_eligible = false;
      }
    });
  }

  cartInfo["grand_total"]["value"] =
    cartInfo.total_price.value -
    (cartInfo.coupon_value?.value || 0) -
    cartInfo.total_discount?.value;
  store.saveCartInfo(cartInfo);
}

export async function fetchBrandShippingCharges(brandIds) {
  if (brandIds && brandIds.length > 0) {
    var shipping_charges = brandIds.reduce((obj, brandId) => {
      return {
        ...obj,
        [brandId]: {
          shipping_charges: {},
        },
      };
    }, {});

    for (let brandId in shipping_charges) {
      try {
        var brandInfo = await axios({
          method: "GET",
          url: entityURL + "/api/app/brand/" + brandId,
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (brandInfo.data.payload) {
          shipping_charges[brandId] = {
            ...brandInfo.data.payload?.shipping_charges,
          };
        }
      } catch (err) {
        console.log("Error fetching brand Info", err);
      }
    }
    store.dispatch("updateCartInfo", { shipping_charges });
  }
}

export async function getExpressCheckoutProductInfo(
  productId,
  variantId,
  creatorId
) {
  if (productId && variantId) {
    try {
      var response = await axios({
        method: "GET",
        url: catalogURL + "/api/app/catalog/" + productId,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.payload) {
        var itemInfo = { ...response.data.payload };
        itemInfo["brand_info"] = await getBrandInfoFromBrandId(
          itemInfo.brand_info.id
        );
        itemInfo["quantity"] = 1;
        itemInfo["variant_id"] = variantId;
        itemInfo["catalog_info"] = { ...itemInfo };
        itemInfo["catalog_id"] = productId;
        itemInfo["id"] = variantId;
        if (creatorId)
          itemInfo["source"] = {
            type: "creator_store",
            id: creatorId,
          };

        itemInfo["variants"] = itemInfo.variants.reduce((obj, variant) => {
          return {
            ...obj,
            [variant.id]: variant,
          };
        }, {});

        var cartItemsObject = {};
        cartItemsObject[variantId] = itemInfo;

        store.dispatch("saveCartItems", cartItemsObject);

        var itemsArray = [];
        itemsArray.push(itemInfo);
        imitateCartInfo(itemsArray, "express");
        saveBrandWiseCart(itemsArray);
        calculatingShippingChargesForLocalItems();

        return itemInfo;
      }
    } catch (err) {
      console.log("Error fetching product info for express checkout", err);
    }
  } else {
    return null;
  }
}

export async function clearLocalCartItems() {
  const store = useStore();
  if (!store.user?.id) {
    return;
  }
  if (localStorage.getItem("cart_items")) {
    localStorage.removeItem("cart_items");
  }
}
