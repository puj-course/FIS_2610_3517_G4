.PHONY: build clean up down logs ps

build:
	docker compose build

clean:
	docker compose down --rmi local --volumes --remove-orphans

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps
