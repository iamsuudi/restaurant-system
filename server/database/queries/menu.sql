-- name: CreateMenuItem :one
INSERT INTO menu_item (name, description, price, status, picture, category, ingredients)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetMenuItem :one
SELECT * FROM menu_item WHERE id = $1;

-- name: ListMenuItems :many
SELECT * FROM menu_item ORDER BY created_at DESC;

-- name: ListActiveMenuItems :many
SELECT * FROM menu_item WHERE status = TRUE ORDER BY created_at DESC;

-- name: UpdateMenuItem :one
UPDATE menu_item
SET
    name = COALESCE(sqlc.narg('name'), name),
    price = COALESCE(sqlc.narg('price'), price),
    status = COALESCE(sqlc.narg('status'), status),
    picture = COALESCE(sqlc.narg('picture'), picture),
    category = COALESCE(sqlc.narg('category'), category),
    description = COALESCE(sqlc.narg('description'), description),
    ingredients = COALESCE(sqlc.narg('ingredients'), ingredients),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteMenuItem :exec
DELETE FROM menu_item WHERE id = $1;
