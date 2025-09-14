-- name: InsertAuditLog :exec
INSERT INTO activity_log (
    actor_id, target_user_id, target_menu_id, diff,
    action_type, object_type, target_order_id,
    target_user_name, target_menu_name
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);

-- name: GetAuditLog :one
SELECT log.*, au.name AS actor_name, au.role AS actor_role, au.picture AS actor_picture
FROM activity_log log
JOIN "user" au ON au.id = log.actor_id
WHERE log.id = $1;

-- name: ListAuditLogs :many
SELECT log.*, au.name AS actor_name, au.role AS actor_role, au.picture AS actor_picture
FROM activity_log log
JOIN "user" au ON au.id = log.actor_id
ORDER BY log.ts DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountListAuditLogs :one
SELECT COUNT(*)
FROM activity_log log
JOIN "user" u ON u.id = log.actor_id;
