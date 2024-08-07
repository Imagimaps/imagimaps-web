# TODO: Use Builder pattern to compile and deploy the service
FROM node:18
RUN corepack enable && corepack prepare pnpm@8 --activate
WORKDIR /app
COPY package.json /app
RUN pnpm install --prod
COPY dist/lib /app
CMD ["node", "index.js"]
EXPOSE 8082
