FROM node:22-alpine AS build

WORKDIR /app

RUN npm install --global bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN npx prisma generate

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS run

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8000

RUN npm install --global bun
COPY package.json ./
COPY bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

USER node
EXPOSE 8000
CMD ["node", "dist/main.js"]
