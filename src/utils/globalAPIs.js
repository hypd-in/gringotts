import { useRuntimeConfig } from "nuxt/app";
export async function fetchUserInfo() {
  const store = useStore();
  await $fetch(`${useRuntimeConfig().public.entityURL}/api/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.payload) {
        store.saveUserInfo(response.payload);
        fetchWishlistedProducts();
        return response.payload;
      }
    })
    .catch((err) => {
      console.log("Error fetching user info", err);
      return null;
    });
}

export async function fetchWishlistedProducts() {
  const store = useStore();
  if (!store.user.id) {
    return;
  } else {
    await $fetch(
      `${useRuntimeConfig().public.entityURL}/api/v2/app/wishlist/${
        store.user.id
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

export async function fetchCartInfo() {
  const store = useStore();
  // const route = useRoute();
  if (!store.user?.id) {
    return;
  } else {
    await $fetch(
      `${useRuntimeConfig().public.entityURL}/api/app/v2/cart/${store.user.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        if (response.payload) {
          store.saveCartInfo(response.payload);
          if (response.payload?.items && response.payload?.items?.length > 0) {
            var items = await saveVariants(response.payload?.items);
            var cartItemsObject = {};
            cartItemsObject = items?.reduce(
              (obj, item) => Object.assign(obj, { [item.variant_id]: item }),
              {}
            );
            store.saveCartItems(cartItemsObject);
          } else {
            store.saveCartItems({});
          }
        }
      })
      .catch((err) => {
        console.log("Error fetching cart info", err);
      });
  }
}

export async function fetchUserAddresses() {
  const store = useStore();
  if (!store.user.id) {
    return;
  }
  await $fetch(
    `${useRuntimeConfig().public.entityURL}/api/customer/${
      store.user?.id
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
      console.log(store.addresses);
    })
    .catch((error) => {
      console.log("Error fetching user addresses", error);
    });
}

export async function saveVariants(items) {
  items.forEach(async (item) => {
    item["variants"] = await item.catalog_info?.variants?.reduce(
      (obj, item) => {
        return {
          ...obj,
          [item["id"]]: item,
        };
      },
      {}
    );
  });

  return items;
}

export async function addItemToWishlist(itemInfo) {
  const store = useStore();
  const router = useRouter();
  var formData = {
    user_id: store.user.id,
    wishlisted_catalog: {
      catalog_id: itemInfo.catalog_id || itemInfo.id,
    },
  };

  if (itemInfo?.source) {
    formData.wishlisted_catalog.source = { ...itemInfo?.source };
  } else if (useCreatorStore.info?.id) {
    formData.wishlisted_catalog.source = {
      id: useCreatorStore?.info?.id,
      type: "creator_store",
    };
  }
  if (store.user.id) {
    await $fetch(`${useRuntimeConfig().public.entityURL}/api/v2/app/wishlist`, {
      method: "PUT",
      credentials: "include",
      body: formData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        await fetchWishlistedProducts();
      })
      .catch((error) => {
        console.log("Error adding item to wishlist", error);
      });
  } else {
    let wantToLogin = confirm("Let's get you logged in first?");
    if (wantToLogin) {
      navigateTo({
        name: "Login",
        query: {
          redirection_url: router.currentRoute.fullPath,
        },
      });
    }
  }
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

export async function fetchAllCoupons() {
  await $fetch(
    `${useRuntimeConfig().public.couponURL}/api/app/coupons?version=2`,
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
        createCouponsMap(response.payload);
      }
    })
    .catch((error) => {
      console.log("Error fetching coupons", error);
    });
}
