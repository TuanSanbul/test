FROM node:16-alpine as build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install --production=false --ignore-scripts --frozen-lockfile

COPY libs ./libs

CMD yarn run migration:run -- -d ./libs/core/databases/postgres/ormconfig.ts