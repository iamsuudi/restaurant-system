-- name: CreateAccount :exec
INSERT INTO account (user_id, password_hash)
VALUES ($1, $2);

-- name: GetAccount :one
SELECT * FROM account
WHERE account.user_id = $1;

-- name: CreateUser :one
INSERT INTO "user" (name, email, phone, role, picture)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateUserInfo :one
UPDATE "user"
SET name = $2, picture = $5, email = $3, phone = $4
WHERE id = $1
RETURNING *;

-- name: GetUserByEmail :one
SELECT *
FROM "user"
WHERE email = $1 AND deleted_at IS NULL;

-- name: GetUserByID :one
SELECT *
FROM "user"
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUserRole :one
SELECT role FROM "user" WHERE id = $1;

-- name: UpdateUserRole :exec
UPDATE "user"
SET role = $2
WHERE id = $1;

-- name: SoftDeleteUser :exec
UPDATE "user"
SET deleted_at = NOW()
WHERE id = $1;

-- name: ListUsers :many
SELECT *
FROM "user"
WHERE deleted_at IS NULL;
