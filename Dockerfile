FROM node:20.3.1 AS base

WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 14000

ENV PORT=14000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
