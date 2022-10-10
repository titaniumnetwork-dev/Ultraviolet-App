FROM node:current-slim

WORKDIR /usr/app

COPY ./ ./

RUN npm i

ENTRYPOINT npm start
