FROM node:16-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production=false --ignore-scripts --frozen-lockfile

COPY . .

RUN yarn build order-service


FROM node:16-alpine as main

WORKDIR /

COPY --from=build /app/dist/apps/order-service/ /

COPY --from=build /app/node_modules/ /node_modules/

COPY --from=build /app/package.json /

EXPOSE 3007

CMD node main.js