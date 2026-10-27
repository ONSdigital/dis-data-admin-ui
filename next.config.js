/** @type {import("next").NextConfig} */

const path = require("path");

const watchPollIntervalMs = Number(process.env.WATCH_POLL_INTERVAL_MS);

module.exports = {
  // Pin project root so Turbopack does not walk up to a parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
  // If WATCH_POLL_INTERVAL_MS is set, use it to configure the watch poll interval for Turbopack
  // This is useful for environments where file system events are not reliable, such as Docker.
  ...(Number.isFinite(watchPollIntervalMs) && watchPollIntervalMs > 0
    ? { watchOptions: { pollIntervalMs: watchPollIntervalMs } }
    : {}),
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
