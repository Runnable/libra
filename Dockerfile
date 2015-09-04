FROM node:0.12.7

ADD . /libra

WORKDIR /libra

RUN npm install

CMD node index.js