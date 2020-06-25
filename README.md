# Data Hub frontend

[![CircleCI](https://circleci.com/gh/uktrade/data-hub-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/data-hub-frontend)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/uktrade/data-hub-frontend.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/uktrade/data-hub-frontend/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/uktrade/data-hub-frontend.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/uktrade/data-hub-frontend/context:javascript)

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
- [Folder structure](./docs/Folder%20structure.md)
- [Sub-apps](./docs/Sub-apps.md)
- [Feature flags](./docs/Feature%20flags.md)
- [Upgrading Node version](./docs/Upgrading%20Node%20version.md)
- [Single sign-on](./docs/Single%20sign-on.md)
- [Making changes](#making-changes)
- [Formatting markdown files](#formatting-markdown-files)

## Getting started

### Running the project within Docker (recommended method)

**Note for Mac Users:** By default, docker on Mac will restrict itself to using just 2GB of memory. This [should be increased](https://docs.docker.com/docker-for-mac/#resources) to at least 6GB for options 1 and 4GB for option 2 to avoid running in to unexpected problems.

**Note for all users:** The docker volumes for the frontend, api and sandbox api are all mounted. This means that you should not need to rebuild the containers when you make changes and you should see your changes reflected immediately. However, there are certain changes that will require you to rebuild. In that case, bring down the containers and run the script again. The scripts will always rebuild you containers if it detects code changes, otherwise they will be quick to come up and will just use the images it has in the docker cache.

#### Option 1 (the full development stack - recommended for development)

1. Clone this repo and the `data-hub-api` repo into the same parent folder. Go to the front-end project root.

2. Create a copy of a sample `.env` file which points to a mocked API:

    ```bash
    cp sample.env .env
    ```
    
    Real values are available in vault. To log into vault you'll need to be on the VPN and create a personal access token from the developer settings in your GitHub account.

3. Install docker if you don't have it already - https://docs.docker.com/get-docker/

4. Run `make start-dev`.

5. Once the process has completed you can access the frontend at `http://localhost:3000` and the api at `http://localhost:8000`.

6. You can check Docker logs by running:

    ```bash
    `make docker-dev` logs -f
    ```

#### Option 2 (the mock stack - using the sandbox api for running functional tests)

1. Clone this repo and go to the project root

2. Create a copy of a sample `.env` file which points to a mocked API:

    ```bash
    cp sample.env .env
    ```
    
    Real values are available in vault. To log into vault you'll need to be on the VPN and create a personal access token from the developer settings in your GitHub account.

3. Install docker if you don't have it already - https://docs.docker.com/get-docker/

4. Run `make start-mock`.

5. You can now access the frontend at `http://localhost:3000`.

6. You can check Docker logs by running:

    ```bash
    `make docker-mock` logs -f
    ```

### Running the project natively

**Note for all users** If you wish to run the functional tests against your native frontend, you will need to pass a config flag to point cypress to run against port 3000 - `npm run test:functional:watch --config baseUrl=http://localhost:3000`.

1.  Navigate to the project root.

2.  Install the required version of node:

    ```bash
    brew install nvm
    nvm use 10.16.0
    ```

3.  Install node packages:

    ```bash
    npm install
    ```

4.  Create a copy of a sample `.env` file which points to a mocked API:

    ```bash
    cp sample.env .env
    ```

6.  Start redis server:

    ```bash
    docker run -it -p 6379:6379 redis:3.2
    ```

6.  Start the mocked SSO:

    ```bash
    docker run -it -p 8080:8080 quay.io/uktrade/mock-sso:latest
    ```

7.  Start the mocked backend:

    ```bash
    docker run -it -p 8001:8001 ukti/data-hub-sandbox:1.0.0
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

    Server will watch for changes and rebuild sass or compile js using webpack as
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
