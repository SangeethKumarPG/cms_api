# ---------- Build stage ----------
FROM node:24-alpine AS builder

WORKDIR /app

# Prevent npm lifecycle scripts
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

# ---------- Runtime stage ----------
FROM node:24-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy app + dependencies
COPY --from=builder /app /app

# Drop privileges
USER appuser

ENV NODE_ENV=production
ENV TZ=UTC

EXPOSE 3001

CMD ["node", "index.js"]
