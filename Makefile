NVM_SOURCE_PATH ?= $(HOME)/.nvm/nvm.sh
ifneq ("$(wildcard $(NVM_SOURCE_PATH))","")
	NVM_EXEC = source $(NVM_SOURCE_PATH) && nvm exec --
endif
NPM = $(NVM_EXEC) npm

BUILD_TIME = $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT = $(shell git rev-parse HEAD)
VERSION ?= $(shell git tag --points-at HEAD | grep ^v | head -n 1)
PLAYWRIGHT_WORKERS ?= 1

.PHONY: audit
audit: ## Runs checks for security vulnerabilities on dependencies (including transient ones)
	$(MAKE) node-modules && $(NPM) run audit

.PHONY: build
build: env-setup  ## Builds binary of application code and stores in bin directory as dis-data-admin-ui
	$(MAKE) node-modules && $(NPM) run build

.PHONY: debug
debug: env-setup ## Used to run code locally in debug mode
	$(NPM) run dev

.PHONY: lint
lint: 
	$(MAKE) node-modules && $(NPM) run lint

.PHONY: node-modules
node-modules:
	$(NPM) install --legacy-peer-deps

.PHONY: test
test: node-modules ## Runs unit tests including checks for race conditions and returns coverage
	$(NPM) run test -- --coverage

.PHONY: test-component
test-component: ## Runs component test suite
	$(MAKE) test-server &
	sleep 5
	ps -eo pid,args | grep '[0-9] node server.js'
	$(MAKE) node-modules && npx playwright install && npx playwright install-deps && $(NPM) run test:component -- --workers=$(PLAYWRIGHT_WORKERS)
	$(MAKE) kill-test-server

.PHONY: kill-test-server
kill-test-server: ## Kills test server
	pid=$$(ps -eo pid,args | grep '[0-9] node server.js' | awk '{print $$1}');\
	[ -n "$$pid" ] && kill $$pid

.PHONY: test-server
test-server: ## Runs test server
	cd tests/fakeapi && $(NPM) install && $(NPM) run start


.PHONY: env-setup
env-setup: ## Setup env variables for healthcheck
	$(shell sed -i~ '/^BUILD_TIME=/s/=.*/="$(BUILD_TIME)"/' .env)
	$(shell sed -i~ '/^GIT_COMMIT=/s/=.*/="$(GIT_COMMIT)"/' .env)
	$(shell sed -i~ '/^VERSION=/s/=.*/="$(VERSION)"/' .env)
