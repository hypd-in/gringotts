import { imitateCartInfo, deleteItemFormCart } from "./cartMethods";
import { getUTMParams, createCouponsMap } from "./helperMethods";
import track from "./tracking-posthog";

export async function fetchUserInfo() {
  const store = useStore();
  try {
    let response = await $fetch(
      `${useRuntimeConfig().public.entityURL}/api/me`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.payload) {
      store.saveUserInfo(response.payload);
      fetchWishlistedProducts();
      return response.payload;
    }
  } catch (err) {
    console.error("Error fetching user info: ", err.response._data.error[0]?.message);
    return null;
  }
}

export function synthesizingCoupon(coupon_item) {
  const store = useStore();
  let discount = 0;
  let coupon_msg = "";
  let disabled = false;
  let priorty_lvl = 0;
  let eleigible_items_total = 0;

  switch (coupon_item.applicable_on.name) {
    case "cart":
      store.cartInfo.items.forEach((cart_item) => {
        eleigible_items_total +=
          cart_item.retail_price.value * cart_item.quantity;
      });
      break;
    case "brand":
      Object.keys(store.brandWiseCartItems).forEach((cart_brand_id) => {
        if (coupon_item.eligible_ids.brand[cart_brand_id]) {
          eleigible_items_total +=
            store.brandWiseCartItems[cart_brand_id].totalRetailPrice;
        }
      });
      if (eleigible_items_total == 0) {
        disabled = true;
        priorty_lvl = 2;
        coupon_msg = `<div style="color: #fc404d;">This Offer is available on select ${Object.keys(coupon_item.eligible_ids.brand).length > 1
            ? "brands."
            : `brand. <span class="link-eligible-items">View.</span></div>`
          }`;
      }
      break;
    case "catalog":
      store.cartInfo.items.forEach((cart_item) => {
        if (coupon_item.eligible_ids.catalog[cart_item.catalog_id]) {
          eleigible_items_total +=
            cart_item.retail_price.value * cart_item.quantity;
        }
      });
      if (eleigible_items_total == 0) {
        disabled = true;
        priorty_lvl = 2;
        coupon_msg = `<div style="color: #fc404d;">This Offer is available on select ${Object.keys(coupon_item.eligible_ids.catalog).length > 0
            ? "items"
            : "item"
          }.`;
      }
      break;
  }

  switch (coupon_item.type) {
    case "flat_off":
      if (coupon_item?.min_purchase_value.value <= eleigible_items_total) {
        // Coupon applicable, min value crossed
        if (eleigible_items_total >= coupon_item.value) {
          discount =
            coupon_item.value > coupon_item?.max_discount?.value
              ? coupon_item?.max_discount?.value
              : coupon_item.value;
          coupon_msg = `<div style="color: #23d087;">You will save <span style="font-family: Urbanist-Bold;">₹${Math.floor(
            discount
          )}</span> using this coupon.</div>`;
          disabled = false;
        } else {
          // Can't apply Coupon min value not met
          priorty_lvl = 1;
          coupon_msg = `<div style="color: #fc404d;">Add <span style="font-family: Urbanist-Bold;">₹${Math.floor(
            coupon_item?.value - eleigible_items_total
          )}</span> worth of items to avail this offer.</div>`;
          disabled = true;
        }
      } else if (
        coupon_item?.min_purchase_value.value > eleigible_items_total &&
        eleigible_items_total != 0
      ) {
        // Can't apply Coupo,n min value not met
        priorty_lvl = 1;
        coupon_msg = `<div style="color: #fc404d;">Add <span style="font-family: Urbanist-Bold;">₹${Math.floor(
          coupon_item?.min_purchase_value.value - eleigible_items_total
        )}</span> worth of items to avail this offer.</div>`;
        disabled = true;
      }
      break;

    case "percent_off":
      if (coupon_item?.min_purchase_value.value <= eleigible_items_total) {
        // Coupon applicable, min value crossed
        discount =
          eleigible_items_total * (coupon_item.value / 100) >
          coupon_item.max_discount.value
            ? coupon_item.max_discount.value
            : eleigible_items_total * (coupon_item.value / 100);

        coupon_msg = `<div style="color: #23d087;">You will save <span style="font-family: Urbanist-Bold;">₹${Math.floor(
          discount
        )}</span> using this coupon.</div>`;
        disabled = false;
      } else if (
        coupon_item?.min_purchase_value.value > eleigible_items_total &&
        eleigible_items_total != 0
      ) {
        // Can't apply Coupon min value not met
        priorty_lvl = 1;
        coupon_msg = `<div style="color: #fc404d;">Add <span style="font-family: Urbanist-Bold;">₹${Math.floor(
          coupon_item?.min_purchase_value.value -
          eleigible_items_total * (coupon_item.value / 100)
        )}</span> worth of items to avail this offer.</div>`;
        disabled = true;
      }
      break;

    case "bxgy":
      // BxGy Coupons
      let bxgy_item_count = 0;
      if (
        // ByGy for brand
        coupon_item.applicable_on.bxgy.sub_type == "brand"
      ) {
        Object.values(store.cartItems).forEach((item) => {
          if (coupon_item?.eligible_ids?.brand[item.brand_id]) {
            if (item.gift_item && item.quantity == 1) {
              bxgy_item_count += 0;
            } else if (item.gift_item && item.quantity > 1) {
              bxgy_item_count += 1 * (item.quantity - item.gift_item.quantity);
            } else {
              bxgy_item_count += 1 * item.quantity;
            }
          }
        });
      } else if (coupon_item.applicable_on.bxgy.sub_type == "catalog") {
        // ByGy for catalog
        Object.keys(store.cartItems).forEach((v_id) => {
          if (
            coupon_item?.eligible_ids?.catalog[
            store.cartItems[v_id].catalog_info.id
            ]
          ) {
            bxgy_item_count += 1 * store.cartItems[v_id].quantity;
          }
        });
      }

      // Checking coupon if applicable and displaying message
      if (
        bxgy_item_count >=
        coupon_item.applicable_on.bxgy.get_count +
        coupon_item.applicable_on.bxgy.buy_count
      ) {
        // BxGy Coupon eligible and Applicable
        // free_item_count = purchase_limit > FloorOf(BxGy_item_count/(get_ids + buy_ids)) ? FloorOf(BxGy_item_count/(get_ids + buy_ids)) * get_count : purchase_limit * get_count
        disabled = false;
        let free_item_count =
          coupon_item.applicable_on.bxgy.purchase_limit >
            Math.floor(
              bxgy_item_count /
              (coupon_item.applicable_on.bxgy.get_count +
                coupon_item.applicable_on.bxgy.buy_count)
          )
            ? Math.floor(
              bxgy_item_count /
              (coupon_item.applicable_on.bxgy.get_count +
                coupon_item.applicable_on.bxgy.buy_count)
            ) * coupon_item.applicable_on.bxgy.get_count
            : coupon_item.applicable_on.bxgy.purchase_limit *
            coupon_item.applicable_on.bxgy.get_count;

        coupon_msg = `<div style="color: #23d087;">Use this coupon to get ${free_item_count} ${free_item_count > 1 ? "items" : "item"
          } for ₹1 each.</div>`;
      } else {
        // BxGy Coupon eligible and not Applicable
        if (bxgy_item_count > 0) {
          disabled = true;
          priorty_lvl = 1;
          coupon_msg = `<div style="color: #fc404d;">Add ${coupon_item.applicable_on.bxgy.get_count +
            coupon_item.applicable_on.bxgy.buy_count -
            bxgy_item_count
            } more ${bxgy_item_count > 1 ? "items" : "item"
            } from the list of <span class="link-eligible-items">eligible products</span> to avail this offer.</div>`;
        } else if (bxgy_item_count == 0) {
          disabled = true;
          priorty_lvl = 2;
          // If Sub type BRAND
          if (coupon_item.applicable_on.bxgy.sub_type == "brand") {
            coupon_msg = `<div style="color: #fc404d;">This Offer is available on select brand. <span class="link-eligible-items">View.</span></div></div>`;
          } else if (coupon_item.applicable_on.bxgy.sub_type == "catalog") {
            // Sub Type CATALOG
            coupon_msg = `<div style="color: #fc404d;">This Offer is available on select items. <span class="link-eligible-items">View.</span></div>`;
          }
        }
      }
      break;

    case "bundle": {
      let bundle_catalog_count = 0;
      Object.values(store.cartItems).forEach((cart_item) => {
        if (
          (coupon_item.eligible_ids?.catalog &&
            coupon_item.eligible_ids?.catalog[cart_item.catalog_info.id]) ||
          (coupon_item.eligible_ids?.brand &&
            coupon_item.eligible_ids?.brand[cart_item.brand_id])
        ) {
          if (cart_item.gift_item && cart_item.quantity == 1) {
            bundle_catalog_count += 0;
          } else if (cart_item.gift_item && cart_item.quantity > 1) {
            bundle_catalog_count +=
              cart_item.quantity - cart_item.gift_item.quantity;
          } else {
            bundle_catalog_count += cart_item.quantity;
          }
        }
      });
      if (
        bundle_catalog_count >= coupon_item.applicable_on.bundle.quantity &&
        coupon_item.applicable_on.bundle.amount >
          store.brandWiseCartItems[
            coupon_item.applicable_on.bundle.brand_id
          ]?.totalRetailPrice
      ) {
        disabled = true;
        coupon_msg = `<div style="color: #fc404d;">Looks like the bundle amount is more than your eligible items total amount.</div>`;
        priorty_lvl = 0;
      } else if (
        bundle_catalog_count >= coupon_item.applicable_on.bundle.quantity
      ) {
        disabled = false;
        coupon_msg = "";
        priorty_lvl = 2;
      } else {
        disabled = true;
        coupon_msg = `<div style="color: #fc404d;">This offer is available on selected catalogs <span class="link-eligible-items">View items.</span></div>`;
        priorty_lvl = 0;
      }
      break;
    }
  }
  return { discount, coupon_msg, disabled, priorty_lvl, eleigible_items_total };
}

export async function applyExpressCoupon(coupon_code) {
  const store = useStore();
  coupon_code = coupon_code.trim();
  if (coupon_code.length < 3) {
    return;
  }
  let formData = {
    user_id: store.user.id,
    items: [
      Object.keys(store.cartItems).map((v_id) => {
        return {
          catalog_id: store.cartItems[v_id].catalog_info.id,
          variant_id: v_id,
          quantity: 1,
        };
      })[0],
    ],
    coupon: coupon_code,
  };
  try {
    let response = await $fetch(
      useRuntimeConfig().public.entityURL + "/api/app/express-checkout/info",
      {
        method: "POST",
        credentials: "include",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      // uncmnt later
      // trackingApplyCouponCode(coupon_code);

      store.updateCartInfo({
        coupon: response?.payload?.coupon,
        coupon_value: response?.payload?.coupon_value,
      });
      let itemsArray = store.cartInfo.items;

      imitateCartInfo(itemsArray, "express");
      saveBrandWiseCart(itemsArray);
      calculatingShippingChargesForLocalItems();
      return response.payload;
    }
  } catch (error) {
    alert(error.response.data.error[0].message);
  }
}

export async function addItemToWishlist(itemInfo) {
  const store = useStore();
  const router = useRouter()
  const creatorStore = useCreatorStore();
  var formData = {
    user_id: store.user.id,
    wishlisted_catalog: {
      catalog_id: itemInfo.catalog_id || itemInfo.id,
    },
  };
  if (itemInfo?.source) {
    formData.wishlisted_catalog.source = { ...itemInfo?.source };
  } else if (creatorStore.info?.id) {
    formData.wishlisted_catalog.source = {
      id: creatorStore?.info?.id,
      type: "creator_store",
    };
  }
  if (store.user?.id) {
    var params = getUTMParams();
    try {
      var response = await $fetch(
        useRuntimeConfig().public.entityURL + "/api/v2/app/wishlist",
        {
          method: "PUT",
          credentials: "include",
          params: params,
          body: formData,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.payload) {
        await fetchWishlistedProducts();
        trackingWishlistingProducts(itemInfo);
      }
    } catch (err) {
      console.log("Error Adding item to Wishlist", err);
      return;
    }
  } else {
    var flag = confirm("You're not logged in, Let's get you logged in first?");
    if (flag) {
      router.push({
        name: "Login",
        query: {
          redirection_url: router.currentRoute.fullPath,
        },
      });
    } else {
      return;
    }
  }
}

export async function applyCartCoupon(coupon_code) {
  const store = useStore();
  coupon_code = coupon_code.trim();
  if (coupon_code.length < 3) {
    return;
  }

  let formData = {
    code: coupon_code,
  };

  try {
    let response = await $fetch(
      useRuntimeConfig().public.entityURL +
      "/api/app/cart/" +
      store.user.id +
      "/coupon",
      {
        method: "POST",
        credentials: "include",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      // uncmnt later
      // trackingApplyCouponCode(coupon_code);

      await fetchCartInfo();
      return response.payload;
    }
  } catch (error) {
    alert(error.response.data.error[0].message);
  }
}


export async function getGiftInfo() {
  try {
    var response = await $fetch(
      useRuntimeConfig().public.couponURL + "/api/brand/gifts",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.payload;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchWishlistedProducts() {
  const store = useStore();
  if (!store.user.id) {
    return;
  } else {
    await $fetch(
      `${useRuntimeConfig().public.entityURL}/api/v2/app/wishlist/${store.user.id
      }`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.payload) {
          store.saveWishlistedItems(response.payload);
        }
      })
      .catch((err) => {
        console.log("Error fetching Wishlisted Products", err);
      });
  }
}

export async function fetchCartInfo(bypass) {
  let router = useRouter();
  const store = useStore();
  if (
    (router.currentRoute.value.query.isExpress || !store.user?.id) &&
    !bypass
  ) {
    store.setCartloader(false)
    return null;
  }
  try {
    store.setCartloader(true)
    var response = await $fetch(
      useRuntimeConfig().public.entityURL +
      "/api/app/v2/cart/" +
      store.user?.id,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      let updateCartFlag = false;
      if (response.data?.payload?.items) {
        for (const [index, item] of response?.payload?.items?.entries()) {
          let flag = false;
          for (const [index, variant] of item.catalog_info.variants.entries()) {
            if (variant.id == item.variant_id) {
              flag = true;
            }
          }
          if (!flag) {
            updateCartFlag = true;
            await deleteItemFormCart(item.catalog_id, item.variant_id);
          }
        }
        if (updateCartFlag) {
          await fetchCartInfo(bypass);
          return;
        }
      }
      store.saveCartInfo(response.payload);
      if (response.payload?.items && response.payload?.items?.length > 0) {
        var items = await saveVariants(response.payload?.items);
        var cartItemsObject = items?.reduce(
          (obj, item) => Object.assign(obj, { [item.variant_id]: item }),
          {}
        );
        store.saveCartItems(cartItemsObject);
        saveBrandWiseCart(response.payload?.items);
      } else {
        store.saveCartItems({});
      }
    }
    store.setCartloader(false)
    return response.payload;
  } catch (error) {
    store.setCartloader(false)
    console.log(error);
    return null;
  }
}

function getRetailPrice(item, brandWiseCartItems) {
  if (item.coupon_applied) {
    return (
      item.retail_price.value * item.quantity -
      item?.coupon_applied?.value +
      (brandWiseCartItems[item.brand_info.id]?.totalRetailPrice || 0)
    );
  } else if (item.gift_item) {
    return (
      item.retail_price.value * (item.quantity - item.gift_item.quantity) +
      (brandWiseCartItems[item.brand_info.id]?.totalRetailPrice || 0)
    );
  } else {
    return (
      item.retail_price.value * item.quantity +
      (brandWiseCartItems[item.brand_info.id]?.totalRetailPrice || 0)
    );
  }
}

export async function updateUser() {
  let router = useRouter();
  const store = useStore();
  try {
    var response = await $fetch(
      useRuntimeConfig().public.entityURL + "/api/me?isWeb=true",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      store.saveUserInfo(response.payload.data);
      if (!router.currentRoute.value.query.isExpress) {
        await fetchCartInfo();
        await fetchWishlistedProducts();
      }
      // uncmnt later
      // trackingUser();
    }
  } catch (err) {
    console.log("Error updating user info", err);
  }
}

function getQuantity(item, brandWiseCartItems) {
  const store = useStore();
  if (
    store.cartInfo?.coupon?.type == "bxgy" &&
    item?.coupon_applied &&
    item?.coupon_applied?.value > 0
  ) {
    return (
      item.quantity -
      item?.coupon_applied?.quantity +
      (brandWiseCartItems[item.brand_info.id]?.totalQuantity || 0)
    );
  } else if (item?.gift_item) {
    return (
      item.quantity -
      item?.gift_item?.quantity +
      (brandWiseCartItems[item.brand_info.id]?.totalQuantity || 0)
    );
  } else {
    return (
      item.quantity +
      (brandWiseCartItems[item.brand_info.id]?.totalQuantity || 0)
    );
  }
}

export async function calculateShippingCharges() {
  const store = useStore();
  if (store.cartInfo?.shipping_charges_value) {
    store.updateCartInfo({
      grand_total: {
        ...store.cartInfo?.grand_total,
        value:
          (store.cartInfo?.grand_total?.value || 0) -
          store.cartInfo?.shipping_charges_value,
      },
    });
  }
  let shippingCharges = 0;
  if (store.cartInfo.shipping_charges) {
    for (let obj in store.cartInfo.shipping_charges) {
      if (store.cartInfo?.paymentMethod == "Cash on Delivery") {
        shippingCharges +=
          store.cartInfo.shipping_charges[obj].total_default_shipping_charges +
          store.cartInfo.shipping_charges[obj].total_cod_shipping_charges;
      } else if (!store.cartInfo?.paymentMethod) {
        shippingCharges +=
          store.cartInfo.shipping_charges[obj].total_default_shipping_charges;
      } else {
        shippingCharges +=
          store.cartInfo.shipping_charges[obj].total_default_shipping_charges +
          store.cartInfo.shipping_charges[obj].total_prepaid_shipping_charges;
      }
    }
  }
  // updating total (adding shipping charges (default + prepaid))
  store.updateCartInfo({
    grand_total: {
      ...store.cartInfo?.grand_total,
      value: (store.cartInfo?.grand_total?.value || 0) + shippingCharges,
    },
  });

  // Adding new field
  store.updateCartInfo({
    shipping_charges_value: shippingCharges,
  });
}

export function calculatingShippingChargesForLocalItems() {
  const store = useStore();
  let shipping_charges = {};
  Object.keys(store.brandWiseCartItems).forEach((brand_id) => {
    shipping_charges[brand_id] = {
      total_cod_shipping_charges: 0,
      total_default_shipping_charges: 0,
      total_prepaid_shipping_charges: 0,
    };
    if (store.brandWiseCartItems[brand_id]?.shipping_range?.cod) {
      store.brandWiseCartItems[brand_id]?.shipping_range?.cod?.forEach(
        (range) => {
          if (
            range.min_value <=
            store.brandWiseCartItems[brand_id].totalRetailPrice &&
            store.brandWiseCartItems[brand_id].totalRetailPrice <=
            range.max_value
          ) {
            shipping_charges[brand_id] = { ...shipping_charges[brand_id] };
            shipping_charges[brand_id]["total_cod_shipping_charges"] =
              range.shipping_charge;
          } else {
            shipping_charges[brand_id]["total_cod_shipping_charges"] = 0;
          }
        }
      );
    } else {
      shipping_charges[brand_id] = { ...shipping_charges[brand_id] };
      shipping_charges[brand_id]["total_cod_shipping_charges"] = 0;
    }
    if (store.brandWiseCartItems[brand_id]?.shipping_range?.prepaid) {
      store.brandWiseCartItems[brand_id]?.shipping_range?.prepaid.forEach(
        (range) => {
          if (
            range.min_value <=
            store.brandWiseCartItems[brand_id].totalRetailPrice &&
            store.brandWiseCartItems[brand_id].totalRetailPrice <=
            range.max_value
          ) {
            shipping_charges[brand_id] = { ...shipping_charges[brand_id] };
            shipping_charges[brand_id]["total_prepaid_shipping_charges"] =
              range.shipping_charge;
          } else {
            shipping_charges[brand_id]["total_prepaid_shipping_charges"] = 0;
          }
        }
      );
    } else {
      shipping_charges[brand_id] = { ...shipping_charges[brand_id] };
      shipping_charges[brand_id]["total_prepaid_shipping_charges"] = 0;
    }
    if (store.brandWiseCartItems[brand_id]?.shipping_range?.default) {
      store.brandWiseCartItems[brand_id]?.shipping_range?.default.forEach(
        (range) => {
          if (
            range.min_value <=
            store.brandWiseCartItems[brand_id].totalRetailPrice &&
            store.brandWiseCartItems[brand_id].totalRetailPrice <=
            range.max_value
          ) {
            shipping_charges[brand_id] = { ...shipping_charges[brand_id] };
            shipping_charges[brand_id]["total_default_shipping_charges"] =
              range.shipping_charge;
          } else {
            shipping_charges[brand_id]["total_default_shipping_charges"] = 0;
          }
        }
      );
    } else {
      shipping_charges[brand_id] = { ...shipping_charges[brand_id] };
      shipping_charges[brand_id]["total_default_shipping_charges"] = 0;
    }
  });
  store.updateCartInfo({ shipping_charges });
  calculateShippingCharges();
}

export async function saveBrandWiseCart(items) {
  let router = useRouter();
  const store = useStore();
  // Save brand wise cart
  var brandWiseCartItems = {};
  var brandCODEligibility = {
    flag: true,
    brandName: "",
  };
  items.forEach((item) => {
    if (item.gift_item && item.quantity == 1) {
      return;
    }

    if (item.brand_info?.id) {
      brandWiseCartItems[item.brand_info.id] = {
        name: item.brand_info.name,
        items: brandWiseCartItems[item?.brand_info?.id]
          ? [...brandWiseCartItems[item?.brand_info?.id]?.items, item]
          : [item],
        totalQuantity: getQuantity(item, brandWiseCartItems),
        totalRetailPrice: getRetailPrice(item, brandWiseCartItems),
      };

      if (item.brand_info.shipping_charges) {
        brandWiseCartItems[item.brand_info.id] = {
          ...brandWiseCartItems[item.brand_info.id],
          shipping_range: item.brand_info.shipping_charges,
        };
      }

      if (!item.brand_info.is_cod_available) {
        brandCODEligibility = {
          flag: false,
          brandName: item.brand_info?.name,
        };
      }
    }
  });
  store.updateCartInfo({ brandCODEligibility: brandCODEligibility });
  store.saveBrandWiseCartItems(brandWiseCartItems);
  if (
    store.cartInfo.items &&
    (router.currentRoute.value.query.isExpress || !store.user?.id)
  ) {
    calculatingShippingChargesForLocalItems();
  } else {
    calculateShippingCharges();
  }
}

export async function removeCouponFromCart(bypassCart) {
  let router = useRouter();
  const store = useStore();

  // For Express
  if (router.currentRoute.value.query.isExpress) {
    let itemsArray = store.cartInfo.items;

    store.updateCartInfo({ coupon: null, coupon_value: null });
    imitateCartInfo(itemsArray, "express");
    saveBrandWiseCart(itemsArray);
    calculatingShippingChargesForLocalItems();

    track("cart_coupon:code_remove", {
      ...store.cartDataToTrack,
      coupon: {
        ...store.cartDataToTrack?.coupon,
        discount_removed: store.cartDataToTrack?.coupon?.discount,
        discount_added: 0,
        discount: 0,
      },
    });

    return;
  }
  // For cart
  try {
    const response = await $fetch(
      useRuntimeConfig().public.entityURL +
      "/api/app/cart/" +
      store.user.id +
      "/coupon",
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      let coupon = {
        ...store.cartDataToTrack.coupon,
        discount_removed: store.cartDataToTrack.coupon.discount,
        discount_added: 0,
        discount: 0,
      };

      if (!bypassCart) {
        await fetchCartInfo();
      }
      track("cart_coupon:code_remove", {
        ...store?.cartDataToTrack,
        coupon: { ...coupon },
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAllCoupons() {
  const store = useStore();
  // Api to fetch cart/express cart coupons
  try {
    let params = "";
    if (getObjectLength(store.cartItems) > 0) {
      Object.keys(store.cartItems).forEach((id) => {
        params += `&catalog_id=${store.cartItems[id].catalog_info.id}`;
      });
    }

    var response = await $fetch(
      useRuntimeConfig().public.couponURL +
      "/api/app/coupons?version=2" +
      params,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      store.saveCouponsObject(addingCouponElegiblityList(response.payload));
      store.saveAllCoupons(response.payload);
      createCouponsMap(response.payload);
    }
    return response.payload;
  } catch (error) {
    console.log(error);
  }
}

export function addingCouponElegiblityList(couponsPayload) {
  var coupons = {};
  // creating brand/catalog wise map of in coupon info
  couponsPayload.forEach((coupon) => {
    let eligible_ids = {};
    if (coupon.applicable_on.name == "cart") {
      // Cart case
      eligible_ids["cart"] = true;
    } else if (coupon.applicable_on.name == "brand") {
      // Brand Case
      eligible_ids["brand"] = {};
      coupon.applicable_on.ids.forEach((i) => {
        eligible_ids["brand"][i] = true;
      });
    } else if (coupon.applicable_on.name == "catalog") {
      // Catalog case
      eligible_ids["catalog"] = {};
      coupon.applicable_on.ids.forEach((i) => {
        eligible_ids["catalog"][i] = true;
      });
    } else if (
      coupon.applicable_on.name == "bxgy" &&
      coupon.applicable_on.bxgy.sub_type == "brand"
    ) {
      // BxGy-Brand
      eligible_ids["brand"] = {};
      [
        ...new Set([
          ...coupon.applicable_on.bxgy.get_ids,
          ...coupon.applicable_on.bxgy.buy_ids,
        ]),
      ].forEach((i) => {
        eligible_ids["brand"][i] = true;
      });
    } else if (
      coupon.applicable_on.name == "bxgy" &&
      coupon.applicable_on.bxgy.sub_type == "catalog"
    ) {
      // BxGy-Catalog
      eligible_ids["catalog"] = {};
      [
        ...new Set([
          ...coupon.applicable_on.bxgy.get_ids,
          ...coupon.applicable_on.bxgy.buy_ids,
        ]),
      ].forEach((i) => {
        eligible_ids["catalog"][i] = true;
      });
    } else if (
      coupon.applicable_on.name == "bundle" &&
      coupon.applicable_on.bundle.catalog_ids
    ) {
      eligible_ids["catalog"] = {};
      coupon.applicable_on.bundle.catalog_ids.forEach((i) => {
        eligible_ids["catalog"][i] = true;
      });
    } else if (
      coupon.applicable_on.name == "bundle" &&
      !coupon.applicable_on.bundle.catalog_ids
    ) {
      eligible_ids["brand"] = {};
      eligible_ids.brand[coupon.applicable_on.bundle.brand_id] = true;
    }
    coupons[coupon.id] = { ...coupon, eligible_ids: eligible_ids };
  });
  return coupons;
}

export async function fetchUserAddresses() {
  const store = useStore();
  if (!store.user.id) {
    return;
  }
  await $fetch(
    `${useRuntimeConfig().public.entityURL}/api/customer/${store.user?.id
    }/address`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      var addressObject = response.payload?.reduce((obj, address) => {
        return {
          ...obj,
          [address.id]: address,
        };
      }, {});
      store.saveUserAddresses(addressObject);
    })
    .catch((error) => {
      console.log("Error fetching user addresses", error);
    });
}

export function saveVariants(items) {
  items.forEach(async (item) => {
    item["variants"] = item.catalog_info?.variants?.reduce((obj, item) => {
      return {
        ...obj,
        [item["id"]]: item,
      };
    }, {});
  });

  return items;
}

export async function removeItemFromWishlist(itemInfo) {
  const store = useStore();
  if (store.user.id) {
    var formData = {
      user_id: store.user?.id,
      catalog_id: itemInfo.catalog_id || itemInfo.id,
    };
    await $fetch(`${useRuntimeConfig().public.entityURL}/api/v2/app/wishlist`, {
      method: "DELETE",
      credentials: "include",
      body: formData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.payload) {
          await fetchWishlistedProducts();
        }
      })
      .catch((error) => {
        console.log("Error removing item form cart", error);
      });
  }
}

export async function getBrandInfoFromBrandId(brand_id) {
  try {
    let response = await $fetch(
      useRuntimeConfig().public.entityURL + "/api/app/brand/" + brand_id,
      {
        methods: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      return response.payload;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getInfluencerById(creatorId) {
  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.entityURL}/api/app/influencer/${creatorId}`,
      {
        method: "GET",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const creatorInfo = { ...response.payload };
    if (creatorInfo && !creatorInfo?.profile_image) {
      creatorInfo["profile_image"] = {
        src: defaultProfileImage(),
      };
    }
    return { ...creatorInfo };
  } catch (error) {
    console.log("error: ", error);
  }
}

export async function logoutUser(redirectionPath) {
  const router = useRouter();
  const { $posthog } = useNuxtApp();
  var logoutConfirm = confirm("Are you sure, you want to log out from HYPD?");
  if (!logoutConfirm) {
    return;
  } else {
    try {
      var response = await $fetch(
        `${useRuntimeConfig().public.entityURL}/api/user/auth/logout`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        $posthog().reset();

        if (redirectionPath) {
          await navigateTo(redirectionPath);
        }
        router.go();
      }
    } catch (err) {
      console.log("Error logging out", err);
    }
  }
}

export async function getBrandPageProducts(formData) {
  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.catalogURL}/api/catalog/category`,
      {
        method: "POST",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: formData
      }
    );
    return response.payload

  } catch (error) {
    console.log("error: ", error);
    return []
  }
}

export async function followBrand(formData, endpoint) {
  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.entityURL}/api/app/customer/brand/` + endpoint,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData
      }
    );
    return response.payload
  } catch (error) {
    console.log("error: ", error);
    return false
  }
}

export async function fetchBrandInfoByIds(brandIds) {
  try {
    var formData = {};
    formData["ids"] = brandIds;
    const response = await $fetch(
      useRuntimeConfig().public.entityURL +
      "/api/app/brand/basic",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      }
    );
    if (response.data.payload) {
      return response.data.payload;
    } else {
      return []
    }
  } catch (err) {
    console.log("Error fetching brand info by brand id", err);
    return []
  }
}

export async function getCategoriesByBrandId(brand_id) {
  try {
    const response = await $fetch(
      useRuntimeConfig().public.catalogURL +
      "/api/app/brand/category/lvl3?brand_id=" + brand_id,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.payload) {
      return { ...response.payload };
    } else {
      return {}
    }
  } catch (error) {
    console.log("error: ", error);
    return {}
  }
}
