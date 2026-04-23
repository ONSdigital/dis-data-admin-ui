export function GET() {
  const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim()) : [];

  const hardcodedOrigins = [
    "publishing.dp.aws.onsdigital.uk",
    "publishing.dp-staging.aws.onsdigital.uk",
    "localhost:29500"
  ];

  console.log("Allowed origins from env vars:", envOrigins);
  console.log("Hardcoded allowed origins:", hardcodedOrigins);

  return Response.json({ envOrigins, hardcodedOrigins });
}
