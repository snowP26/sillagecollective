# ====== VARIABLES ======
DB_USER=postgresql
DB_PASSWORD=strong_admin
DB_NAME=sillage_collective
DB_PORT=5433
DB_HOST=localhost

DB_URL=postgresql://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=disable

# ====== POSTGRES (DOCKER) ======
postgres:
	docker run --name sillage-postgres -p $(DB_PORT):5432 \
	-e POSTGRES_USER=$(DB_USER) \
	-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
	-e POSTGRES_DB=$(DB_NAME) \
	-d postgres:16

createdb:
	docker exec -it sillage-postgres createdb --username=$(DB_USER) --owner=$(DB_USER) $(DB_NAME)

dropdb:
	docker exec -it sillage-postgres dropdb $(DB_NAME)

# ====== MIGRATION (golang-migrate) ======
migrateup:
	migrate -path server/db/migration -database "$(DB_URL)" -verbose up

migratedown:
	migrate -path server/db/migration -database "$(DB_URL)" -verbose down

# ====== SQLC ======
sqlc:
	sqlc generate

# ====== RUN APP ======
server:
	go run main.go

# ====== TEST ======
test:
	go test ./... -v