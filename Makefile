WEB_ENV_FILE ?= apps/web/.env
COMPOSE_ENV_ARGS := $(if $(wildcard $(WEB_ENV_FILE)),--env-file $(WEB_ENV_FILE),)
COMPOSE := docker compose $(COMPOSE_ENV_ARGS)
PROJECT_CONTAINERS := drivectrl-mongodb drivectrl-backend drivectrl-frontend
PROJECT_NETWORK := drivecontrol-net

.PHONY: build clean reset restart up down logs ps

build:
	$(COMPOSE) build

clean:
	@echo "Limpiando contenedores y red Docker del proyecto..."
	@$(COMPOSE) down --remove-orphans || true
	@docker rm -f $(PROJECT_CONTAINERS) 2>/dev/null || true
	@docker network rm $(PROJECT_NETWORK) 2>/dev/null || true
	@echo "Limpieza Docker completada. Ahora puedes ejecutar: make build && make up"

reset:
	@echo "ADVERTENCIA: esto elimina contenedores, red y volumenes del proyecto."
	@$(COMPOSE) down -v --remove-orphans || true
	@docker rm -f $(PROJECT_CONTAINERS) 2>/dev/null || true
	@docker network rm $(PROJECT_NETWORK) 2>/dev/null || true
	@echo "Reset completado. Se eliminaron datos locales de volumenes Docker del proyecto."

restart: clean build up

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down --remove-orphans

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps
