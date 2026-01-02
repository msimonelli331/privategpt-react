# Multi-stage Dockerfile for PrivateGPT React app with backend
FROM node:25-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY frontend .

# Build the frontend
RUN pnpm build

# Build the backend
WORKDIR /app/backend
RUN pnpm install

# Final stage
FROM node:25-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1000 -S nodejs && \
    adduser -S nextjs -u 1000

# Copy built frontend and backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend/package.json ./backend/package.json

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Set entrypoint to run both frontend and backend
# Note: This is a simplified approach. In production, you'd typically run
# the frontend as a static site and the backend as a separate service.
# This example combines them for demonstration purposes.
ENTRYPOINT ["sh", "-c", "node backend/src/index.js & cd dist && npx serve -l 3000"]