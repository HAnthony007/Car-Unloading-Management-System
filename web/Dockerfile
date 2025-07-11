# ================= STAGE 1 : BUILD =================
FROM oven/bun:latest AS builder

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install

COPY . .

RUN bun run build

# ================= STAGE 2 : PRODUCTION =================
FROM oven/bun:latest AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

RUN bun install --production

EXPOSE 3000

CMD ["bun", "run", "start"]
