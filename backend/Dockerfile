# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Provide OpenSSL libraries required by Prisma engines
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Build application
RUN npm run build
RUN npm run prisma:generate

# Production stage
FROM node:20-slim

WORKDIR /app

# Install dumb-init and OpenSSL libraries
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Create a non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nodejs

USER nodejs

EXPOSE 4000

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]
