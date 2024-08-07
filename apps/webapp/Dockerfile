# Prepare workspace
FROM node:18 AS workspace
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8 --activate
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch
COPY . .
RUN pnpm install --recursive --frozen-lockfile

# Build stage
FROM workspace AS build
ARG service
WORKDIR /app
RUN pnpm --recursive run build
# RUN pnpm --filter ${service} deploy --prod pruned
RUN pnpm --filter webapp deploy --prod pruned

# Final stage
FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist/html/main .
COPY --from=build /app/dist/static .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
