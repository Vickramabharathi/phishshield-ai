FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose default port
EXPOSE 5050

# Environment variables
ENV NODE_ENV=production
ENV PORT=5050

# Start server
CMD ["node", "server/index.js"]
