import * as Sentry from "@sentry/vue";

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const {
    public: { sentry },
  } = useRuntimeConfig();

  if (!sentry.dsn) {
    return;
  }

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn: sentry.dsn,
    environment: sentry.environment,
    trackComponents: true,
    initialScope: {
      tags: {
        "Hypd Store": "Hypd Store",
        environment: sentry.environment,
      },
    },
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay(),
    ],

    // Configure this whole part as you need it!

    tracesSampleRate: 0.1, // Change in prod

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      "http://localhost:8080",
      "https://beta.hypd.store/",
      "https://hypd.store/",
    ],

    replaysSessionSampleRate: 0.25, // Change in prod
    replaysOnErrorSampleRate: 1.0, // Change in prod if necessary
  });
});
