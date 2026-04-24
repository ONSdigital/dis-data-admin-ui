/** @type {import("next").NextConfig} */

module.exports = {
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["localhost:29500"],
    },
  },
  allowedDevOrigins: ["127.0.0.1"], // for component tests
};

console.log("Allowed orgings from module.exports: ", module.exports.experimental.serverActions.allowedOrigins)
