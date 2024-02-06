export default defineNuxtRouteMiddleware(async (to, from) => {
  var user = await fetchUserInfo();

  if (user?.id) {
    if (to.query.redirection_url) {
      return {
        path: to.query.redirection_url,
      };
    }
    return;
  } else if (!user?.id && to.path !== "/login") {
    return navigateTo({
      name: "Login",
      query: {
        "redirection_url": to.path,
      },
    });
  }
});
