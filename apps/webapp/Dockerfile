# Prepare base
FROM node:20 AS base
WORKDIR /app
ENV HUSKY=0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack install -g pnpm@latest-9
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm run deploy pruned

# Final stage
FROM node:20-slim AS final
WORKDIR /app
ARG run_args=""
ENV RUN_ARGS=$run_args
ENV NODE_ENV=production
ENV HUSKY=0
COPY --from=base /app/.output/ ./
EXPOSE 80
ENTRYPOINT ["sh", "-c", "node index.js $RUN_ARGS"]
