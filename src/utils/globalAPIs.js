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
