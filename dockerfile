# ------------------------
# 1. Base Builder
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies early (for caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma Client (no need for database access here)
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# ------------------------
# 2. Production Runner
# ------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
