/** @type {import("next").NextConfig} */

const allowedOrigins = process.env.ALLOWED_ORIGINS ? [process.env.ALLOWED_ORIGINS] : ["localhost:29500"];
    
module.exports = {
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins
    },
  },
};
