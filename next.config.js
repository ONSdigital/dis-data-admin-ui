/** @type {import("next").NextConfig} */

const path = require("path");

module.exports = {
  // Pin project root so Turbopack does not walk up to a parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  outputFileTracingRoot: path.join(__dirname),
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:29500", // local when running in dataset-catalogue stack
        "publishing.eks.dp.aws.onsdigital.uk", // sandbox
        "publishing.eks.dp-staging.aws.onsdigital.uk", // staging
        "publishing.eks.dp-prod.aws.onsdigital.uk" // prod
      ],
    },
  },
  allowedDevOrigins: ["127.0.0.1"], // for component tests
};
