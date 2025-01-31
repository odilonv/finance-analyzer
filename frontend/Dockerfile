# Étape 1: Builder l'application React
FROM node:18-alpine AS builder

WORKDIR /finance-analyzer

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend application
COPY . .

# Build the application
RUN npm run build

# Étape 2: Serve the built application using Nginx
FROM nginx:alpine

# Copy the built files from the builder stage
COPY --from=builder /finance-analyzer/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]