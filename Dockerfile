FROM ukti/docker-data-hub-base:latest

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN apt-get install -y psmisc

# Setup app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn --ignore-engines install

COPY . /usr/src/app
RUN npm run build

EXPOSE 3000
EXPOSE 9229

CMD [ "npm", "start" ]
