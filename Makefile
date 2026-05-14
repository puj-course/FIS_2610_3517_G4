WEB_ENV_FILE ?= apps/web/.env
COMPOSE_ENV_ARGS := $(if $(wildcard $(WEB_ENV_FILE)),--env-file $(WEB_ENV_FILE),)
COMPOSE := docker compose $(COMPOSE_ENV_ARGS)

.PHONY: build clean up down logs ps

build:
	$(COMPOSE) build

clean:
	$(COMPOSE) down --rmi local --volumes --remove-orphans

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps
