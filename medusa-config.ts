import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  modules: [
    {
      resolve: "./src/modules/brand",
    },
  ],
  plugins: [
    {
     resolve: "@minskylab/medusa-payment-mercadopago" ,
      options:{
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
        success_backurl: process.env.MERCADOPAGO_SUCCESS_BACKURL,
        webhook_url: process.env.MERCADOPAGO_WEBHOOK_URL,
      }
    }
  ]
});
