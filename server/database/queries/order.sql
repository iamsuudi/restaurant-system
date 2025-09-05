-- name: CreateMenuItem :one
INSERT INTO menu_item (name, description, price, status)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetMenuItem :one
SELECT * FROM menu_item WHERE id = $1;

-- name: ListMenuItems :many
SELECT * FROM menu_item ORDER BY created_at DESC;

-- name: UpdateMenuItem :one
UPDATE menu_item
SET name = $2,
    description = $3,
    price = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteMenuItem :exec
DELETE FROM menu_item WHERE id = $1;


-- name: CreateOrder :one
INSERT INTO "order" (waiter_id, status, table_number)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetOrder :one
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.id = $1;

-- name: ListOrders :many
SELECT * FROM "order" ORDER BY created_at DESC;

-- name: UpdateOrderStatus :one
UPDATE "order"
SET status = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: DeleteOrder :exec
DELETE FROM "order" WHERE id = $1;


-- name: AddOrderItem :one
INSERT INTO order_item (order_id, menu_item_id, quantity)
VALUES ($1, $2, $3)
RETURNING *;

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
