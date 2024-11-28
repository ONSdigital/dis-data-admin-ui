BUILD_TIME = $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT = $(shell git rev-parse HEAD)
VERSION ?= $(shell git tag --points-at HEAD | grep ^v | head -n 1)

.PHONY: audit
audit: ## Runs checks for security vulnerabilities on dependencies (including transient ones)
	npm audit

.PHONY: build
build: env-setup ## Builds binary of application code and stores in bin directory as dis-data-admin-ui
	npm run build

.PHONY: debug
debug: env-setup ## Used to run code locally in debug mode
	npm run dev

.PHONY: lint
lint:
	npm run lint

.PHONY: test
test: ## Runs unit tests including checks for race conditions and returns coverage
	exit

.PHONY: test-component
test-component: ## Runs component test suite
	exit

.PHONY: env-setup
env-setup: ## Setup env variables for healthcheck
	$(shell sed -i~ '/^BUILD_TIME=/s/=.*/="$(BUILD_TIME)"/' .env)
	$(shell sed -i~ '/^GIT_COMMIT=/s/=.*/="$(GIT_COMMIT)"/' .env)
	$(shell sed -i~ '/^VERSION=/s/=.*/="$(VERSION)"/' .env)
