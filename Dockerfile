FROM node:current-slim

WORKDIR /app

COPY ./ ./

RUN npm install --omit=dev

ENTRYPOINT npm start
