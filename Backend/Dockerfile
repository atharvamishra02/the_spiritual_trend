FROM node:18-alpine

WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy server code
COPY . .

# Expose the API server port
EXPOSE 5000

# Start server in production mode
CMD ["node", "server.js"]
