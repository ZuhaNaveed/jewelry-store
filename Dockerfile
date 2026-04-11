# ============================
# Stage 1: Build the Application
# ============================
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================
# Stage 2: Production Runner
# ============================
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct ownership
USER nextjs

# Expose the application port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
