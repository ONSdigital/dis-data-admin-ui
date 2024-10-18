FROM node:20.3.1 AS base

WORKDIR /app

RUN corepack enable	
RUN yarn set version stable 

COPY . .

RUN yarn install

RUN yarn vite build

CMD yarn node server.js
