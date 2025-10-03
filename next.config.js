/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
  basePath: "/data-admin",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "publishing.dp.aws.onsdigital.uk", // sandbox
        "publishing.dp-staging.aws.onsdigital.uk", // staging
        "localhost:29500", // local when running in dataset-catalogue stack
        "publishing.eks.dp.aws.onsdigital.uk", // EKS sandbox
        "publishing.eks.dp-staging.aws.onsdigital.uk" // EKS staging
      ],
    },
  },
};
