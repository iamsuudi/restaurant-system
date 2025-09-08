-- name: CreateOrder :one
INSERT INTO "order" (waiter_id, status, table_number, note)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdateOrder :one
UPDATE "order"
SET
    note = COALESCE(sqlc.narg('note'), note),
    waiter_id = COALESCE(sqlc.narg('waiter_id'), waiter_id),
    status = COALESCE(sqlc.narg('status'), status),
    table_number = COALESCE(sqlc.narg('table_number'), table_number),
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: GetOrder :one
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.id = $1;

-- name: UpdateOrderStatus :one
UPDATE "order"
SET status = $2,
    updated_at = NOW(),
    delivered_at = Now()
WHERE id = $1
RETURNING *;

-- name: DeleteOrder :exec
DELETE FROM "order" WHERE id = $1;


-- name: AddOrderItem :one
INSERT INTO order_item (order_id, menu_item_id, quantity)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ClearOrderItems :exec
DELETE FROM order_item WHERE order_id = $1;

-- name: GetOrderItems :many
SELECT oi.*, mi.name, mi.price
FROM order_item oi
JOIN menu_item mi ON oi.menu_item_id = mi.id
WHERE oi.order_id = $1
ORDER BY oi.created_at ASC;

-- name: UpdateOrderItemQuantity :one
UPDATE order_item
SET quantity = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteOrderItem :exec
DELETE FROM order_item WHERE id = $1;

-- name: GetOrderWithItems :many
SELECT
    o.id AS order_id,
    o.waiter_id,
    u.name AS waiter_name,
    o.status,
    o.table_number,
    o.created_at AS order_created_at,
    oi.id AS order_item_id,
    oi.quantity,
    mi.id AS menu_item_id,
    mi.name AS menu_item_name,
    mi.price AS menu_item_price
FROM "order" o
LEFT JOIN order_item oi ON o.id = oi.order_id
LEFT JOIN menu_item mi ON oi.menu_item_id = mi.id
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.id = $1
ORDER BY oi.created_at ASC;

-- name: ListOrders :many
SELECT
    o.id AS order_id,
    o.waiter_id,
    u.name AS waiter_name,
    o.status,
    o.table_number,
    o.created_at AS order_created_at,
    oi.id AS order_item_id,
    oi.quantity,
    mi.id AS menu_item_id,
    mi.name AS menu_item_name,
    mi.price AS menu_item_price
FROM "order" o
LEFT JOIN order_item oi ON o.id = oi.order_id
LEFT JOIN menu_item mi ON oi.menu_item_id = mi.id
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status != 'Delivered'
ORDER BY o.created_at ASC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountListOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status != 'Delivered';

-- name: ListCompletedOrders :many
SELECT
    o.id AS order_id,
    o.waiter_id,
    u.name AS waiter_name,
    o.status,
    o.table_number,
    o.created_at AS order_created_at,
    oi.id AS order_item_id,
    oi.quantity,
    mi.id AS menu_item_id,
    mi.name AS menu_item_name,
    mi.price AS menu_item_price
FROM "order" o
LEFT JOIN order_item oi ON o.id = oi.order_id
LEFT JOIN menu_item mi ON oi.menu_item_id = mi.id
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status = 'Delivered'
ORDER BY o.delivered_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountListCompletedOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status = 'Delivered';
