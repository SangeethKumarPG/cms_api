# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Prevent npm lifecycle scripts (supply-chain protection)
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

# ---------- Runtime stage ----------
FROM node:24-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy runtime dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy application runtime code (SAFE directories only)
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/config ./config

# Drop privileges
USER appuser

ENV NODE_ENV=production
ENV TZ=UTC

EXPOSE 3001

CMD ["node", "index.js"]
