FROM node:18.15.0-alpine3.17 AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

COPY . .

RUN pnpm build

FROM node:18.15.0-alpine3.17

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./build

CMD ["node", "build"]
