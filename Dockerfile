# build app
FROM docker.io/node:current-alpine3.15 AS builder

RUN apk update
RUN apk add git

COPY . /app
WORKDIR /app

RUN npm install

# build final
FROM gcr.io/distroless/nodejs:16

EXPOSE 8080/tcp

COPY --from=builder /app /

CMD ["src/index.js"]