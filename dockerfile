FROM node:20-alpine
WORKDIR /app

# 1. Install system dependencies needed for MySQL and Prisma engines
RUN apk add --no-cache openssl openssh bash

# 2. Copy dependency files first
COPY package*.json ./

# 3. Install dependencies (prod and dev) for the Linux platform
# This step creates the correct Linux-native node_modules folder.
RUN npm install

# 4. Copy all application files (overwrite the files copied in step 2)
COPY . .

# 5. Run Prisma generate to ensure the client is built for the current platform
RUN npx prisma generate

# 6. Execute Migrations and Seed during the build (since we have the DATABASE_URL available via the .env file)
# NOTE: This requires the database to be running *at build time* if run locally, or we need to pass a fake one.
# Since you're targeting a production style, we will skip the build-time migration/seed.

# 7. Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 3000

# We don't need the entrypoint script anymore.
# We will use the proper Prisma commands and then start the app.
CMD npx prisma migrate deploy && npm run prisma-seed && npm start
