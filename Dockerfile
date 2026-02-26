FROM node:22.13 AS build_requirements
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    cmake \
    build-essential

FROM build_requirements AS stage
WORKDIR /app
COPY package.json package-lock.json nest-cli.json tsconfig.* ./
COPY src ./src
COPY assets ./assets
COPY prisma ./prisma
RUN npm install --only=production

FROM stage AS build
WORKDIR /app
RUN npx prisma generate
RUN npm run build

FROM node:22.13 AS production
RUN npm install -g npm@latest

FROM production AS entourage
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/assets ./assets
COPY --from=build /app/prisma ./prisma

EXPOSE 80

CMD [ "npm", "run", "start:prod" ]



