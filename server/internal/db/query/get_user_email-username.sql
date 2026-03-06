-- name: GetUserByEmailOrUsername :one
SELECT id, email, name, username, password_hash, role, created_at
FROM users
WHERE email = $1 OR username = $1;