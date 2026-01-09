FROM node:24-alpine

WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json* ./

# Install only production deps
RUN npm install --omit=dev

# Copy app source
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the backend
CMD ["node", "index.js"]
