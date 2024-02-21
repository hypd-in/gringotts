export default defineNuxtConfig({
  build: {
    transpile: ["vue-ssr-carousel/nuxt"],
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ["@pinia/nuxt", "@nuxt/image"],
  ssr: true,
  devServer: {
    port: 8080,
  },
  srcDir: "src",
  routeRules: {
    "/ingest/**": { proxy: "https://app.posthog.com/**" },
  },
  runtimeConfig: {
    public:
      process.env.ENVIRONMENT !== "production"
        ? {
            env: process.env.ENVIRONMENT,
            // posthog
            posthogPublicKey: "phc_ogcVEeBL1LN5RCHFwNv80rmPrUCRcOKfmFSdgFqvne2",
            posthogHost: "https://app.posthog.com",

            catalogURL: "https://catalogv2.getshitdone.in",
            entityURL: "https://entity.getshitdone.in",
            cmsURL: "https://cms.getshitdone.in",
            orderURL: "https://orderv2.getshitdone.in",
            couponURL: "https://coupon.getshitdone.in",
            cdn: "cdn.getshitdone.in",
            base: "https://hypdstore.getshitdone.in",
            checkoutURL: "https://checkout.getshitdone.in",
            trackingURL: "https://tracking.getshitdone.in",
            gokwik_env: "sandbox",
            gokwick_mid: "3mt5u7iijbky068wbs",

            sentry: {
              dsn: "https://6b14ff42cfead1578923e8ce23ab7936@sentry.hypd.store/11",
              environment: "development",
            },
          }
        : {
            env: process.env.ENVIRONMENT,

            // posthog
            posthogPublicKey: "phc_Bhp0EO8PIx162Q13YzxHhmBhbB9OQdcgzydkWnOwPL1",
            posthogHost: "https://app.posthog.com",

            catalogURL: "https://catalog2.hypd.store",
            entityURL: "https://entity.hypd.store",
            cmsURL: "https://cms.hypd.store",
            orderURL: "https://order2.hypd.store",
            couponURL: "https://coupon.hypd.store",
            cdn: "cdn.hypd.store",
            base: "https://www.hypd.store",
            checkoutURL: "https://checkout.hypd.store",
            trackingURL: "https://tracking.hypd.store",

            gokwik_env: "production",
            gokwick_mid: "3mt5u7iijbky068wba",

            sentry: {
              dsn: "https://6b14ff42cfead1578923e8ce23ab7936@sentry.hypd.store/11",
              environment: "production",
            },
          },
  },
  nitro: {
    preset: "node-cluster",
  },
  app: {
    head: {
      title: "HYPD Store | #getHYPD",
      meta: [
        // Essentials
        {
          charset: "utf-8",
        },
        {
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, maximum-scale=1",
        },
        {
          property: "og:image",
          content: "https://www.hypd.store/img/social-logo.png",
        },

        // Twitter
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          name: "twitter:image",
          content: "https://www.hypd.store/img/social-logo.png",
        },
        {
          name: "theme-color",
          content: "#342546",
        },

        // Page Description
        {
          name: "description",
          content:
            "Shop from your favourite Creator's recommendations directly from their store! | #ItsAFullTimeJob | #getHYPD",
        },
        {
          property: "og:description",
          content:
            "Shop from your favourite Creator's recommendations directly from their store! | #ItsAFullTimeJob | #getHYPD",
        },
        {
          property: "og:title",
          content:
            "Shop from your favourite Creator's recommendations directly from their store! | #ItsAFullTimeJob | #getHYPD",
        },
        // Google Ads
        {
          property: "og:locale",
          content: "en_IN",
        },
        {
          name: "google-site-verification",
          content: "W6snttufB8sOVQbc9Hem5pmET3utO_enRiZWtO9lHIw",
        },
        {
          name: "google-site-verification",
          content: "eLJFdksmhTV_HZe5_bAY1-LuE0oUWKMhOnBwxoVMq9Q",
        },
      ],
      link: [
        {
          rel: "canonical",
          href: "https://www.hypd.store",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.ico",
        },
      ],
      script: [
        {
          defer: true,
          src:
            process.env.ENVIRONMENT != "production"
              ? "https://sandbox.juspay.in/pay-v3.js"
              : "https://api.juspay.in/pay-v3.js",
          type: "text/javascript",
        },
        {
          defer: true,
          async: true,
          onload: "window.FreshworksWidget('destroy')",
          src: "https://ind-widget.freshworks.com/widgets/84000002837.js",
          type: "text/javascript",
        },
        {
          children: `window.fwSettings = {
            'widget_id': 84000002837,
          };
          !function () { if ("function" != typeof window.FreshworksWidget) { var n = function () { n.q.push(arguments) }; n.q = [], window.FreshworksWidget = n } }() `,
        },
        {
          children: `
          (function (w, d, s, l, i) {
            w[l] = w[l] || []; w[l].push({
              'gtm.start':
                new Date().getTime(), event: 'gtm.js'
            }); var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'dataLayer', '${
            process.env.ENVIRONMENT !== "production"
              ? "GTM-WVHQR9Z"
              : "GTM-TVRPFDQ"
          }');
          `,
          type: "module",
        },
        {
          children: `var ifrm = document.createElement("iframe");
          ifrm.setAttribute("src", "https://www.googletagmanager.com/ns.html?id=${
            process.env.ENVIRONMENT !== "production"
              ? "GTM-WVHQR9Z"
              : "GTM-TVRPFDQ"
          }");
          ifrm.style.width = "0";
          ifrm.style.height = "0";
          ifrm.style.display = "none";
          ifrm.style.visibility = "hidden";
          document.body.appendChild(ifrm);`,
          type: "module",
        },
      ],
    },
  },

  components: [
    {
      path: "~/src/components",
      pathPrefix: false,
      extensions: [".vue"],
    },
  ],

  css: [
    "@/assets/style/main.css",
    "@/assets/style/transitions.css",
    "@/assets/style/main.scss",
  ],
});
