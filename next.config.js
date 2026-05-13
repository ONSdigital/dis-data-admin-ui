/** @type {import("next").NextConfig} */

module.exports = {
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:29500", // local when running in dataset-catalogue stack
        "publishing.eks.dp.aws.onsdigital.uk", // sandbox
        "publishing.eks.dp-staging.aws.onsdigital.uk" // staging
        ],
    },
  },
  allowedDevOrigins: ["127.0.0.1"], // for component tests
};
