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
	exit

.PHONY: build
build: ## Builds binary of application code and stores in bin directory as dis-data-admin-ui
	exit

.PHONY: convey
convey: ## Runs unit test suite and outputs results on http://127.0.0.1:8080/
	goconvey ./...

.PHONY: debug
debug: ## Used to run code locally in debug mode
	go build -tags 'debug' $(LDFLAGS) -o $(BINPATH)/dis-data-admin-ui
	HUMAN_LOG=1 DEBUG=1 $(BINPATH)/dis-data-admin-ui

.PHONY: delimiter-%
delimiter-%:
	@echo '===================${GREEN} $* ${RESET}==================='

.PHONY: fmt
fmt: ## Run Go formatting on code
	go fmt ./...

.PHONY: lint
lint:
	exit

.PHONY: lint-local
lint-local: ## Use locally to run linters against Go code
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.55.2
	golangci-lint run ./...

.PHONY: test
test: ## Runs unit tests including checks for race conditions and returns coverage
	exit

.PHONY: test-component
test-component: ## Runs component test suite
	exit

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
