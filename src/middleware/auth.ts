export default defineNuxtRouteMiddleware(async (to, from) => {
  await fetchUserInfo();
  const store = useStore();
  // if (Object.keys(store.user).length == 0) {
  //   return navigateTo({
  //     name: "Login",
  //     query: {
  //       "redirection_url": to.path,
  //     },
  //   });
  // }
});
