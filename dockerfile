# --- STAGE 1: Build Image ---
# Gunakan image node yang sesuai untuk build
FROM node:20-alpine AS builder

# Tentukan direktori kerja di container
WORKDIR /app

# apk add --no-cache memasang build tools yang dibutuhkan oleh beberapa dependensi npm
RUN apk add --no-cache python3 make g++

# Copy package.json dan package-lock.json 
COPY package.json package-lock.json ./

# Install dependensi
RUN npm install

# Copy seluruh file aplikasi
COPY . .

# *** KUNCI SOLUSI INI: Gunakan DATABASE_URL palsu/dummy untuk build-time ***
# Ini memungkinkan 'prisma generate' dan 'npm run build' berjalan tanpa koneksi DB.
# Pastikan skema koneksi sesuai dengan MySQL.
ENV DATABASE_URL="mysql://user:password@localhost:3306/mydb?schema=public"

# Lakukan generate Prisma Client
RUN npx prisma generate

# Lakukan build aplikasi Next.js
RUN npm run build

# --- STAGE 2: Production Image ---
# Image yang lebih kecil dan hanya untuk menjalankan aplikasi
FROM node:20-alpine AS runner

# Set environment variabel untuk Node.js di Production
ENV NODE_ENV=production

WORKDIR /app

# Copy file build dari builder stage
# Salin hanya yang diperlukan untuk menjalankan aplikasi.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts
# Pastikan hasil generate Prisma Client dicopy
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Ekspos port yang digunakan Next.js (biasanya 3000)
EXPOSE 3000

# Jalankan aplikasi. 
# *** CATATAN PENTING: DATABASE_URL yang VALID harus diberikan saat RUN-TIME! ***
# Misalnya, melalui 'docker run -e' atau 'docker-compose.yml'
CMD ["npm", "start"]