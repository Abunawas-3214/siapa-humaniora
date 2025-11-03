# Step 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build Next.js app
RUN npm run build

# Step 2: Run stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app ./

# Expose app port
EXPOSE 3000

# Run production server
CMD ["npm", "start"]