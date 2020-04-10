FROM node:current-alpine

WORKDIR /usr/src/app
RUN apk add curl

COPY . .

RUN yarn install && yarn build

# express.js
EXPOSE 3000

CMD ["node","dist/index.js"]