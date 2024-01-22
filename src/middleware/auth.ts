export default defineNuxtRouteMiddleware(async (to, from) => {
    await fetchUserInfo();
    const store = useStore();
    if (!store.user) {
        return abortNavigation();
    }
})
