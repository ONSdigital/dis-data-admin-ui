/** @type {import("next").NextConfig} */

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim()) : ["localhost:29500"];

module.exports = {
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins
    },
  },
  allowedDevOrigins: ["127.0.0.1"], // for component tests
};
