# Étape 1: Build des dépendances
FROM node:18-alpine AS builder

WORKDIR /finance-analyzer

ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN npm install --only=production

COPY backend . 

FROM node:18-alpine

WORKDIR /finance-analyzer

COPY --from=builder /finance-analyzer/node_modules ./node_modules
COPY --from=builder /finance-analyzer .

EXPOSE 5000

CMD ["node", "index.js"]
