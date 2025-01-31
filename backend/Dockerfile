# Étape 1: Build des dépendances
FROM node:18-alpine AS builder

WORKDIR /finance-analyzer

ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the backend application
COPY . .

# Étape 2: Create the final image
FROM node:18-alpine

WORKDIR /finance-analyzer

# Copy node_modules from the builder stage
COPY --from=builder /finance-analyzer/node_modules ./node_modules

# Copy the rest of the application from the builder stage
COPY --from=builder /finance-analyzer .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]