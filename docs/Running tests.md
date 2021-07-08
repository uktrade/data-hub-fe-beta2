# Running tests

## Coding standards

Prettier and Sass linter will run as part of the build, assure you run the command below before committing:

`$ npm run test:lint`

## Functional Tests

The aim of this test suite is perform functional tests of frontend components in isolation.

### Setup

You will need to run the sandbox api to run functional tests.

Sandbox is as a light replacement for API backend and it's used only by functional tests.

### Using sandbox within docker (preferred method)

From the project root directory run `make start-mock`.
   
This will start up the sandbox api in conjunction with the frontend, mock-sso, webpack and redis. You don't need to rebuild the image when you make changes.

### Using sandbox within docker and with local frontend

1. Build Sandbox image `docker build -t data-hub-sandbox ./test/sandbox`

2. Start the container with `docker run -it -p 8000:8000 data-hub-sandbox`

3. Change your `API_ROOT` in your env file to point to `http://localhost:8000` and then run the frontend locally with `npm run develop`.

### Starting sandbox on host machine

```bash
cd test/sandbox
npm install
npx nodemon .
```

### Running the tests

Notice that before running the tests the application should be up and running.

By default cypress will run on electron headlessly, you can read more about it [here](https://docs.cypress.io/guides/core-concepts/launching-browsers.html#Electron-Browser)

If you are not running the sandbox through docker using the preferred method and want to run against your native implementation you will need to pass an additional argument to the below commands:

`--config baseUrl=http://localhost:3000`

Execute all the tests on `specs` in chrome browser:

`$ npm run test:functional -- --browser chrome`

### Running the tests manually in cypress interface

`$ npm run test:functional:watch`

### Running a specific spec

`$ npm run test:functional -- --spec test/functional/cypress/specs/nav-spec.js`

## E2E Tests

The aim of this test suite is perform end to end tests, simulating a user flow.

### Setup

Pre-requisites:

Ensure you have [node](https://nodejs.org/en/download/) v10 installed then install dependencies:

`$ npm install`

### Setting up E2E tests within docker (preferred method)
1. In `test/cypress/support/commands.js`, find the `loadFixture` Cypress command and change `${backend_url}` to `http://localhost:8000`. 

2. In `docker-compose.frontend.yml`, change the environment variable `OAUTH2_AUTH_URL` to point to `http://localhost:8080/o/authorize`.

3. Run the relevant make command, for example `make start-e2e-dit`.

### Setting up E2E tests within docker and with local frontend
1. Add `ALLOW_TEST_FIXTURE_SETUP=True` to `.env` in Data Hub API.  

### Running the tests

Notice that before running the tests the application should be up and running.

You will also need data hub api application started with the initial fixutres loaded. This can be done
by running `start-uat.sh` located on the root of the api repository.

The main e2e test suite is triggered by running the following command:

`$ npm run test:e2e:dit -- --browser chrome`

### Setting up users with different permissions

On CircleCi we run E2E tests against users with different permissions. We do this via the environment variable `OAUTH2_DEV_TOKEN`.
Essentially we have users with different permissions setup in a job via `OAUTH2_DEV_TOKEN` and then we run tests with the specified permissions tag.
So for setting up a test for a user of type `LEP` you need to:

- add a token to the backend with a token associated to the permissions type. e.g `lepStaffToken`
- add this token to the environment variable `OAUTH2_DEV_TOKEN` in the circleCi job
- specify which suite to use when running `cypress`. e.g `npm run test:e2e:lep -- --browser chrome`

### Permission tags

There are also 3 other test suites, which run permission specs against users that have particular
permissions for their roles, you can trigger these tests by running either of the commands below:

`$ npm run test:e2e:lep -- --browser chrome`

or

`$ npm run test:e2e:da -- --browser chrome`

or

`$ npm run test:e2e:dit -- --browser chrome`

### Running the tests manually in cypress interface

`$ npm run test:e2e:watch`

### Running a specific spec

`$ npm run test:e2e:dit -- --spec test/end-to-end/cypress/specs/DIT/local-nav-spec.js`

## Visual Tests

The aim of this suite is taking screenshots from pages and comparing to baselines
to ensure consistency between builds.

### Folder structure

Screenshots will be stored in the root of the project. We commit the baselines and ignore the comparison diff images. If we need to update the baseline screenshot we need to delete the old baseline and rerun the test (it will then copy the new screenshot saved in comparison folder into the baseline folder)

```
- visual-screenshots
  - baseline
  - comparison
  - diff
```

### Browserstack environment variables

Copy `sample.env` to `.env` and add `BROWSERSTACK_ACCESS_KEY` and `BROWSERSTACK_USERNAME` which can be found in Rattic.

### Running the tests

Execute the command below:

```bash
make start-mock
make visual-tests
```

### Updating the baseline image

Updating the baseline consists in 2 steps:

- 1:. Run the visual tests on your machine, if the baseline is no longer the correct representation of the page in test then execute step #2:

- 2:. Run `$ npm run test:visual:update` to update the failed tests with updated images of how the page in test should look like.

## Visual Component Tests

The aim of this suite is taking screenshots from storybook and comparing to baselines
to ensure consistency between builds.

### Folder structure

```
- cypress-visual-screenshots
  - baseline
  - comparison
  - diff
```

### Running the tests

Execute the command below:

```bash
make start-storybook
make visual-component-tests
```

### Updating the baseline image

Updating the baseline consists in 2 steps: 

- 1:. Running the visual component tests locally and verifying the failures are valid

- 2:. Running `$ npm run test:visual-component:update` which will copy all comparison images that have a failure associated to them into the baseline folder, replacing the old baseline images.

There is work to be done to allow update of a given baseline image rather than only have the option to update all of them at once.

## Accessibility tests
The aim of this suite is to ensure our HTML pages are usable by as many people as possible.

  4 Tabs:
  
  1. cd test/sandbox && npm install && npx nodemon .
  2. redis-server
  3. npm run develop
  4. npm run test:a11y

## Cypress code coverage

As part of cypress test suites (functional and e2e), code coverage reports can be generated.

### Code coverage locally

Steps:

- Ensure you NODE_ENV is either `test` or `development` in order for client side code to be instrumented.
- Start the application by running `$ npm run start:coverage`, this will ensure server side code is instrumented.
- Execute a spec or suite and look for `cypress-coverage` folder output in the root of the folder.

### Code coverage in CI

CI is configured to capture and save all code coverage reports as an artifact.
