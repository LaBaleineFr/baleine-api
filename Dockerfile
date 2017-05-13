FROM node:latest
MAINTAINER Maxime <maximecattet@gmx.com>

WORKDIR /app
COPY . /app

RUN yarn install && \
    yarn build && \
    yarn install --prod

CMD ["node", "./dist/server.js"]