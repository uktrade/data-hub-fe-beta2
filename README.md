# Data Hub frontend

[![CircleCI](https://circleci.com/gh/uktrade/data-hub-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/data-hub-frontend)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://uktrade.github.io/data-hub-frontend)

An express application that fetches data from a back end JSON based api and renders it to the screen.
This front end layer is primarily turning requests from the browser into back end API calls and then
rendering them using Nunjucks template language.

The client layer applies the ideals of progressive enhancement so that a wide range of devices can
access it, no matter what their limitation.

In order to use the application the front end layer must be run, with a small number of settings,
and be provided with a back end server to provide the API, data storage and search engine capabilities.

## Table of contents

- [Getting started](#getting-started)
  - [Running project within Docker](#running-project-within-docker)
  - [Running project natively](#running-project-natively)
- [Environment variables](#environment-variables)
- [Deployments](./docs/Deployments.md)
- [Conventions](./docs/Conventions.md)
- [Templating With Nunjucks](./docs/Templating%20with%20Nunjucks.md)
- [Running tests](./docs/Running%20tests.md)
- [Code Review guidelines](./docs/Code%20review%20guidelines.md)
- [Sub-apps](./docs/Sub-apps.md)
- [Feature flags](./docs/Feature%20flags.md)
- [Upgrading Node version](./docs/Upgrading%20Node%20version.md)
- [Single sign-on](./docs/Single%20sign-on.md)
- [Making changes](#making-changes)
- [Formatting markdown files](#formatting-markdown-files)
- [Managing Dependabot PRs](./docs/Dependabot.md)

## Getting started

### Running the project within Docker (recommended method)

Please view the dedicated [Docker readme](./docs/Docker.md).

### Running the project natively

**Note for all users** If you wish to run the functional tests against your native frontend, you will need to pass a config flag to point cypress to run against port 3000 - `npm run test:functional:watch --config baseUrl=http://localhost:3000`.

**Note for Civil Servant developers** When running the project natively for the first time on your DIT-issued device you will need to setup ZSH. Instructions for this are available [here](./docs/ZSH%20setup.md)

1.  Navigate to the project root.

2.  Install the required version of node:

    ```bash
    brew install nvm
    nvm use 14.17.0
    ```

3.  Install node packages:

    ```bash
    npm install
    ```

4.  Create a copy of the sample `.env` file which points to a mocked API:

    ```bash
    cp sample.env .env
    ```

6.  Start the redis server:

    ```bash
    docker run -it -p 6379:6379 redis:3.2
    ```

6.  Start the mocked SSO:

    ```bash
    docker run -it -p 8080:8080 gcr.io/sre-docker-registry/github.com/uktrade/mock-sso:latest
    ```

7.  Start the mocked backend (this command is included in `.bin.sample` as `start-sandbox`):

    ```bash
    cd test/sandbox
    docker build -t data-hub-sandbox .
    docker run --rm --name data-hub-sandbox -it -p 8001:8000 data-hub-sandbox
    ```

8.  Start the node server

    **In production mode:**

    ```bash
    export NODE_ENV=production
    npm run build && npm start
    ```

    This will build static assets beforehand and then run the app.

    **In development mode:**

    ```bash
    npm run develop
    ```

    The server will watch for changes and rebuild sass or compile js using webpack as
    needed. Changes to server side code will result in the server autorestarting.
    The server will run with the node debug flag so you can debug with Webstorm
    or Visual Studio Code.

### Environment variables

List of all environment variables can be found in the source code of [envSchema.js](./src/config/envSchema.js).

## Making changes

See the [contributing guide](./CONTRIBUTING.md).

## Formatting markdown files

You can use Prettier to automatically reformat markdown files, which is very useful for tables:

```bash
prettier --write README.md
```

On Webstorm you can use `ALT+SHIFT+COMMAND+P` shortcut.
