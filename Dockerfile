# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Prevent npm from running lifecycle scripts (supply-chain protection)
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

# ---------- Runtime stage ----------
FROM node:24-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only what is required to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/index.js ./index.js
# If you have more runtime files, explicitly list them

# Drop privileges
USER appuser

# Security & performance
ENV NODE_ENV=production
ENV TZ=UTC

EXPOSE 3001

CMD ["node", "index.js"]
