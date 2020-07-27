FROM node:12.18.0

ENV DOCKERIZE_VERSION      v0.6.1
ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TZ                     Europe/London
ENV TERM                   xterm
ENV LANG                   C.UTF-8
ENV NODE_ENV               development

RUN apt-get update

# Install common dependencies
RUN apt-get install -y \
  tzdata \
  wget \
  curl \
  make \
  git

# Fix error when libpng cannot be found after CircleCI restores cache for pngquant-bin.
# See https://github.com/tcoopman/image-webpack-loader/issues/95
RUN wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
  && echo "Timezone: $(date +%z)"

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install Cypress dependencies
RUN apt-get install -y \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  xvfb

# Install visual test dependencies
RUN apt-get install -y imagemagick

# Install Chrome (Latest)
RUN apt-get install -y xvfb xdg-utils libgtk-3-0 lsb-release libappindicator3-1 fonts-liberation libasound2 libnspr4 libnss3 \
  && curl https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -O \
  && dpkg -i google-chrome-stable_current_amd64.deb \
  && rm google-chrome-stable_current_amd64.deb \
  && google-chrome --version

WORKDIR /usr/src/app

# Install dev packages
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD npm run develop

