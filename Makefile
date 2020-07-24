docker-base = docker-compose -p dh -f docker-compose.base.yml
docker-mock = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.mock.yml
docker-e2e = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.e2e.yml
docker-dev = docker-compose -p dh -f docker-compose.base.yml -f docker-compose.e2e.yml -f docker-compose.dev.yml

wait-for-frontend = dockerize -wait tcp://localhost:3000/healthcheck -timeout 5m -wait-retry-interval 5s

# Helper commands to execute docker-compose for a specific setup
# e.g. "`make docker-base` logs"
docker-base:
	@echo $(docker-base)
docker-mock:
	@echo $(docker-mock)
docker-e2e:
	@echo $(docker-e2e)
docker-dev:
	@echo $(docker-dev)

start-base:
	$(docker-base) up -d --build --force-recreate
start-mock:
	$(docker-mock) up -d --build --force-recreate
start-e2e:
	$(docker-e2e) up -d --build --force-recreate
start-dev:
	$(docker-dev) up -d --build --force-recreate

lint:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend bash -c 'mkdir -p reports && npm run lint'

unit-tests:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend npm run test:unit

unit-tests-ci:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend bash -c 'npx nyc --reporter=lcov --reporter=json --report-dir=coverage npm run test:unit -- --reporter mocha-circleci-reporter'

unit-client-tests:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend bash -c 'npm run test:unit-client -- --reporter mocha-circleci-reporter'

functional-tests: start-mock
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && npm run test:functional'

functional-tests-ci: start-mock
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) \
 		&& npm run test:functional -- --parallel --record --key $(CYPRESS_DASHBOARD_KEY) --ci-build-id $(CIRCLE_WORKFLOW_ID)'

visual-tests: start-mock
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && npm run test:visual'

e2e-tests-lep:
	OAUTH2_DEV_TOKEN=lepStaffToken make start-e2e
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:lep'

e2e-tests-da:
	OAUTH2_DEV_TOKEN=daStaffToken make start-e2e
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:da'

e2e-tests-dit:
	OAUTH2_DEV_TOKEN=ditStaffToken make start-e2e
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && npm run test:e2e:dit'

clean:
	$(docker-mock) down -v --remove-orphans
	$(docker-e2e) down -v --remove-orphans
