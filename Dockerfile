# initing
FROM node:19-alpine3.16
WORKDIR .
COPY . .
# setting up
RUN npm install
# Time to profit?
EXPOSE 8080/tcp
CMD ["PORT=8080","npm", "start"]

