/** @type {import("next").NextConfig} */

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim()) : ["localhost:29500"];

module.exports = {
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "publishing.dp.aws.onsdigital.uk", // sandbox
        "publishing.dp-staging.aws.onsdigital.uk", // staging
        "localhost:29500" // local when running in dataset-catalogue stack
      ],
    },
  },
};

console.log(module.exports.experimental.serverActions.allowedOrigins)
console.log(allowedOrigins)
