# Production-like image
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
