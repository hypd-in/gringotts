export default defineNuxtConfig({
  build: {
    transpile: ["vue-ssr-carousel/nuxt"],
  },
  devtools: {
    enabled: false,
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
            gokwik_env: "sandbox",
            gokwick_mid: "3mt5u7iijbky068wbs",
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
            gokwik_env: "production",
            gokwick_mid: "3mt5u7iijbky068wba",
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
        // {
        //   children: `! function (t, e) {
        //     var o, n, p, r;
        //     e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
        //       function g(t, e) {
        //         var o = e.split(".");
        //         2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () {
        //           t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
        //         }
        //       } (p = t.createElement("script")).type = "text/javascript", p.async = !0, p.src = s.api_host + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
        //       var u = e;
        //       for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) {
        //         var e = "posthog";
        //         return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
        //       }, u.people.toString = function () {
        //         return u.toString(1) + ".people (stub)"
        //       }, o = "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "), n = 0; n < o.length; n++) g(u, o[n]);
        //       e._i.push([i, s, a])
        //     }, e.__SV = 1)
        //   }(document, window.posthog || []);
        //   posthog.init('phc_ogcVEeBL1LN5RCHFwNv80rmPrUCRcOKfmFSdgFqvne2', {
        //     api_host: 'https://app.posthog.com'
        //   }) `,
        //   type: "text/javascript",
        // },
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
