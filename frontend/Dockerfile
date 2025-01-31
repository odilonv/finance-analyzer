# Étape 1: Builder l'application React
FROM node:18-alpine AS builder

WORKDIR /finance-analyzer

COPY frontend/package.json frontend/package-lock.json ./

RUN npm install --legacy-peer-deps

COPY frontend .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /finance-analyzer/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
