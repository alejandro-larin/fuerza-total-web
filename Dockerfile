FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    AUTH_SECRET=build-only-placeholder-not-used-at-runtime \
    npm run build

FROM base AS migrations
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=migrations --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=migrations --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=migrations --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=migrations --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=dependencies --chown=nextjs:nodejs /app/generated ./generated
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
