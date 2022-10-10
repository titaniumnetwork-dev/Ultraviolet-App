FROM node:current-slim

WORKDIR /app

COPY ./ ./

RUN npm i

ENTRYPOINT npm start
