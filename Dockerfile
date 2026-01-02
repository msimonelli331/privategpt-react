# Multi-stage Dockerfile for PrivateGPT React app with backend
FROM node:25-alpine AS builder

# Build the frontend
WORKDIR /app/frontend
COPY frontend .
RUN npm install -g pnpm && pnpm install && pnpm build

# Build the backend
WORKDIR /app/backend
COPY backend .
RUN pnpm install

FROM node:25-alpine

# Set working directory
WORKDIR /app

# Copy built frontend and backend
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/frontend/package.json ./frontend/
COPY --from=builder /app/backend ./backend

# Change ownership
RUN chown -R 1000:1000 /app
USER 1000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Set entrypoint to run both frontend and backend
ENTRYPOINT ["node", "backend/src/index.js"]