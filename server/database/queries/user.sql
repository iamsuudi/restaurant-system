-- name: CreateUser :one
INSERT INTO "user" (name, email, phone, role, picture)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateUserInfo :one
UPDATE "user"
SET
    name = COALESCE(sqlc.narg('name'), name),
    email = COALESCE(sqlc.narg('email'), email),
    phone = COALESCE(sqlc.narg('phone'), phone),
    role = COALESCE(sqlc.narg('role'), role),
    picture = COALESCE(sqlc.narg('picture'), picture)
WHERE id = $1
RETURNING *;

-- name: GetUserByEmail :one
SELECT u.*, a.blocked AS blocked
FROM "user" u
LEFT JOIN account a ON u.id = a.user_id
WHERE u.email = $1 AND u.deleted_at IS NULL;

-- name: GetUserByID :one
SELECT u.*, a.blocked AS blocked
FROM "user" u
LEFT JOIN account a ON u.id = a.user_id
WHERE u.id = $1 AND u.deleted_at IS NULL;

-- name: GetUserRole :one
SELECT role FROM "user" WHERE id = $1;

-- name: SoftDeleteUser :exec
UPDATE "user"
SET deleted_at = NOW()
WHERE id = $1;

-- name: ListUsers :many
SELECT u.*, a.blocked AS blocked
FROM "user" u
LEFT JOIN account a ON u.id = a.user_id
WHERE u.deleted_at IS NULL
ORDER BY u.name ASC;
