FROM node:18.15.0-alpine3.17 AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

COPY . .

RUN pnpm build

FROM node:18.15.0-alpine3.17

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i --ignore-scripts --prod

CMD ["node", "build"]
