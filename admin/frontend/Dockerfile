# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install all dependencies (required for build)
RUN npm ci

# Copy source files
COPY . .

# Build production SPA assets
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy admin SPA routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 inside container
EXPOSE 80

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
