FROM node:12.16.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .
RUN yarn build
# There's a problem with node releasing/allocating port 9229 - so the following
# installs psmisc which allows us to use `fuser` to explicitly kill anything using port 9229
RUN apt-get update
RUN apt-get install psmisc

CMD ["yarn", "develop"]
