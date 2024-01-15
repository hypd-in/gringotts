export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  build: {
    transpile: ['vue-ssr-carousel/nuxt'],
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  ssr: true,
  devServer: {
    port: 8080,
  },
  srcDir: "src",
  runtimeConfig: {
    public:
      process.env.NODE_ENV != "production"
        ? {
          catalogURL: "https://catalogv2.getshitdone.in",
          entityURL: "https://entity.getshitdone.in",
          cmsURL: 'https://cms.getshitdone.in'
        }
        : {
          catalogURL: "https://catalog2.hypd.store",
          entityURL: "https://entity.hypd.store",
          cmsURL: 'https://cms.hypd.store'
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
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.ico'
        }
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
