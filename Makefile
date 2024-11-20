BINPATH ?= build

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

BUILD_TIME=$(shell date +%s)
GIT_COMMIT=$(shell git rev-parse HEAD)
VERSION ?= $(shell git tag --points-at HEAD | grep ^v | head -n 1)

LDFLAGS = -ldflags "-X main.BuildTime=$(BUILD_TIME) -X main.GitCommit=$(GIT_COMMIT) -X main.Version=$(VERSION)"

.PHONY: all
all: delimiter-AUDIT audit delimiter-LINTERS lint delimiter-UNIT-TESTS test delimiter-COMPONENT_TESTS test-component delimiter-FINISH ## Runs multiple targets, audit, lint, test and test-component

.PHONY: audit
audit: ## Runs checks for security vulnerabilities on dependencies (including transient ones)
	npm audit

.PHONY: build
build: ## Builds binary of application code and stores in bin directory as dis-data-admin-ui
	npm run build

.PHONY: convey
convey: ## Runs unit test suite and outputs results on http://127.0.0.1:8080/
	goconvey ./...

.PHONY: debug
debug: ## Used to run code locally in debug mode
	npm run dev

.PHONY: delimiter-%
delimiter-%:
	@echo '===================${GREEN} $* ${RESET}===================

.PHONY: lint
lint:
	npm run lint

.PHONY: test
test: ## Runs unit tests including checks for race conditions and returns coverage
	exit

.PHONY: test-component
test-component: ## Runs component test suite
	$(MAKE) test-server &
	sleep 5
	ps -eo pid,args | grep '[0-9] node server.js'
	npm install && npx playwright install && npx playwright install-deps && npm run test:component
	$(MAKE) kill-test-server

.PHONY: kill-test-server
kill-test-server: ## Kills test server
	pid=$$(ps -eo pid,args | grep '[0-9] node server.js' | cut -f1 -w);\
	[[ -n "$$pid" ]] && kill $$pid

.PHONY: test-server
test-server: ## Runs test server
	cd tests/fakeapi && npm install && npm run start


.PHONY: help
help: ## Show help page for list of make targets
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)
