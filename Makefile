.PHONY: build clean up down

build:
	docker build -t fis-app .

clean:
	docker rmi fis-app

up:
	docker-compose up -d

down:
	docker-compose down