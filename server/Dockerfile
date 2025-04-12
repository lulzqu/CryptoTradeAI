# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose ports
EXPOSE 3000

# Start server
CMD ["npm", "start"] 