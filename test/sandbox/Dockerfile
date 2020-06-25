FROM node:12.18.0

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

CMD npx nodemon .
