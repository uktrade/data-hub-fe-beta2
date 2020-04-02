FROM node:12.16.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build
RUN apt-get update
RUN apt-get install psmisc

CMD ["yarn", "develop"]
