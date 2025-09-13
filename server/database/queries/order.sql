-- name: CreateOrder :one
INSERT INTO "order" (waiter_id, status, table_number, total_price, note)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateOrder :one
UPDATE "order"
SET
    note = COALESCE(sqlc.narg('note'), note),
    status = COALESCE(sqlc.narg('status'), status),
    waiter_id = COALESCE(sqlc.narg('waiter_id'), waiter_id),
    total_price = COALESCE(sqlc.narg('total_price'), total_price),
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
INSERT INTO order_item (order_id, menu_item_id, quantity, price, category)
VALUES ($1, $2, $3, $4, $5)
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

-- name: ListPendingOrders :many
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status = 'pending'
ORDER BY o.created_at ASC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountPendingOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status = 'pending';

-- name: ListProcessingOrders :many
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status = 'processing'
ORDER BY o.created_at ASC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountProcessingOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status = 'processing';

-- name: ListReadyOrders :many
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status = 'ready'
ORDER BY o.created_at ASC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountReadyOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status = 'ready';

-- name: ListDeliveredOrders :many
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status = 'delivered'
ORDER BY o.delivered_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountDeliveredOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status = 'delivered';

-- name: ListCancelledOrders :many
SELECT o.*, u.name AS waiter_name
FROM "order" o
LEFT JOIN "user" u ON o.waiter_id = u.id
WHERE o.status = 'cancelled'
ORDER BY o.created_at ASC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountCancelledOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status = 'cancelled';

-- name: CountActiveOrders :one
SELECT COUNT(*)
FROM "order"
WHERE "order".status IN ('pending', 'processing', 'ready');
