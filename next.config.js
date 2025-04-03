/** @type {import('next').NextConfig} */
module.exports = {
    output: "standalone",
    basePath: "/data-admin",
    experimental: {
        serverActions: {
          allowedOrigins: ['publishing.dp.aws.onsdigital.uk'],
          allowedOrigins: ['publishing.dp-staging.aws.onsdigital.uk']
        },
      },
};
