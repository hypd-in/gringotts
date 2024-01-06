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
          console.log(store.wishlistedItems);
        }
      })
      .catch((err) => {
        console.log("Error fetching Wishlisted Products", err);
      });
  }
}
