FROM node:18-alpine3.16 as BUILDER

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn postinstall

RUN yarn build

CMD ["node", "dist/main.js"]