-- name: InsertAuditLog :exec
INSERT INTO activity_log (
    actor_id, target_user_id, target_menu_id, diff,
    action_type, object_type, target_order_id
)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- name: GetAuditLog :one
SELECT sqlc.embed(log), sqlc.embed(au), sqlc.embed(tu),
    sqlc.embed(tu), sqlc.embed(mi), sqlc.embed(o)
FROM activity_log log
JOIN "user" au ON au.id = log.actor_id
LEFT JOIN menu_item mi ON mi.id = log.target_menu_item_id
LEFT JOIN "order" o ON o.id = log.target_order_id
LEFT JOIN "user" tu ON tu.id = log.target_user_id
LEFT JOIN "order" o ON o.id = log.target_order_id
WHERE log.id = $1;

-- name: ListAuditLogs :many
SELECT sqlc.embed(log), sqlc.embed(au), sqlc.embed(tu),
    sqlc.embed(tu), sqlc.embed(mi), sqlc.embed(o)
FROM activity_log log
JOIN "user" au ON au.id = log.actor_id
LEFT JOIN menu_item mi ON mi.id = log.target_menu_item_id
LEFT JOIN "order" o ON o.id = log.target_order_id
LEFT JOIN "user" tu ON tu.id = log.target_user_id
LEFT JOIN "order" o ON o.id = log.target_order_id
ORDER BY log.ts DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountListAuditLogs :one
SELECT COUNT(*)
FROM activity_log log
JOIN "user" u ON u.id = log.actor_id;
