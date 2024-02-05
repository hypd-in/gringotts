export default defineNuxtRouteMiddleware(async (to, from) => {
  await fetchUserInfo();
  const sessionCookie = useCookie("session");
  if (!sessionCookie) {
    return navigateTo({
      name: "Login",
      query: {
        "redirection_url": to.fullPath,
      },
    });
  }
});
