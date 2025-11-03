# ------------------------
# 1. Base Builder
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy all source code first
COPY . .

# Build without Prisma generate (it will run at runtime)
RUN npm run build

# ------------------------
# 2. Production Runner
# ------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Prisma will need DATABASE_URL at runtime, not during build
EXPOSE 3000

# Generate Prisma client + start app
CMD npx prisma generate && npm start
