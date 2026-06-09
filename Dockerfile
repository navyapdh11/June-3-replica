# Multi-stage build for React (Vite) + Node (Express)
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install packages
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the client SPA & compile server.ts -> dist/server.cjs in production
ENV NODE_ENV=production
RUN npm run build

# --- Runner Stage ---
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the server port
EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
