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
	$(docker-base) up -d --build
start-mock:
	$(docker-mock) up -d --build
start-e2e:
	$(docker-e2e) up -d --build
start-dev:
	$(docker-dev) up -d --build

lint:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend bash -c 'mkdir -p reports \
		&& yarn lint:js --format junit --output-file reports/eslint.xml && yarn lint:sass'

unit-tests:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend yarn test:unit

unit-tests-ci:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend bash -c 'yarn nyc --reporter=lcov --reporter=json --report-dir=coverage yarn test:unit --reporter mocha-circleci-reporter'

unit-client-tests:
	$(docker-base) build
	$(docker-base) run --no-deps --rm frontend bash -c 'yarn test:unit-client --reporter mocha-circleci-reporter'

functional-tests: start-mock
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && yarn test:functional'

functional-tests-ci: start-mock
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) \
 		&& yarn test:functional --parallel --record --key $(CYPRESS_DASHBOARD_KEY) --ci-build-id $(CIRCLE_BUILD_NUM)'

visual-tests: start-mock
	$(docker-mock) exec frontend bash -c '$(wait-for-frontend) && yarn test:visual'

e2e-tests-lep:
	OAUTH2_DEV_TOKEN=lepStaffToken make start-e2e
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && yarn test:e2e:lep'

e2e-tests-da:
	OAUTH2_DEV_TOKEN=daStaffToken make start-e2e
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && yarn test:e2e:da'

e2e-tests-dit:
	OAUTH2_DEV_TOKEN=ditStaffToken make start-e2e
	$(docker-e2e) exec frontend bash -c '$(wait-for-frontend) && yarn test:e2e:dit'

clean:
	$(docker-mock) down -v --remove-orphans
	$(docker-e2e) down -v --remove-orphans
	