export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await fetchUserInfo();
  console.log("Middleware", user);
  
  const sessionCookie = useCookie("session");
  if (!sessionCookie.value && !user?.id) {
    return navigateTo({
      name: "Login",
      query: {
        "redirection_url": to.path,
      },
    });
  }
});
