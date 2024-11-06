FROM node:20.3.1 AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 29400

CMD ["npm", "run", "dev"]
