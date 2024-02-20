import { defineNuxtPlugin } from "#app";
import posthog from "posthog-js";
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    // api_host: runtimeConfig.public.posthogHost || "https://app.posthog.com",
    api_host:
    runtimeConfig.public.env != "production"
        ? "https://hypdstore.getshitdone.in/ingest"
        : "https://beta.hypd.store/ingest",
    ui_host: "https://app.posthog.com", // or https://eu.posthog.com if your PostHog is hosted in Europe
    autocapture: false,
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      if (import.meta.env.MODE === "development") posthog.debug(false);
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture("$pageview", {
        current_url: to.fullPath,
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
