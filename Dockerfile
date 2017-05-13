FROM node:latest
MAINTAINER Maxime <maximecattet@gmx.com>

WORKDIR /app
COPY . /app

RUN yarn install && \
    yarn build && \
    yarn install --prod

EXPOSE 3636

CMD ["node", "./dist/server.js"]