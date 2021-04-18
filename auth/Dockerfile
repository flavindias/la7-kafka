FROM node:14.16-alpine3.11

RUN apk update
RUN apk upgrade
RUN apk add bash

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn

ADD . .
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn build
RUN rm -rf src

CMD ["yarn", "start"]
EXPOSE 3000