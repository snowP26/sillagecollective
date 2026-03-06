-- name: CreateUser :one
INSERT INTO users (
    email,
    name,
    username,
    password_hash,
    role
) VALUES (
    $1, $2, $3, $4, $5
)
RETURNING *;